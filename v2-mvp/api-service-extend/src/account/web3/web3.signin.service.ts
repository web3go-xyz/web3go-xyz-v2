import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';


import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { W3Logger } from 'src/base/log/logger.service';
import { Account } from 'src/base/entity/platform-user/Account.entity';
import { AccountWallet } from 'src/base/entity/platform-user/Account-Wallet.entity';

import { AccountSearchResult } from 'src/viewModel/account/AccountSearchResult';
import { Web3SignInChallengeRequest } from '../../base/web3/sign/model/Web3SignInChallengeRequest';
 
import { AuthUser } from 'src/base/auth/authUser';
import { AccountBaseService } from '../base/account-base.service';
import { AccountInfo } from 'src/viewModel/account/AccountInfo';
import { SignTokenPayload } from 'src/viewModel/account/auth/SignTokenPayload';


@Injectable()
export class Web3SignInService {

  logger: W3Logger;

  constructor(
    private readonly accountBaseService: AccountBaseService,
    @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_ACCOUNT_REPOSITORY.provide)
    private accountRepository: Repository<Account>,

  ) {
    this.logger = new W3Logger(`Web3SignInService`);
  }
  async searchAccountsByWalletAddress(address: string, verifiedOnly: boolean): Promise<AccountSearchResult[]> {
    return await this.accountBaseService.searchAccountsByWalletAddress(address, verifiedOnly)
  }

  async createAccount4WalletAddress(address: string, chain: string, walletSource: string): Promise<AccountInfo> {

    let accountId = this.accountBaseService.generateAccountId();
    let newAccount: Account = {
      accountId: accountId,
      web3Id: '',
      nickName: address,
      avatar: '',
      created_time: new Date(),
      authMasterPassword: '',
      allowLogin: 1,
      last_login_time: new Date()
    }
    let newAccountWallet: AccountWallet = {
      accountId: accountId,
      created_time: new Date(),
      address: address,
      chain: chain,
      walletSource: walletSource,
      verified: 1
    }
    this.logger.debug(`start to create new account:${JSON.stringify(newAccount)}`);

    await this.accountRepository.manager.connection.transaction(async tm => {
      newAccount.web3Id = await this.accountBaseService.generateWeb3Id(tm);
      this.logger.debug(newAccount);
      this.logger.debug(newAccountWallet);
      await tm.save(Account, newAccount);
      await tm.save(AccountWallet, newAccountWallet);

    });
    delete newAccount.authMasterPassword;
    return {
      account: newAccount,
      accountEmails: null,
      accountWallets: [newAccountWallet]
    };

  }
  async signInWithWalletAddress(request: Web3SignInChallengeRequest): Promise<AuthUser> {
    let address = request.address;
    let accountId: string = null;
    let mockEmail: string = `${request.chain.toLowerCase()}_${request.address.toLowerCase()}@web3go.xyz`;

    let searchAccounts = await this.accountBaseService.searchAccountsByWalletAddress(address, false);
    if (!searchAccounts || searchAccounts.length == 0) {
      this.logger.warn(`wallet address ${address} does not exist`);
      this.logger.log(`creating new account for wallet address ${address}`);

      let newAccount = await this.createAccount4WalletAddress(request.address, request.chain, request.walletSource);
      accountId = newAccount.account.accountId;

    } else {
      let searchAccount = searchAccounts[0];
      if (!searchAccount.verified) {
        throw new BadRequestException("wallet address for account does not verified");
      }
      accountId = searchAccount.accountId;
    }

    let account = await this.accountBaseService.searchAccount(accountId);
    if (!account) {
      throw new BadRequestException("account not exist");
    }
    if (!account.allowLogin) {
      throw new BadRequestException("account is disabled to login");
    }
    let payload: SignTokenPayload = {
      id: account.accountId,
      email: mockEmail,
      address: address,
      first_name: account.nickName,
      groups: await this.accountBaseService.searchAccountGroups(account.accountId),
    };

    let token = await this.accountBaseService.grantToken(payload);

    return {
      id: payload.id,
      name: payload.first_name,
      token: token
    };
  }
}
