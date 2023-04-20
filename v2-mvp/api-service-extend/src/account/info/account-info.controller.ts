import { BadRequestException, Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthorizedUser } from 'src/base/auth/AuthorizedUser';
import { JwtAuthGuard } from 'src/base/auth/decorator/JwtAuthGuard';

import { W3Logger } from 'src/base/log/logger.service';
import { AccountInfo } from 'src/account/model/AccountInfo';
import { ChangeAvatarRequest } from 'src/account/model/info/ChangeAvatarRequest';
import { ChangeNickNameRequest } from 'src/account/model/info/ChangeNickNameRequest';
import { CheckEmailRequest } from 'src/account/model/info/CheckEmailRequest';
import { LinkEmailRequest } from 'src/account/model/info/LinkEmailRequest';
import { LinkWalletRequest } from 'src/account/model/info/LinkWalletRequest';
import { SearchAccountInfoRequest } from 'src/account/model/info/SearchAccountInfoRequest';
import { UnlinkEmailRequest } from 'src/account/model/info/UnlinkEmailRequest';
import { UnlinkWalletRequest } from 'src/account/model/info/UnlinkWalletRequest';
import { AccountInfoService } from './account-info.service';
import { AllowAnonymous } from 'src/base/auth/decorator/AllowAnonymous';
import { AccountStatisticResponse, } from '../model/info/AccountStatisticResponse';
import { AccountStatisticRequest } from '../model/info/AccountStatisticRequest';
import { JWTAuthService } from 'src/base/auth/jwt-auth.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/v2/account/info')
@ApiTags('/api/v2/account/info')
export class AccountInfoController {
  logger: any;
  constructor(
    private readonly accountInfoService: AccountInfoService,
    private readonly jwtService: JWTAuthService,) {
    this.logger = new W3Logger('AccountInfoController');
  }

  @AllowAnonymous()
  @Post('/searchAccountInfo')
  @ApiOperation({
    summary: 'search account info for specified account',
  })
  @ApiOkResponse({ type: AccountInfo, isArray: true })
  async searchAccountInfo(@Body() searchAccountInfo: SearchAccountInfoRequest): Promise<AccountInfo[]> {
    return await this.accountInfoService.getAccountInfo(searchAccountInfo.accountIds, searchAccountInfo.includeExtraInfo || false);
  }

  @AllowAnonymous()
  @Post('/getAccountStatistic')
  @ApiOperation({
    summary: 'get statistic info for account',
  })
  @ApiOkResponse({ type: AccountStatisticResponse, isArray: true })
  async getAccountStatistic(@Body() param: AccountStatisticRequest, @Request() rawRequest): Promise<AccountStatisticResponse[]> {
    const userSession = this.getUserSession(rawRequest);
    const isIncludeDraft = param.accountIds.length === 1 && userSession && userSession.id && userSession.id === param.accountIds[0];
    return await this.accountInfoService.getAccountStatistic(param.accountIds, !isIncludeDraft );
  }

  private getUserSession(/*@Request() */ rawRequest) {
    try {
      return this.jwtService.decodeAuthUserFromHttpRequest(rawRequest);
    } catch (e) {
      // mute invalid sessions, just treated it as unlogged users.
    }
    return null;
  }

  @AllowAnonymous()
  @Get('/myspace/statistics/:id')
  @ApiOperation({
    summary: 'get statistic info for account',
  })
  // @ApiOkResponse({ type: AccountStatisticResponse, isArray: false })
  async getMySpaceStatistic(@Param('id') id: string, @Request() rawRequest,): Promise<any> {
    const userSession = this.getUserSession(rawRequest);
    const isIncludeDraft = userSession && userSession.id && userSession.id === id;
    const data = (await this.accountInfoService.getAccountStatistic([id], !isIncludeDraft)) || [];

    return {
      dashboard:  data[0].count,
      dataset: data[0].dataset.count,
      favorite: data[0].total_favorite_count + data[0].dataset.total_favorite_count,
    }
  }

