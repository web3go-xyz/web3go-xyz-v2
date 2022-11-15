import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthorizedUser } from 'src/base/auth/AuthorizedUser';
import { AuthParameter, IAuthService } from 'src/base/auth/IAuthService';
import { AccountEmail } from 'src/base/entity/platform-user/AccountEmail.entity';
import { AccountVerifyCode } from 'src/base/entity/platform-user/AccountVerifyCode.entity';
import { Account } from 'src/base/entity/platform-user/Account.entity';
import { W3Logger } from 'src/base/log/logger.service';
import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { AccountInfo } from 'src/account/model/AccountInfo';
import { AccountSearchResult } from 'src/account/model/AccountSearchResult';

import { AccountSigninRequest } from 'src/account/model/auth/AccountSigninRequest';
import { AccountSignupRequest } from 'src/account/model/auth/AccountSignupRequest';
import { ChangePasswordRequest } from 'src/account/model/auth/ChangePasswordRequest';
import { EmailVerifyRequest } from 'src/account/model/EmailVerifyRequest';
import { VerifyCodeRequest } from 'src/account/model/VerifyCodeRequest';
import { Repository } from 'typeorm';

import { AccountBaseService } from '../base/account-base.service';
import { EmailBaseService } from '../../base/email/email-base.service';
import { VerifyCodeBaseService } from '../base/verifycode-base.service';
import { VerifyCodeType, VerifyCodePurpose, VerifyFlag } from 'src/account/model/VerifyCodeType';
import { JWTAuthService } from 'src/base/auth/jwt-auth.service';
import { SignTokenPayload } from 'src/base/auth/SignTokenPayload';


@Injectable()
export class AccountAuthService implements IAuthService {
  logger: W3Logger;

  constructor(
    private readonly accountBaseService: AccountBaseService,
    private readonly verifyCodeBaseService: VerifyCodeBaseService,
    private readonly emailBaseService: EmailBaseService,
    private readonly jwtAuthService: JWTAuthService,

    @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_ACCOUNT_REPOSITORY.provide)
    private accountRepository: Repository<Account>,

    @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_ACCOUNT_EMAIL_REPOSITORY.provide)
    private accountEmailRepository: Repository<AccountEmail>,



  ) {
    this.logger = new W3Logger(`AccountAuthService`);
  }
  async searchAccountsByEmail(email: string, verifiedOnly: boolean): Promise<AccountSearchResult[]> {
    return await this.accountBaseService.searchAccountsByEmail(email, verifiedOnly)
  }
  async signin(request: AccountSigninRequest): Promise<AuthorizedUser> {

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
    let authUser = await this.validateUser({
      id: accountId,
      name: request.email,
      secret: password_verify
    });
    if (authUser) {
      authUser.name = account.nickName;
      const payload: SignTokenPayload = {
        id: authUser.id,
        email: request.email,
        address: '',
        first_name: authUser.name,
        groups: await this.accountBaseService.searchAccountGroups(accountId),
      };
      authUser.token = await this.jwtAuthService.grantToken(payload);

      this.accountBaseService.updateLastLoginTime(searchAccount.accountId);
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
      let newCode: AccountVerifyCode = await this.verifyCodeBaseService.newCode(findAccount.accountId, request.email, VerifyCodeType.Email, request.verifyCodePurpose);

      //send email
      if ([VerifyCodePurpose.ResetPassword].indexOf(request.verifyCodePurpose) > -1) {
        await this.emailBaseService.sendEmail(request.email, "Security email from web3go.xyz", this.emailBaseService.generateEmail4ResetPassword(findAccount.nickName, newCode.code, this.verifyCodeBaseService.CODE_EXPIRED_MINUTES));
      }
      if ([VerifyCodePurpose.Account].indexOf(request.verifyCodePurpose) > -1) {
        await this.emailBaseService.sendEmail(request.email, "Account activate email from web3go.xyz", this.emailBaseService.generateEmail4AccountActivate(request.verifyCodePurpose, request.email, findAccount.accountId, findAccount.nickName, newCode.code, this.verifyCodeBaseService.CODE_EXPIRED_MINUTES));
      }

      return true;
    }
    else {
      throw new BadRequestException('account with email does not exist');
    }
  }


  async verifyCodeAndGrantToken(request: VerifyCodeRequest, clearAfterVerifiedSuccess: boolean = true, autoGenerateSignInToken: boolean = true): Promise<any> {
    this.logger.debug(`verify code:${JSON.stringify(request)}`);
    let verify_result = await this.verifyCodeBaseService.verifyCode(request.accountId, request.code, request.email, VerifyCodeType.Email, request.verifyCodePurpose);

    if (verify_result) {
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
        await this.verifyCodeBaseService.clearCode(request.accountId, request.email, VerifyCodeType.Email, request.verifyCodePurpose);
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
        let autoSignInToken = await this.jwtAuthService.grantToken(payload);
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
    let accountEmail = await this.accountEmailRepository.findOne({
      where: {
        accountId:
          request.accountId,
        email: request.email
      }
    });
    if (!accountEmail) {
      throw new BadRequestException('account with email not exist');
    }

    let verify = await this.verifyCodeBaseService.verifyCode(
      request.accountId,
      request.code,
      request.email,
      VerifyCodeType.Email,
      VerifyCodePurpose.ResetPassword
    )
    if (!verify) {
      throw new BadRequestException('verify failure');
    }

    //change password 
    accountEmail.password_hash = this.jwtAuthService.passwordEncrypt(accountEmail.accountId, request.newPassword);
    await this.accountEmailRepository.save(accountEmail);

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
      allowLogin: 1,
      lastLoginTime: new Date(),
      followedAccountCount: 0,
      followingAccountCount: 0
    }
    let newAccountEmail: AccountEmail = {
      accountId: accountId,
      email: request.email,
      verified: 0,
      created_time: new Date(),
      password_hash: this.jwtAuthService.passwordEncrypt(accountId, request.password),
    }
    this.logger.debug(`start to create new account:${JSON.stringify(newAccount)}`);

    await this.accountRepository.manager.connection.transaction(async tm => {
      newAccount.web3Id = await this.accountBaseService.generateWeb3Id(tm);
      this.logger.debug(newAccount);
      this.logger.debug(newAccountEmail);
      await tm.save(Account, newAccount);
      await tm.save(AccountEmail, newAccountEmail);

    });
    delete newAccountEmail.password_hash;
    return {
      account: newAccount,
      accountEmails: [newAccountEmail],
      accountWallets: null
    };

  }

  async validateUser(parameter: AuthParameter): Promise<AuthorizedUser> {
    let account_id = parameter.id;
    let email = parameter.name;
    let password_verify = parameter.secret;

    const accountEmail = await this.accountEmailRepository.findOne({
      where: {
        accountId: account_id,
        email: email
      }
    });
    if (accountEmail && this.jwtAuthService.passwordVerify(account_id, accountEmail.password_hash, password_verify)) {

      let authUser: AuthorizedUser = { id: account_id, name: email };
      this.logger.log(`validate user:${JSON.stringify(authUser)}`);

      return authUser;
    }
    let error = `user [${account_id}] or password invalid, please check`;
    this.logger.error(error);
    throw new UnauthorizedException(error);
  }

  jwt_verify(jwt: string): Object | PromiseLike<Object> {
    return this.jwtAuthService.jwt_verify(jwt);
  }

}
