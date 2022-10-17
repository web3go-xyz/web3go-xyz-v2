import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { EntityManager, FindManyOptions, Repository } from 'typeorm';

import { JwtService } from '@nestjs/jwt';
import { AuthUser } from 'src/base/auth/authUser';
import { IAuthService } from 'src/base/auth/IAuthService';
import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { W3Logger } from 'src/base/log/logger.service';
import { Account } from 'src/base/entity/platform-user/Account.entity';
import { AccountEmail } from 'src/base/entity/platform-user/Account-Email.entity';
import { AccountWallet } from 'src/base/entity/platform-user/Account-Wallet.entity';
import { AccountVerifyCode } from 'src/base/entity/platform-user/Account-VerifyCode.entity';
import JWTConfig from 'src/base/auth/config';
import { AccountSignupRequest } from 'src/viewModel/user-auth/AccountSignupRequest';
import { AccountInfo } from 'src/viewModel/user-auth/AccountInfo';

import { v4 as uuidv4 } from 'uuid';
import { EmailVerifyRequest } from 'src/viewModel/user-auth/EmailVerifyRequest';
import { VerifyCodePurpose, VerifyCodeType, VerifyFlag } from 'src/base/entity/platform-user/VerifyCodeType';
import { Mailer } from 'src/base/email/mailer';
import { VerifyCodeRequest } from 'src/viewModel/user-auth/VerifyCodeRequest';
import { ChangePasswordRequest } from 'src/viewModel/user-auth/ChangePasswordRequest';
import { AccountSigninRequest } from 'src/viewModel/user-auth/AccountSigninRequest';


const md5 = require('js-md5');

export class AccountSearchResult {
  accountId: string;
  type: 'email' | 'wallet';
  binding: string;
  verified: boolean;
}
@Injectable()
export class AccountAuthService implements IAuthService {

  logger: W3Logger;

  constructor(
    private readonly jwtService: JwtService,
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

  async signin(request: AccountSigninRequest): Promise<AuthUser> {

    let searchAccounts = await this.searchAccountsByEmail(request.email, false);
    if (!searchAccounts) {
      throw new BadRequestException("email not exist");
    }
    let searchAccount = searchAccounts[0];
    if (!searchAccount.verified) {
      throw new BadRequestException("email for account does not verified");
    }
    let account = await this.getAccount(searchAccount.accountId);
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

      const payload = {
        id: authUser.id,
        email: request.email,
        first_name: authUser.name,
        groups: await this.getAccountGroups(accountId),
      };
      let token = this.jwtService.sign(payload);
      this.logger.debug(`signin with payload:${JSON.stringify(payload)}, got token:${token}`);
      authUser.token = token;
    }
    return authUser;
  }
  async getAccountGroups(accountId: string): Promise<string[]> {
    return ['CommonUsers', "BuilderV1"];
  }

  async searchAccountsByEmail(filter: string, verified: boolean): Promise<AccountSearchResult[]> {
    if (!filter) return null;

    let accountIds: AccountSearchResult[] = [];

    //email
    let condition: FindManyOptions<AccountEmail> = {
      where: {
        email: filter
      }
    };
    if (verified) {
      condition = {
        where: {
          email: filter,
          verified: VerifyFlag.Verified
        }
      };
    }
    let records = await this.accountEmailRepository.find(condition);
    if (records && records.length > 0) {
      records.forEach(t => {
        accountIds.push({
          accountId: t.accountId,
          type: 'email',
          binding: filter,
          verified: t.verified == 1 ? true : false
        })
      });
    }

    return accountIds;
  }
  async searchAccountsByWallet(filter: string, verified: boolean): Promise<AccountSearchResult[]> {
    if (!filter) return null;

    let accountIds: AccountSearchResult[] = [];

    //wallet
    let condition2: FindManyOptions<AccountWallet> = {
      where: {
        address: filter
      }
    };
    if (verified) {
      condition2 = {
        where: {
          address: filter,
          verified: VerifyFlag.Verified
        }
      };
    }
    let records2 = await this.accountWalletRepository.find(condition2);
    if (records2 && records2.length > 0) {
      records2.forEach(t => {
        accountIds.push({
          accountId: t.accountId,
          type: 'wallet',
          binding: filter,
          verified: t.verified == 1 ? true : false
        })
      });
    }

    return accountIds;
  }
  async getAccount(accountId: string): Promise<Account> {
    if (!accountId) return null;

    let account = await this.accountRepository.findOne({ where: { accountId: accountId } });
    if (account) {
      delete account.authMasterPassword;
    }
    return account;
  }
  async validateUser(account_id: string, password_verify: string): Promise<AuthUser> {
    const account = await this.accountRepository.findOne({
      where: { accountId: account_id }
    });
    if (account && this.verifyPassword(account.accountId, account.authMasterPassword, password_verify)) {

      let authUser: AuthUser = { id: account.accountId, name: account.nickName };
      this.logger.log(`validate user:${JSON.stringify(authUser)}`);

      return authUser;
    }
    let error = `user [${account_id}] or password invalid, please check`;
    this.logger.error(error);
    throw new UnauthorizedException(error);
  }

  verifyPassword(id: string, passwordHash: string, password: string) {
    let encrypt = this.encryptPassword(id, password);
    return encrypt === passwordHash;
  }
  encryptPassword(id: string, password: string): string {
    let encrypt = md5(id + password);
    return encrypt;
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
  async createAccount(request: AccountSignupRequest): Promise<AccountInfo> {

    let accountId = uuidv4();
    let newAccount: Account = {
      accountId: accountId,
      web3Id: '',
      nickName: request.nickName,
      avatar: '',
      created_time: new Date(),
      authMasterPassword: this.encryptPassword(accountId, request.password),
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
      newAccount.web3Id = await this.getNextWeb3Id(tm);
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
  async getNextWeb3Id(tm: EntityManager): Promise<string> {

    let web3Id = '';
    let record = await tm.query(`select count(*) as total from account`);
    if (record && record.length > 0) {
      let next = Number(record[0].total) + 1;

      let full = '00000000' + next.toString();
      full = full.substring(full.length - 8);
      web3Id = 'Web3Go' + full;
    }
    this.logger.log(`generate Web3Id: ${web3Id}`);
    return web3Id;
  }


  async sendVerifyEmail(request: EmailVerifyRequest): Promise<Boolean> {
    let findAccount = await this.accountRepository.findOne({
      where: {
        accountId: request.accountId
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
        accountId: request.accountId,
        created_time: new Date(),
        expired_time: new Date(new Date().getTime() + (1000 * 60 * 5))
      }
      await this.accountVerifyCodeRepository.save(newCode);

      //send verfication code by email
      await this.sendEmail(request.verifyCodePurpose, findAccount.nickName, request.email, newCode.code);

      return true;
    }
    else {
      throw new BadRequestException('the email not exist');
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

  sendEmail(purpose: VerifyCodePurpose, displayName: string, email: string, code: string) {
    let mailer = new Mailer();
    mailer.send({
      to: email,
      subject: 'Verification mail from web3go.xyz',
      html: `<p> hi ${displayName}, <br>your are processing ${purpose}, below is the verification code:<br><h1>${code}</h1><br> sent by web3go.xyz</p>`
    });
    return "email sent success";
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

  async verifyCode(request: VerifyCodeRequest, clearAfterVerifiedSuccess: boolean = true): Promise<boolean> {
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

      if (request.verifyCodePurpose == VerifyCodePurpose.Account) {
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
      return true;
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
    account.authMasterPassword = this.encryptPassword(account.accountId, request.newPassword);
    await this.accountRepository.save(account);

    return true;
  }


}
