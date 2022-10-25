import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { fstat } from 'fs';
import { join } from 'path';

import { AuthUser } from 'src/base/auth/authUser';
import { IAuthService } from 'src/base/auth/IAuthService';
import { Mailer } from 'src/base/email/mailer';
import { AccountEmail } from 'src/base/entity/platform-user/Account-Email.entity';
import { AccountVerifyCode } from 'src/base/entity/platform-user/Account-VerifyCode.entity';
import { AccountWallet } from 'src/base/entity/platform-user/Account-Wallet.entity';
import { Account } from 'src/base/entity/platform-user/Account.entity';
import { VerifyCodeType, VerifyCodePurpose, VerifyFlag } from 'src/base/entity/platform-user/VerifyCodeType';
import { W3Logger } from 'src/base/log/logger.service';
import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { AppConfig } from 'src/base/setting/appConfig';
import { AccountInfo } from 'src/viewModel/user-auth/AccountInfo';
import { AccountSearchResult } from 'src/viewModel/user-auth/AccountSearchResult';

import { AccountSigninRequest } from 'src/viewModel/user-auth/AccountSigninRequest';
import { AccountSignupRequest } from 'src/viewModel/user-auth/AccountSignupRequest';
import { ChangePasswordRequest } from 'src/viewModel/user-auth/ChangePasswordRequest';
import { EmailVerifyRequest } from 'src/viewModel/user-auth/EmailVerifyRequest';
import { SignTokenPayload } from 'src/viewModel/user-auth/SignTokenPayload';
import { VerifyCodeRequest } from 'src/viewModel/user-auth/VerifyCodeRequest';
import { Repository } from 'typeorm';

import { AccountBaseService } from '../base/account-base.service';


@Injectable()
export class AccountAuthService implements IAuthService {

  private CODE_EXPIRED_MINUTES: number = 10;

  logger: W3Logger;

  constructor(
    private readonly accountBaseService: AccountBaseService,
    @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_ACCOUNT_REPOSITORY.provide)
    private accountRepository: Repository<Account>,

