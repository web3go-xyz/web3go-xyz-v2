import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { W3Logger } from 'src/base/log/logger.service';
import { Account } from 'src/base/entity/platform-user/Account.entity';
import { AccountInfo } from 'src/viewModel/user-auth/AccountInfo';
import { AccountEmail } from 'src/base/entity/platform-user/Account-Email.entity';
import { AccountWallet } from 'src/base/entity/platform-user/Account-Wallet.entity';



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

    return {
      account: account,
      accountEmails: accountEmails,
      accountWallets: accountWallets
    };
  }



}
