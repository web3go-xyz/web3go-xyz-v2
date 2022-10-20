import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';

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
        expired_time: new Date(new Date().getTime() + (1000 * 60 * 10))
      }
      await this.accountVerifyCodeRepository.save(newCode);

      //send verfication code by email
      await this.sendEmail(request.email, "Verification mail from web3go.xyz", this.generateEmailContent4VerifyCode(request.verifyCodePurpose, request.email, findAccount, newCode));

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
  generateEmailContent4VerifyCode(purpose: VerifyCodePurpose, email: string, account: Account, code: AccountVerifyCode) {

    let url = (process.env.BASE_WEB_URL || 'http://localhost:3000') + `/verifyEmail?accountId=${account.accountId}&email=${escape(email)}&code=${code.code}&verifyCodePurpose=${purpose}`;
    let html = `<p> hi ${account.nickName}, </p>
    <p>your are processing ${purpose}, below is the verification code:</p>
    <h3>${code.code}</h3>
     <p>please click the button below to verify:</p>
     <div><a href="${url}" target="_blank" style="font-size:24px;">verify</a></div>`;
    this.logger.debug(`generateEmailContent4VerifyCode:${html}`);
    return html;
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
}
