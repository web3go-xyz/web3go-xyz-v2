import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { W3Logger } from 'src/base/log/logger.service';
import { Account } from 'src/base/entity/platform-user/Account.entity';
import { AccountInfo } from 'src/viewModel/account/AccountInfo';
import { AccountEmail } from 'src/base/entity/platform-user/AccountEmail.entity';
import { AccountWallet } from 'src/base/entity/platform-user/AccountWallet.entity';
import { ChangeNickNameRequest } from 'src/viewModel/account/info/ChangeNickNameRequest';
import { ChangeAvatarRequest } from 'src/viewModel/account/info/ChangeAvatarRequest';
import { LinkEmailRequest } from 'src/viewModel/account/info/LinkEmailRequest';
import { UnlinkEmailRequest } from 'src/viewModel/account/info/UnlinkEmailRequest';
import { LinkWalletRequest } from 'src/viewModel/account/info/LinkWalletRequest';
import { UnlinkWalletRequest } from 'src/viewModel/account/info/UnlinkWalletRequest';
import { AccountVerifyCode } from 'src/base/entity/platform-user/AccountVerifyCode.entity';
import { Web3SignService } from '../web3/web3.sign.service';
import { CheckEmailRequest } from 'src/viewModel/account/info/CheckEmailRequest';
import { EmailBaseService } from 'src/base/email/email-base.service';
import { VerifyCodeBaseService } from '../base/verifycode-base.service';
import { VerifyCodePurpose, VerifyCodeType, VerifyFlag } from 'src/viewModel/VerifyCodeType';
import { JWTAuthService } from 'src/base/auth/jwt-auth.service';



@Injectable()
export class AccountInfoService {

  logger: W3Logger;

