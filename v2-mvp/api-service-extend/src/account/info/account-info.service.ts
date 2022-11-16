import { Inject, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';

import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { W3Logger } from 'src/base/log/logger.service';
import { Account } from 'src/base/entity/platform-user/Account.entity';
import { AccountInfo } from 'src/account/model/AccountInfo';
import { AccountEmail } from 'src/base/entity/platform-user/AccountEmail.entity';
import { AccountWallet } from 'src/base/entity/platform-user/AccountWallet.entity';
import { ChangeNickNameRequest } from 'src/account/model/info/ChangeNickNameRequest';
import { ChangeAvatarRequest } from 'src/account/model/info/ChangeAvatarRequest';
import { LinkEmailRequest } from 'src/account/model/info/LinkEmailRequest';
import { UnlinkEmailRequest } from 'src/account/model/info/UnlinkEmailRequest';
import { LinkWalletRequest } from 'src/account/model/info/LinkWalletRequest';
import { UnlinkWalletRequest } from 'src/account/model/info/UnlinkWalletRequest';
import { AccountVerifyCode } from 'src/base/entity/platform-user/AccountVerifyCode.entity';
import { Web3SignService } from '../web3/web3.sign.service';
import { CheckEmailRequest } from 'src/account/model/info/CheckEmailRequest';
import { EmailBaseService } from 'src/base/email/email-base.service';
import { VerifyCodeBaseService } from '../base/verifycode-base.service';
import { VerifyCodePurpose, VerifyCodeType, VerifyFlag } from 'src/account/model/VerifyCodeType';
import { JWTAuthService } from 'src/base/auth/jwt-auth.service';
import { AccountStatisticResponse, } from '../model/info/AccountStatisticResponse';
import { DashboardExt } from 'src/base/entity/platform-dashboard/DashboardExt';



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

    @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DASHBOARD_EXT_REPOSITORY.provide)
    private dextRepo: Repository<DashboardExt>,


  ) {
    this.logger = new W3Logger(`AccountInfoService`);
  }

  async getAccountInfo(accountIds: string[], includeExtraInfo: boolean): Promise<AccountInfo[]> {
    const accounts = await this.accountRepository.find({
      where: { accountId: In(accountIds) }
    });
    let d: AccountInfo[] = [];
    accounts.forEach(a => {
      d.push({
        account: a,
        accountEmails: [],
        accountWallets: []
      })
    });

    if (includeExtraInfo) {
      let accountEmails = await this.accountEmailRepository.find({
        where: { accountId: In(accountIds) }
      });
      if (accountEmails) {
        for (const e of accountEmails) {
          delete e.password_hash;
        }
      }

      let accountWallets = await this.accountWalletRepository.find({
        where: { accountId: In(accountIds) }
      });

      for (const ae of accountEmails) {
        let findAccount = d.find(t => t.account.accountId == ae.accountId);
        if (findAccount) {
          findAccount.accountEmails.push(ae);
        }
      }
      for (const aw of accountWallets) {
        let findAccount = d.find(t => t.account.accountId == aw.accountId);
        if (findAccount) {
          findAccount.accountWallets.push(aw);
        }
      }
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
    await this.checkExistingEmail(payload.email);

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
    await this.checkExistingEmail(payload.email);

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
  async checkExistingEmail(email: string) {
    let findEmail = await this.accountEmailRepository.findOne({
      where: {
        email: email
      }
    });
    if (findEmail) {
      this.logger.error(`existing email for ${email}`);
      throw new Error(`existing email for ${email}`);
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
    await this.requireAtLeastOneLink(payload.accountId, false);

    let findEmail = await this.accountEmailRepository.findOne({
      where: {
        accountId: payload.accountId,
        email: payload.email
      }
    });
    if (findEmail) {
      await this.accountEmailRepository.remove(findEmail);
      this.logger.warn(`success unlinkEmail ${JSON.stringify(payload)}`);

      await this.checkAccountShouldBeDestoryed(payload.accountId);
      return true;
    }

    return false;

  }
  async checkAccountShouldBeDestoryed(accountId: string, destroyFlag: boolean = true) {
    if(!accountId){
      return;
    }
    let findEmailsCount = await this.accountEmailRepository.count({
      where: {
        accountId: accountId,
      }
    });
    let findWalletsCount = await this.accountWalletRepository.count({
      where: {
        accountId: accountId,
      }
    });
    this.logger.debug(`check accountId ${accountId} links, emailLinkCount=${findEmailsCount},walletLinkCount=${findWalletsCount}`);

    if ((findEmailsCount + findWalletsCount) <= 0) {
      this.logger.warn(`current account ${accountId} has no related emails or wallets.`);

      if (destroyFlag) {
        this.logger.warn(`current account ${accountId} will be destoryed`);

        let account = await this.accountRepository.findOne({
          where: { accountId: accountId }
        });
        if (account) {
          await this.accountRepository.delete(account);
          this.logger.warn(`current account ${accountId} has been destoryed`);
        }
      }
    }
  }

  async linkWallet(payload: LinkWalletRequest): Promise<Boolean> {
    this.logger.debug(`start to linkWallet ${JSON.stringify(payload)}`);

    await this.verifySignatureWhenLinkWallet(payload);
    await this.checkExistingWallet(payload);

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
  async checkExistingWallet(payload: LinkWalletRequest) {
    let findWallet = await this.accountWalletRepository.findOne({
      where: {
        address: payload.address.toLowerCase()
      }
    });
    if (findWallet) {
      this.logger.error(`existing wallet for ${JSON.stringify(payload)}`);
      throw new Error(`existing wallet`);
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
    await this.requireAtLeastOneLink(payload.accountId, false);

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

      await this.checkAccountShouldBeDestoryed(payload.accountId);
      return true;
    }

    return false;

  }
  async requireAtLeastOneLink(accountId: string, throwErrorFlag: boolean): Promise<Boolean> {

    let emailLinkCount = await this.accountEmailRepository.count({
      where: {
        accountId: accountId,
      }
    });

    let walletLinkCount = await this.accountWalletRepository.count({
      where: {
        accountId: accountId,
      }
    });
    this.logger.debug(`check accountId links, emailLinkCount=${emailLinkCount},walletLinkCount=${walletLinkCount}`);
    if ((emailLinkCount + walletLinkCount) <= 1) {
      if (throwErrorFlag) {
        throw new Error('Must keep at least one email/wallet to signin');
      }
      else {
        this.logger.warn(`check accountId only has one link, emailLinkCount=${emailLinkCount},walletLinkCount=${walletLinkCount}`);

      }
    }
    return true;

  }


  async getAccountStatistic(accountIds: string[]): Promise<AccountStatisticResponse[]> {

    let accounts = await this.accountRepository.find({
      where: {
        accountId: In(accountIds)
      },
      select: [
        "accountId", 'followedAccountCount', 'followingAccountCount'
      ]
    });
    if (!accounts || accounts.length == 0) {
      throw new Error(`accounts not found`);
    }

    let query = await this.dextRepo.createQueryBuilder("d")
      .where("d.creator_account_id IN( :...creator_account_id)", { creator_account_id: accountIds })
      .select("creator_account_id", "creator_account_id")
      .addSelect("count(1)", "dashboard_count")
      .addSelect("SUM( d.view_count )", "total_view_count")
      .addSelect("SUM( d.share_count ) ", "total_share_count")
      .addSelect("SUM( d.fork_count )", "total_fork_count")
      .addSelect("SUM( d.favorite_count )", "total_favorite_count")
      .groupBy("d.creator_account_id");

    let statisticRecords = await query.getRawMany();
    let resp: AccountStatisticResponse[] = [];


    for (const d of accounts) {
      let newItem: AccountStatisticResponse = {
        accountId: d.accountId,
        followedAccountCount: d.followedAccountCount,
        followingAccountCount: d.followingAccountCount,
        dashboard_count: 0,
        total_share_count: 0,
        total_view_count: 0,
        total_favorite_count: 0,
        total_fork_count: 0
      }
      if (statisticRecords && statisticRecords.length > 0) {

        let findStatistic = statisticRecords.find(t => t.creator_account_id == d.accountId);
        if (findStatistic) {
          newItem.dashboard_count = Number(findStatistic.dashboard_count);
          newItem.total_view_count = Number(findStatistic.total_view_count);
          newItem.total_share_count = Number(findStatistic.total_share_count);
          newItem.total_fork_count = Number(findStatistic.total_fork_count);
          newItem.total_favorite_count = Number(findStatistic.total_favorite_count);
        }
      }
      resp.push(newItem);
    }
    return resp;
  }

}
