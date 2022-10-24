import { Inject, Injectable } from '@nestjs/common';
import { EntityManager, FindManyOptions, Repository } from 'typeorm';

import { JwtService } from '@nestjs/jwt';
import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { W3Logger } from 'src/base/log/logger.service';
import { Account } from 'src/base/entity/platform-user/Account.entity';
import { AccountEmail } from 'src/base/entity/platform-user/Account-Email.entity';
import { AccountWallet } from 'src/base/entity/platform-user/Account-Wallet.entity';
import { AccountVerifyCode } from 'src/base/entity/platform-user/Account-VerifyCode.entity';

import { v4 as uuidv4 } from 'uuid';
import { VerifyFlag } from 'src/base/entity/platform-user/VerifyCodeType';
import { AccountSearchResult } from 'src/viewModel/user-auth/AccountSearchResult';
import { SignTokenPayload } from 'src/viewModel/user-auth/SignTokenPayload';


const md5 = require('js-md5');


@Injectable()
export class AccountBaseService {

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
    this.logger = new W3Logger(`AccountBaseService`);
  }

  generateAccountId() {
    return uuidv4();
  }
  async grantToken(payload: SignTokenPayload): Promise<string> {
    let token = this.jwtService.sign(payload);
    this.logger.debug(`signin with payload:${JSON.stringify(payload)}, got token:${token}`);
    return token;
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
    if (account) {
      delete account.authMasterPassword;
    }
    return account;
  }

  passwordVerify(id: string, passwordHash: string, password: string) {
    let encrypt = this.passwordEncrypt(id, password);
    return encrypt === passwordHash;
  }
  passwordEncrypt(id: string, password: string): string {
    let encrypt = md5(id + password);
    return encrypt;
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

  jwt_verify(jwt: string): Object | PromiseLike<Object> {
    let verify_result = this.jwtService.verify(jwt);
    this.logger.debug(`verify_result:${JSON.stringify(verify_result)}`);
    return verify_result;
  }

}