  constructor(
    private readonly verifyCodeBaseService: VerifyCodeBaseService,
    private readonly emailBaseService: EmailBaseService,
    private readonly web3SignService: Web3SignService,
    private readonly jwtAuthService: JWTAuthService,

    @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_ACCOUNT_REPOSITORY.provide)
    private accountRepository: Repository<Account>,
    @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_ACCOUNT_EMAIL_REPOSITORY.provide)
    private accountEmailRepository: Repository<AccountEmail>,
    @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_ACCOUNT_WALLET_REPOSITORY.provide)
    private accountWalletRepository: Repository<AccountWallet>,

    @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_ACCOUNT_VERIFYCODE_REPOSITORY.provide)
    private accountVerifyCodeRepository: Repository<AccountVerifyCode>,


  ) {
    this.logger = new W3Logger(`AccountInfoService`);
  }

  async getAccountInfo(accountId: string): Promise<AccountInfo> {
    const account = await this.accountRepository.findOne({
      where: { accountId: accountId }
    });

    let accountEmails = await this.accountEmailRepository.find({
      where: { accountId: accountId }
    });
    if (accountEmails) {
      for (const e of accountEmails) {
        delete e.password_hash;
      }
    }

    let accountWallets = await this.accountWalletRepository.find({
      where: { accountId: accountId }
    });

    let d: AccountInfo = {
      account: account,
      accountEmails: accountEmails,
      accountWallets: accountWallets
    };

    this.logger.debug(`getAccountInfo:${JSON.stringify(d)}`);
    return d;
  }


  async changeNickname(payload: ChangeNickNameRequest): Promise<Boolean> {
    let findAccount = await this.accountRepository.findOne({
      where: { accountId: payload.accountId }
    });
    if (findAccount) {
      let original_nickName = findAccount.nickName;
      findAccount.nickName = payload.nickName;
      await this.accountRepository.save(findAccount);
      this.logger.debug(`changeNickname for ${findAccount.accountId} [${original_nickName}]=> [${findAccount.nickName}]`);
      return true;
    }

    return false;
  }
  async changeAvatar(payload: ChangeAvatarRequest): Promise<Boolean> {
    let findAccount = await this.accountRepository.findOne({
      where: {
        accountId: payload.accountId
      }
    });
    if (findAccount) {
      findAccount.avatar = payload.avatar;
      await this.accountRepository.save(findAccount);
      this.logger.debug(`changeAvatar for ${findAccount.accountId}`);
      return true;
    }

    return false;
  }

  async linkEmail(payload: LinkEmailRequest): Promise<Boolean> {
    this.logger.debug(`start to linkEmail ${JSON.stringify(payload)}`);

    await this.verifyCodeWhenLinkEmail(payload);
    await this.checkDuplicateEmail(payload.accountId, payload.email);

    let newEmailLink: AccountEmail = {
      accountId: payload.accountId,
      email: payload.email,
      verified: VerifyFlag.Verified,
      created_time: new Date(),
      password_hash: this.jwtAuthService.passwordEncrypt(payload.accountId, payload.password)
    };
    await this.accountEmailRepository.save(newEmailLink);
    this.logger.warn(`success linkEmail ${JSON.stringify(payload)}`);
    return true;
  }
  async checkEmailBeforeLink(payload: CheckEmailRequest): Promise<Boolean> {
    await this.checkDuplicateEmail(payload.accountId, payload.email);

    //send email with code
    let newCode: AccountVerifyCode = await this.verifyCodeBaseService.newCode(payload.accountId, payload.email, VerifyCodeType.Email, VerifyCodePurpose.LinkEmail);

    let findAccount = await this.accountRepository.findOne({
      where: {
        accountId: payload.accountId
      }
    });
    await this.emailBaseService.sendEmail(payload.email, "Security email from web3go.xyz", this.emailBaseService.generateEmail4Code(findAccount.nickName, newCode.code, this.verifyCodeBaseService.CODE_EXPIRED_MINUTES));

    return true;


  }
  async checkDuplicateEmail(accountId: string, email: string) {
    let findEmail = await this.accountEmailRepository.findOne({
      where: {
        accountId: accountId,
        email: email
      }
    });
    if (findEmail) {
      this.logger.error(`duplicate email for ${accountId} ${email}`);
      throw new Error(`duplicate email for ${email}`);
    }

    return true;
  }
  async verifyCodeWhenLinkEmail(payload: LinkEmailRequest): Promise<Boolean> {
    let findCode = await this.accountVerifyCodeRepository.findOne({
      where: {
        accountId: payload.accountId,
        verifyKey: payload.email,
        code: payload.code,
        verifyType: VerifyCodeType.Email,
        purpose: VerifyCodePurpose.LinkEmail
      }
    });
    if (findCode) {
      if (findCode.expired_time.getTime() > (new Date()).getTime()) {
        return true;
      }
    }
    this.logger.error(`verify code failed when link email with ${JSON.stringify(payload)}`);
    throw new Error(`verify code failed when link email`);

  }


  async unlinkEmail(payload: UnlinkEmailRequest): Promise<Boolean> {
    this.logger.debug(`start to unlinkEmail ${JSON.stringify(payload)}`);
    await this.requireAtLeastOneLink(payload.accountId);

    let findEmail = await this.accountEmailRepository.findOne({
      where: {
        accountId: payload.accountId,
        email: payload.email
      }
    });
    if (findEmail) {
      await this.accountEmailRepository.remove(findEmail);
      this.logger.warn(`success unlinkEmail ${JSON.stringify(payload)}`);
      return true;
    }

    return false;

  }

  async linkWallet(payload: LinkWalletRequest): Promise<Boolean> {
    this.logger.debug(`start to linkWallet ${JSON.stringify(payload)}`);

    await this.verifySignatureWhenLinkWallet(payload);
    await this.checkDuplicateWallet(payload);

    let newWalletLink: AccountWallet = {
      accountId: payload.accountId,
      address: payload.address.toLowerCase(),
      chain: payload.chain,
      walletSource: payload.walletSource,
      verified: VerifyFlag.Verified,
      created_time: new Date()
    };
    await this.accountWalletRepository.save(newWalletLink);
    this.logger.warn(`success linkWallet ${JSON.stringify(payload)}`);
    return true;
  }
  async checkDuplicateWallet(payload: LinkWalletRequest) {
    let findWallet = await this.accountWalletRepository.findOne({
      where: {
        accountId: payload.accountId,
        address: payload.address.toLowerCase(),
        chain: payload.chain
      }
    });
    if (findWallet) {
      this.logger.error(`duplicate wallet for ${JSON.stringify(payload)}`);
      throw new Error(`duplicate wallet`);
    }
    return true;
  }
  async verifySignatureWhenLinkWallet(payload: LinkWalletRequest): Promise<Boolean> {
    //verify signature
    let challengeResult = await this.web3SignService.getWeb3SignHelper(payload.walletSource, payload.chain).challenge({
      ...payload
    });

    if (challengeResult && challengeResult.verified) {
      return true;
    } else {
      this.logger.error(`verify signature failed when link wallet with ${JSON.stringify(payload)}`);
      throw new Error(`verify signature failed when link wallet`);
    }
  }

  async unlinkWallet(payload: UnlinkWalletRequest): Promise<Boolean> {
    this.logger.debug(`start to unlinkWallet ${JSON.stringify(payload)}`);
    await this.requireAtLeastOneLink(payload.accountId);

    let findWallet = await this.accountWalletRepository.findOne({
      where: {
        accountId: payload.accountId,
        address: payload.address.toLowerCase(),
        chain: payload.chain
      }
    });
    if (findWallet) {
      await this.accountWalletRepository.remove(findWallet);
      this.logger.warn(`success unlinkWallet ${JSON.stringify(payload)}`);
      return true;
    }

    return false;

  }
  async requireAtLeastOneLink(accountId: string): Promise<Boolean> {

    let emailLinkCount = await this.accountEmailRepository.count({
      where: {
        accountId: accountId,
        verified: VerifyFlag.Verified
      }
    });

    let walletLinkCount = await this.accountWalletRepository.count({
      where: {
        accountId: accountId,
        verified: VerifyFlag.Verified
      }
    });
    this.logger.debug(`check accountId links, emailLinkCount=${emailLinkCount},walletLinkCount=${walletLinkCount}`);
    if ((emailLinkCount + walletLinkCount) <= 1) {
      throw new Error('Must keep at least one email/wallet to signin');
    }
    return true;

  }



}
