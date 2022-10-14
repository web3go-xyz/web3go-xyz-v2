import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { AccountInfo, } from 'src/viewModel/user-auth/UserInfo';
import { W3Logger } from 'src/base/log/logger.service';
import { Account } from 'src/base/entity/platform-user/Account.entity';



@Injectable()
export class AccountInfoService {
  logger: W3Logger;

  constructor(

    @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_USER_REPOSITORY.provide)
    private accountRepository: Repository<Account>,

  ) {
    this.logger = new W3Logger(`AccountInfoService`);
  }

  async getAccountInfo(accountId: string): Promise<AccountInfo> {
    const account = await this.accountRepository.findOne({
      where: { accountId: accountId }
    });
    delete account.authMasterPassword;

    return account;
  }



}