  @Post('/getAccountInfo')
  @ApiOperation({
    summary: 'get current account info',
  })
  @ApiOkResponse({ type: AccountInfo })
  async getAccountInfo(@Request() request): Promise<AccountInfo> {

    let validateUser: AuthorizedUser = request.user;
    this.logger.log(`validateUser:${JSON.stringify(validateUser)}`);
    let accountId = validateUser.id;
    let accounts = await this.accountInfoService.getAccountInfo([accountId], true);
    if (accounts && accounts.length > 0) {
      return accounts[0];
    }
    return null;
  }

  @Post('/changeName')
  @ApiOperation({
    summary: 'change nickname for account',
  })
  @ApiOkResponse({ type: Boolean })
  async changeNickname(@Request() request, @Body() payload: ChangeNickNameRequest): Promise<Boolean> {

    this.requireAccountIdMatch(request, payload);
    return await this.accountInfoService.changeNickname(payload);
  }

  @Post('/changeAvatar')
  @ApiOperation({
    summary: 'change avatar for account',
  })
  @ApiOkResponse({ type: Boolean })
  async changeAvatar(@Request() request, @Body() payload: ChangeAvatarRequest): Promise<Boolean> {

    this.requireAccountIdMatch(request, payload);
    return await this.accountInfoService.changeAvatar(payload);
  }


  @Post('/checkEmailBeforeLink')
  @ApiOperation({
    summary: 'check email before link it with account, if passed, an email with code will be sent.',
  })
  @ApiOkResponse({ type: Boolean })
  async checkEmailBeforeLink(@Request() request, @Body() payload: CheckEmailRequest): Promise<Boolean> {

    this.requireAccountIdMatch(request, payload);

    return await this.accountInfoService.checkEmailBeforeLink(payload);

  }

  @Post('/linkEmail')
  @ApiOperation({
    summary: 'link email with account',
  })
  @ApiOkResponse({ type: Boolean })
  async linkEmail(@Request() request, @Body() payload: LinkEmailRequest): Promise<Boolean> {

    this.requireAccountIdMatch(request, payload);

    return await this.accountInfoService.linkEmail(payload);

  }

  @Post('/unlinkEmail')
  @ApiOperation({
    summary: 'unlink email with account',
  })
  @ApiOkResponse({ type: Boolean })
  async unlinkEmail(@Request() request, @Body() payload: UnlinkEmailRequest): Promise<Boolean> {

    this.requireAccountIdMatch(request, payload);
    try {
      return await this.accountInfoService.unlinkEmail(payload);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }


  @Post('/linkWallet')
  @ApiOperation({
    summary: 'link wallet address with account',
  })
  @ApiOkResponse({ type: Boolean })
  async linkWallet(@Request() request, @Body() payload: LinkWalletRequest): Promise<Boolean> {

    this.requireAccountIdMatch(request, payload);
    try {
      return await this.accountInfoService.linkWallet(payload);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post('/unlinkWallet')
  @ApiOperation({
    summary: 'unlink wallet with account',
  })
  @ApiOkResponse({ type: Boolean })
  async unlinkWallet(@Request() request, @Body() payload: UnlinkWalletRequest): Promise<Boolean> {

    this.requireAccountIdMatch(request, payload);
    try {
      return await this.accountInfoService.unlinkWallet(payload);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }


  requireAccountIdMatch(request: any, payload: any) {
    if (request && request.user) {
      let validateUser: AuthorizedUser = request.user;
      if (payload && payload.accountId) {
        let matched = validateUser.id.toLowerCase() === payload.accountId.toLowerCase();
        if (matched) {
          return true;
        }
        else {
          throw new BadRequestException(`accountId not match with authorized user`);
        }
      } else {
        throw new BadRequestException(`no accountId in payload`);
      }
    } else {
      throw new BadRequestException(`no authorized user`);
    }


  }

}

