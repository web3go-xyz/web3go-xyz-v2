import { Inject, Injectable } from '@nestjs/common';
import { EntityManager, FindManyOptions, Repository } from 'typeorm';

import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { W3Logger } from 'src/base/log/logger.service';
import { Account } from 'src/base/entity/platform-user/Account.entity';
import { AccountEmail } from 'src/base/entity/platform-user/AccountEmail.entity';
import { AccountWallet } from 'src/base/entity/platform-user/AccountWallet.entity';

import { v4 as uuidv4 } from 'uuid';
import { AccountSearchResult } from 'src/account/model/AccountSearchResult';
import { VerifyFlag } from 'src/account/model/VerifyCodeType';

const md5 = require('js-md5');


@Injectable()
export class AccountBaseService {


  logger: W3Logger;

  constructor(
    @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_ACCOUNT_REPOSITORY.provide)
    private accountRepository: Repository<Account>,

    @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_ACCOUNT_EMAIL_REPOSITORY.provide)
    private accountEmailRepository: Repository<AccountEmail>,

    @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_ACCOUNT_WALLET_REPOSITORY.provide)
    private accountWalletRepository: Repository<AccountWallet>,

  ) {
    this.logger = new W3Logger(`AccountBaseService`);
  }
  async updateLastLoginTime(accountId: string) {
    let account = await this.accountRepository.findOne({
      where: { accountId: accountId }
    });
    if (account) {
      account.lastLoginTime = new Date();
      await this.accountRepository.save(account);
    }
  }
  generateAccountId() {
    return uuidv4().toString().replace(/-/g, '');
  }

  async searchAccountGroups(accountId: string): Promise<string[]> {
    return ['CommonUsers', "BuilderV1"];
  }

  async searchAccountsByEmail(email: string, verifiedOnly: boolean): Promise<AccountSearchResult[]> {
    if (!email) return null;

    let accountIds: AccountSearchResult[] = [];

    //email
    let condition: FindManyOptions<AccountEmail> = {
      where: {
        email: email
      }
    };
    if (verifiedOnly) {
      condition = {
        where: {
          email: email,
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
          binding: email,
          verified: t.verified == 1 ? true : false,
          ext: t
        })
      });
    }

    return accountIds;
  }

  async searchAccount(accountId: string): Promise<Account> {
    if (!accountId) return null;

    let account = await this.accountRepository.findOne({ where: { accountId: accountId } });

    return account;
  }




  async generateWeb3Id(tm: EntityManager): Promise<string> {

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



  async searchAccountsByWalletAddress(address: string, verifiedOnly: boolean): Promise<AccountSearchResult[]> {
    if (!address) return null;
    address = address.toLowerCase();

    let accountIds: AccountSearchResult[] = [];

    //wallet
    let condition2: FindManyOptions<AccountWallet> = {
      where: {
        address: address
      }
    };
    if (verifiedOnly) {
      condition2 = {
        where: {
          address: address,
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
          binding: address,
          verified: t.verified == 1 ? true : false,
          ext: t
        })
      });
    }

    return accountIds;
  }

}