    @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_ACCOUNT_EMAIL_REPOSITORY.provide)
    private accountEmailRepository: Repository<AccountEmail>,


    @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_ACCOUNT_WALLET_REPOSITORY.provide)
    private accountWalletRepository: Repository<AccountWallet>,

    @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_ACCOUNT_VERIFYCODE_REPOSITORY.provide)
    private accountVerifyCodeRepository: Repository<AccountVerifyCode>,

  ) {
    this.logger = new W3Logger(`AccountAuthService`);
  }
  async searchAccountsByEmail(email: string, verifiedOnly: boolean): Promise<AccountSearchResult[]> {
    return await this.accountBaseService.searchAccountsByEmail(email, verifiedOnly)
  }
  async signin(request: AccountSigninRequest): Promise<AuthUser> {

    let searchAccounts = await this.accountBaseService.searchAccountsByEmail(request.email, false);
    if (!searchAccounts || searchAccounts.length == 0) {
      throw new BadRequestException("email not exist");
    }
    let searchAccount = searchAccounts[0];
    if (!searchAccount.verified) {
      throw new BadRequestException("email for account does not verified");
    }
    let account = await this.accountBaseService.searchAccount(searchAccount.accountId);
    if (!account) {
      throw new BadRequestException("account not exist");
    }

    if (!account.allowLogin) {
      throw new BadRequestException("account is disabled to login");
    }
    let password_verify = request.password;
    let accountId = account.accountId;
    let authUser = await this.validateUser(accountId, password_verify);
    if (authUser) {
      const payload: SignTokenPayload = {
        id: authUser.id,
        email: request.email,
        address: '',
        first_name: authUser.name,
        groups: await this.accountBaseService.searchAccountGroups(accountId),
      };
      authUser.token = await this.accountBaseService.grantToken(payload);
    }
    return authUser;
  }


  async checkEmailExist(email: string): Promise<boolean> {
    const record = await this.accountEmailRepository.findOne({
      where: { email: email }
    });
    if (record) {
      return true;
    }
    return false;
  }

  async sendVerifyEmail(request: EmailVerifyRequest): Promise<Boolean> {
    let findAccounts = await this.searchAccountsByEmail(request.email, false);

    if (!findAccounts || findAccounts.length == 0) {
      throw new BadRequestException('email does not exist');
    }
    let searchAccount = findAccounts[0];
    this.logger.log(`sendVerifyEmail for account ${JSON.stringify(searchAccount)}`);
    let findAccount = await this.accountRepository.findOne({
      where: {
        accountId: searchAccount.accountId
      }
    });

    if (findAccount) {
      //generate verification code
      await this.clearCode(findAccount.accountId, request.email, VerifyCodeType.Email, request.verifyCodePurpose);
      let newCode: AccountVerifyCode = {
        id: 0,
        verifyType: VerifyCodeType.Email,
        purpose: request.verifyCodePurpose,
        verifyKey: request.email,
        code: this.generateVerifyCode(6),
        accountId: findAccount.accountId,
        created_time: new Date(),
        expired_time: new Date(new Date().getTime() + (this.CODE_EXPIRED_MINUTES * 1000 * 60))
      }
      await this.accountVerifyCodeRepository.save(newCode);

      //send email
      if ([VerifyCodePurpose.ResetPassword].indexOf(request.verifyCodePurpose) > -1) {
        await this.sendEmail(request.email, "Security email from web3go.xyz", this.generateEmail4VerifyCode(findAccount, newCode, this.CODE_EXPIRED_MINUTES));
      }
      if ([VerifyCodePurpose.Account].indexOf(request.verifyCodePurpose) > -1) {
        await this.sendEmail(request.email, "Account activate email from web3go.xyz", this.generateEmail4AccountActivate(request.verifyCodePurpose, request.email, findAccount, newCode, this.CODE_EXPIRED_MINUTES));
      }

      return true;
    }
    else {
      throw new BadRequestException('account with email does not exist');
    }
  }

  async clearCode(accountId: string, key: string, type: VerifyCodeType, purpose: VerifyCodePurpose) {
    await this.accountVerifyCodeRepository.delete({
      accountId: accountId,
      verifyKey: key,
      verifyType: type,
      purpose: purpose
    });
  }

  sendEmail(email: string, subject: string, html: string) {
    let mailer = new Mailer();
    mailer.send({
      to: email,
      subject: subject,
      html: html
    });
    return "email sent success";
  }
  generateEmail4VerifyCode(account: Account, code: AccountVerifyCode, expiredMinutes: number) {

    let email_template = join(__dirname, '../../..', 'public/code.html');
    var replacements = {
      NICK_NAME: account.nickName,
      EXPIRED_MINUTES: expiredMinutes.toString(),
      VERIFY_CODE: code.code
    };
    let htmlToSend = this.generateEmail(email_template, replacements);
    this.logger.debug(`generateEmail4VerifyCode:${htmlToSend}`);
    return htmlToSend;
  }

  generateEmail4AccountActivate(purpose: VerifyCodePurpose, email: string, account: Account, code: AccountVerifyCode, expiredMinutes: number) {
    let email_template = join(__dirname, '../../..', 'public/activate.html');

    let url = (AppConfig.BASE_WEB_URL || 'http://localhost:3000') + `/verifyEmail?accountId=${account.accountId}&email=${escape(email)}&code=${code.code}&verifyCodePurpose=${purpose}`;
    let replacements = {
      NICK_NAME: account.nickName,
      EXPIRED_MINUTES: expiredMinutes.toString(),
      ACTIVATE_URL: url,
      STATIC_ASSET_PREFIX: AppConfig.STATIC_ASSET_PREFIX
    };
    let htmlToSend = this.generateEmail(email_template, replacements);
    // this.logger.debug(`generateEmail4AccountActivate:${htmlToSend}`);
    return htmlToSend;
  }
  generateEmail(email_template_path: string, replacements: any) {
    this.logger.debug(`email_template_path:${email_template_path}`);
    var fs = require("fs");
    let data = fs.readFileSync(email_template_path);
    let email_content: string = '';
    if (data) {
      email_content = data.toString();
    }
    //update image links with prefix
    email_content = email_content.replace(/.\/images/g, AppConfig.STATIC_ASSET_PREFIX + 'images');

    let handlebars = require('handlebars');
    let template = handlebars.compile(email_content);

    let htmlToSend = template(replacements);
    // this.logger.debug(`generateEmail for email_template_path=${email_template_path}:${htmlToSend}`);
    return htmlToSend;
  }


  generateVerifyCode(codeLength: number): string {
    let code = "";
    var codeChars = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
    for (var i = 0; i < codeLength; i++) {
      var charNum = Math.floor((Math.random() * (new Date()).getTime()) % codeChars.length);
      code += codeChars[charNum];
    }
    return code;
  }

  async verifyCode(request: VerifyCodeRequest, clearAfterVerifiedSuccess: boolean = true, autoGenerateSignInToken: boolean = true): Promise<any> {
    this.logger.debug(`verify code:${JSON.stringify(request)}`);
    let findCode = await this.accountVerifyCodeRepository.findOne({
      where: {
        accountId: request.accountId,
        code: request.code,
        verifyKey: request.email,
        purpose: request.verifyCodePurpose
      }
    });
    if (findCode) {
      if (findCode.expired_time.getTime() < new Date().getTime()) {
        throw new BadRequestException("code expired,please resend new code.");
      }
      this.logger.debug(`verify code success:${JSON.stringify(request)}`);
      if ([VerifyCodePurpose.Account, VerifyCodePurpose.ResetPassword].indexOf(request.verifyCodePurpose) > -1) {
        let findEmail = await this.accountEmailRepository.findOne({
          where: {
            accountId: request.accountId,
            email: request.email
          }
        });
        if (findEmail) {
          findEmail.verified = VerifyFlag.Verified;
          await this.accountEmailRepository.save(findEmail);
        }
      }

      //remove verification code 
      if (clearAfterVerifiedSuccess) {
        await this.clearCode(request.accountId, request.email, VerifyCodeType.Email, request.verifyCodePurpose);
      }

      if ([VerifyCodePurpose.Account].indexOf(request.verifyCodePurpose) > -1 && autoGenerateSignInToken) {
        //
        let account = await this.accountBaseService.searchAccount(request.accountId);
        let payload: SignTokenPayload = {
          id: account.accountId,
          email: request.email,
          address: '',
          first_name: account.nickName,
          groups: await this.accountBaseService.searchAccountGroups(account.accountId)
        };
        let autoSignInToken = await this.accountBaseService.grantToken(payload);
        return {
          result: 'success',
          token: autoSignInToken,
          payload: payload
        };

      }
      return { result: 'success' };
    }
    throw new BadRequestException("verify failure");
  }

  async changePassword(request: ChangePasswordRequest): Promise<boolean> {
    let account = await this.accountRepository.findOne({ where: { accountId: request.accountId } });
    if (!account) {
      throw new BadRequestException('account not exist');
    }

    let verify = await this.verifyCode({
      accountId: request.accountId,
      email: request.email,
      code: request.code,
      verifyCodePurpose: VerifyCodePurpose.ResetPassword
    })
    if (!verify) {
      throw new BadRequestException('verify failure');
    }

    //change password 
    account.authMasterPassword = this.accountBaseService.passwordEncrypt(account.accountId, request.newPassword);
    await this.accountRepository.save(account);

    return true;
  }

  async createAccount4Email(request: AccountSignupRequest): Promise<AccountInfo> {

    let accountId = this.accountBaseService.generateAccountId();
    let newAccount: Account = {
      accountId: accountId,
      web3Id: '',
      nickName: request.nickName,
      avatar: '',
      created_time: new Date(),
      authMasterPassword: this.accountBaseService.passwordEncrypt(accountId, request.password),
      allowLogin: 1,
      last_login_time: new Date()
    }
    let newAccountEmail: AccountEmail = {
      accountId: accountId,
      email: request.email,
      verified: 0,
      created_time: new Date()
    }
    this.logger.debug(`start to create new account:${JSON.stringify(newAccount)}`);

    await this.accountRepository.manager.connection.transaction(async tm => {
      newAccount.web3Id = await this.accountBaseService.generateWeb3Id(tm);
      this.logger.debug(newAccount);
      this.logger.debug(newAccountEmail);
      await tm.save(Account, newAccount);
      await tm.save(AccountEmail, newAccountEmail);

    });
    delete newAccount.authMasterPassword;
    return {
      account: newAccount,
      accountEmails: [newAccountEmail],
      accountWallets: null
    };

  }

  async validateUser(account_id: string, password_verify: string): Promise<AuthUser> {
    const account = await this.accountRepository.findOne({
      where: { accountId: account_id }
    });
    if (account && this.accountBaseService.passwordVerify(account.accountId, account.authMasterPassword, password_verify)) {

      let authUser: AuthUser = { id: account.accountId, name: account.nickName };
      this.logger.log(`validate user:${JSON.stringify(authUser)}`);

      return authUser;
    }
    let error = `user [${account_id}] or password invalid, please check`;
    this.logger.error(error);
    throw new UnauthorizedException(error);
  }

  jwt_verify(jwt: string): Object | PromiseLike<Object> {
    return this.accountBaseService.jwt_verify(jwt);
  }

}
