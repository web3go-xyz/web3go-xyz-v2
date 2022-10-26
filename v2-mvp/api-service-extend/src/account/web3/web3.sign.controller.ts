import { BadRequestException, Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { W3Logger } from 'src/base/log/logger.service';
import { Web3SignInChallengeRequest } from '../../base/web3/sign/model/Web3SignInChallengeRequest';
import { Web3SignInChallengeResponse } from '../../base/web3/sign/model/Web3SignInChallengeResponse';
import { Web3SignInNonceRequest } from '../../base/web3/sign/model/Web3SignInNonceRequest';
import { Web3SignInNonceResponse } from '../../base/web3/sign/model/Web3SignInNonceResponse';
import { Web3SignService } from './web3.sign.service';
import { AccountSearchResult } from 'src/viewModel/account/AccountSearchResult';
import { WalletSupported } from 'src/viewModel/chain/walletSupported';
import { BlockChainSupported } from 'src/viewModel/chain/blockChainSupported';


@Controller('/api/v2/account/web3')
@ApiTags('/api/v2/account/web3')
export class Web3SignController {
  logger: W3Logger;

  constructor(
    private readonly service: Web3SignService,

  ) {
    this.logger = new W3Logger(`Web3SignController`);
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
    if (!filter) {
      throw new BadRequestException('request filter invalid');
    }
    return await this.service.searchAccountsByWalletAddress(filter, false);
  }


  @Post('/web3_nonce')
  @ApiOperation({ summary: '[Web3] create a nonce message for signin request' })
  @ApiOkResponse({ type: Web3SignInNonceResponse })
  async web3_nonce(@Body() request: Web3SignInNonceRequest): Promise<Web3SignInNonceResponse> {
    if (!request.walletSource || !request.chain || !request.address) {
      throw new BadRequestException('request parameter invalid');
    }
    let resp: Web3SignInNonceResponse = await this.service.web3_nonce(request);

    return resp;
  }

  @Post('/web3_challenge')
  @ApiOperation({ summary: '[Web3] verify the nonce message and signature' })
  @ApiOkResponse({ type: Web3SignInChallengeResponse })
  async challenge(@Body() request: Web3SignInChallengeRequest): Promise<Web3SignInChallengeResponse> {
    if (!request.walletSource || !request.chain || !request.address || !request.nonce || !request.challenge || !request.signature) {
      throw new BadRequestException('request parameter invalid');
    }

    let resp: Web3SignInChallengeResponse = await this.service.web3_challenge(request);
    if (resp.verified) {
      let authUser = await this.service.signInWithWalletAddress(request);
      if (authUser) {
        resp.extra = authUser;
      }
    }
    return resp;

  }


}

