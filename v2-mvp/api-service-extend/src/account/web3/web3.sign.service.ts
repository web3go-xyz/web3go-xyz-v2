import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';


import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { W3Logger } from 'src/base/log/logger.service';
import { Account } from 'src/base/entity/platform-user/Account.entity';
import { AccountWallet } from 'src/base/entity/platform-user/AccountWallet.entity';

import { AccountSearchResult } from 'src/account/model/AccountSearchResult';

import { AccountBaseService } from '../base/account-base.service';
import { AccountInfo } from 'src/account/model/AccountInfo';
import { KVService } from 'src/base/kv/kv.service';
import { MetamaskSignHelper } from 'src/base/web3/sign/metamask/metamask.sign.helper';
import { PolkadotSignHelper } from 'src/base/web3/sign/polkadot/polkadot.sign.helper';
import { WalletSupported } from 'src/viewModel/chain/walletSupported';
import { IWeb3Sign } from 'src/base/web3/sign/IWeb3Sign';
import { Web3SignChallengeRequest } from 'src/base/web3/sign/model/Web3SignChallengeRequest';
import { Web3SignChallengeResponse } from 'src/base/web3/sign/model/Web3SignChallengeResponse';
import { Web3SignNonceRequest } from 'src/base/web3/sign/model/Web3SignNonceRequest';
import { Web3SignNonceResponse } from 'src/base/web3/sign/model/Web3SignNonceResponse';
import { JWTAuthService } from 'src/base/auth/jwt-auth.service';
import { AuthorizedUser } from 'src/base/auth/AuthorizedUser';
import { SignTokenPayload } from 'src/base/auth/SignTokenPayload';


@Injectable()
export class Web3SignService {


  logger: W3Logger;

  constructor(
    private kvService: KVService,

    private readonly polkadotSignHelper: PolkadotSignHelper,
    private readonly metamaskSignHelper: MetamaskSignHelper,
    private readonly accountBaseService: AccountBaseService,
    private readonly jwtAuthService: JWTAuthService,

    @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_ACCOUNT_REPOSITORY.provide)
    private accountRepository: Repository<Account>,

  ) {
    this.logger = new W3Logger(`Web3SignService`);
  }


  async searchAccountsByWalletAddress(address: string, verifiedOnly: boolean): Promise<AccountSearchResult[]> {
    return await this.accountBaseService.searchAccountsByWalletAddress(address, verifiedOnly)
  }

  async createAccount4WalletAddress(address: string, chain: string, walletSource: string): Promise<AccountInfo> {
    address = address.toLowerCase();
    let accountId = this.accountBaseService.generateAccountId();
    let mockNickname = `${chain}_${address}`;
    let newAccount: Account = {
      accountId: accountId,
      web3Id: '',
      nickName: mockNickname,
      avatar: '',
      created_time: new Date(),
      allowLogin: 1,
      last_login_time: new Date(),
      followedAccountCount: 0,
      followingAccountCount: 0
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
    return {
      account: newAccount,
      accountEmails: null,
      accountWallets: [newAccountWallet]
    };

  }
  async signInWithWalletAddress(request: Web3SignChallengeRequest): Promise<AuthorizedUser> {
    let address = request.address.toLowerCase();
    let accountId: string = null;

    let searchAccounts = await this.accountBaseService.searchAccountsByWalletAddress(address, false);
    if (!searchAccounts || searchAccounts.length == 0) {
      this.logger.warn(`wallet address ${address} does not exist`);
      this.logger.log(`creating new account for wallet address ${address}`);

      let newAccount = await this.createAccount4WalletAddress(address, request.chain, request.walletSource);
      accountId = newAccount.account.accountId;

    } else {
      let searchAccount = searchAccounts[0];
      if (!searchAccount.verified) {
        throw new BadRequestException("wallet address for account does not verified");
      }
      accountId = searchAccount.accountId;
    }

    let findAccount = await this.accountBaseService.searchAccount(accountId);
    if (!findAccount) {
      throw new BadRequestException("account not exist");
    }
    if (!findAccount.allowLogin) {
      throw new BadRequestException("account is disabled to login");
    }
    let mockEmail: string = `${accountId}@web3go.xyz`;
    let payload: SignTokenPayload = {
      id: accountId,
      email: mockEmail,
      address: address,
      first_name: findAccount.nickName,
      groups: await this.accountBaseService.searchAccountGroups(accountId),
    };

    let token = await this.jwtAuthService.grantToken(payload);

    return {
      id: payload.id,
      name: payload.first_name,
      token: token
    };
  }


  async web3_challenge(request: Web3SignChallengeRequest): Promise<Web3SignChallengeResponse> {
    try {
      let challenge = request.challenge;
      let nonce = request.nonce;
      if (!challenge) {
        throw new BadRequestException('challenge invalid');
      }
      if (!nonce) {
        throw new BadRequestException('nonce invalid');
      }

      //check nonce exist
      let nonceCache = await this.kvService.get(nonce);
      if (nonceCache) {

        //verify signature
        let resp = await this.getWeb3SignHelper(request.walletSource, request.chain).challenge(request);

        //remove nonce
        this.kvService.del(nonce);

        if (resp.verified) {
          this.logger.log(`challenge success`);
        }
        else {
          throw new BadRequestException('challenge failed');
        }
        return resp;
      } else {
        throw new BadRequestException('nonce not exist');
      }

    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('request invalid, ' + error);
    }
  }
  async web3_nonce(request: Web3SignNonceRequest): Promise<Web3SignNonceResponse> {
    let resp = await this.getWeb3SignHelper(request.walletSource, request.chain).createChallenge(request);

    this.logger.debug(`web3_nonce: ${JSON.stringify(resp)}`);
    let cacheExpireSeconds = 120;
    this.kvService.set(resp.nonce, JSON.stringify(resp), cacheExpireSeconds);
    return resp;
  }
  getWeb3SignHelper(walletSource: string, chain: string): IWeb3Sign {
    if (walletSource.toLowerCase() == WalletSupported.Polkadot_JS.toLowerCase()) {
      return this.polkadotSignHelper;
    }
    if (walletSource.toLowerCase() == WalletSupported.Metamask.toLowerCase()) {
      return this.metamaskSignHelper;
    }
    return null;
  }

}
