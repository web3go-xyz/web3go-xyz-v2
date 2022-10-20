import { BadRequestException, Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { W3Logger } from 'src/base/log/logger.service';
import { Web3SignInChallengeRequest } from '../../base/web3/sign/model/Web3SignInChallengeRequest';
import { Web3SignInChallengeResponse } from '../../base/web3/sign/model/Web3SignInChallengeResponse';
import { Web3SignInNonceRequest } from '../../base/web3/sign/model/Web3SignInNonceRequest';
import { Web3SignInNonceResponse } from '../../base/web3/sign/model/Web3SignInNonceResponse';
import { KVService } from 'src/base/kv/kv.service';
import { Web3SignInService } from './web3.signin.service';
import { AccountSearchResult } from 'src/viewModel/user-auth/AccountSearchResult';
import { WalletSupported } from 'src/viewModel/chain/walletSupported';
import { BlockChainSupported } from 'src/viewModel/chain/blockChainSupported';
import { PolkadotSignHelper } from 'src/base/web3/sign/polkadot/polkadot.sign.helper';
import { MetamaskSignHelper } from 'src/base/web3/sign/metamask/metamask.sign.helper';
import { IWeb3Sign } from 'src/base/web3/sign/IWeb3Sign';


@Controller('/api/v2/account/web3')
@ApiTags('/api/v2/account/web3')
export class Web3SignInController {
  logger: W3Logger;

  constructor(
    private kvService: KVService,
    private readonly service: Web3SignInService,

    private readonly polkadotSignHelper: PolkadotSignHelper,
    private readonly metamaskSignHelper: MetamaskSignHelper
  ) {
    this.logger = new W3Logger(`Web3SignInController`);
  }

  @Get('/getSupportedWallet')
  @ApiOperation({ summary: 'get wallets which support signin' })
  getSupportedWallet(
  ): any {
    return [
      {
        wallet: WalletSupported.Metamask.toString(),
        chains: [
          BlockChainSupported.BSC.toString()
        ]
      },
      {
        wallet: WalletSupported.Polkadot_JS.toString(),
        chains: [
          BlockChainSupported.Polkadot.toString()
        ]
      }
    ]
  }

  @Get('/searchAccountsByWalletAddress')
  @ApiOperation({ summary: '[Web3] find accountId with  wallet address' })
  @ApiOkResponse({ type: AccountSearchResult })
  async searchAccountsByWalletAddress(@Query('filter') filter: string): Promise<AccountSearchResult[]> {
    return await this.service.searchAccountsByWalletAddress(filter, false);
  }


  @Post('/web3_nonce')
  @ApiOperation({ summary: '[Web3] create a nonce message for signin request' })
  @ApiOkResponse({ type: Web3SignInNonceResponse })
  async nonce(@Body() request: Web3SignInNonceRequest): Promise<Web3SignInNonceResponse> {

    let resp = await this.getWeb3SignHelper(request.walletSource, request.chain).createChallenge(request);

    this.logger.debug(`web3_nonce: ${JSON.stringify(resp)}`);
    let cacheExpireSeconds = 120;
    this.kvService.set(resp.nonce, JSON.stringify(resp), cacheExpireSeconds);

    return resp;
  }

  @Post('/web3_challenge')
  @ApiOperation({ summary: '[Web3] verify the nonce message and signature' })
  @ApiOkResponse({ type: Web3SignInChallengeResponse })
  async challenge(@Body() request: Web3SignInChallengeRequest): Promise<Web3SignInChallengeResponse> {
    try {

      let challenge = request.challenge;
      let nonce = request.nonce;
      if (!challenge) {
        throw new BadRequestException('challenge invalid');
      } if (!nonce) {
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

          let authUser = await this.service.signInWithWalletAddress(request);
          if (authUser) {
            resp.extra = authUser;
          }
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

