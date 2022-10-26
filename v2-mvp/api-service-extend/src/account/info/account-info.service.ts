import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { W3Logger } from 'src/base/log/logger.service';
import { Account } from 'src/base/entity/platform-user/Account.entity';
import { AccountInfo } from 'src/viewModel/account/AccountInfo';
import { AccountEmail } from 'src/base/entity/platform-user/Account-Email.entity';
import { AccountWallet } from 'src/base/entity/platform-user/Account-Wallet.entity';
import { ChangeNickNameRequest } from 'src/viewModel/account/info/ChangeNickNameRequest';
import { ChangeAvatarRequest } from 'src/viewModel/account/info/ChangeAvatarRequest';
import { LinkEmailRequest } from 'src/viewModel/account/info/LinkEmailRequest';
import { UnlinkEmailRequest } from 'src/viewModel/account/info/UnlinkEmailRequest';
import { LinkWalletRequest } from 'src/viewModel/account/info/LinkWalletRequest';
import { UnlinkWalletRequest } from 'src/viewModel/account/info/UnlinkWalletRequest';



@Injectable()
export class AccountInfoService {

  logger: W3Logger;

  constructor(

    @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_ACCOUNT_REPOSITORY.provide)
    private accountRepository: Repository<Account>,
    @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_ACCOUNT_EMAIL_REPOSITORY.provide)
    private accountEmailRepository: Repository<AccountEmail>,
    @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_ACCOUNT_WALLET_REPOSITORY.provide)
    private accountWalletRepository: Repository<AccountWallet>,
  ) {
    this.logger = new W3Logger(`AccountInfoService`);
  }

  async getAccountInfo(accountId: string): Promise<AccountInfo> {
    const account = await this.accountRepository.findOne({
      where: { accountId: accountId }
    });
    delete account.authMasterPassword;

    let accountEmails = await this.accountEmailRepository.find({
      where: { accountId: accountId }
    });

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

  // changeName:   accountId,   nickName
  // changeAvatar:  accountId,  base64_avatar

  // linkEmail : accountId, email => send verifyCode with email => verifyCode
  // unlinkEmail:  accountId, email

  // unlinkWallet: accountId, address   
  // linkWallet : accountId, address, challenge 

  changeNickname(payload: ChangeNickNameRequest): Boolean | PromiseLike<Boolean> {
    throw new Error('Method not implemented.');
  }
  changeAvatar(payload: ChangeAvatarRequest): Boolean | PromiseLike<Boolean> {
    throw new Error('Method not implemented.');
  }

  linkEmail(payload: LinkEmailRequest): Boolean | PromiseLike<Boolean> {
    throw new Error('Method not implemented.');
  } unlinkEmail(payload: UnlinkEmailRequest): Boolean | PromiseLike<Boolean> {
    throw new Error('Method not implemented.');
  }

  linkWallet(payload: LinkWalletRequest): Boolean | PromiseLike<Boolean> {
    throw new Error('Method not implemented.');
  }
  unlinkWallet(payload: UnlinkWalletRequest): Boolean | PromiseLike<Boolean> {
    throw new Error('Method not implemented.');
  }




}
