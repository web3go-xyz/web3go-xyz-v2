import { BadRequestException, Body, Controller, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthorizedUser } from 'src/base/auth/AuthorizedUser';
import { JwtAuthGuard } from 'src/base/auth/decorator/JwtAuthGuard';

import { W3Logger } from 'src/base/log/logger.service';
import { AccountInfo } from 'src/viewModel/account/AccountInfo';
import { ChangeAvatarRequest } from 'src/viewModel/account/info/ChangeAvatarRequest';
import { ChangeNickNameRequest } from 'src/viewModel/account/info/ChangeNickNameRequest';
import { CheckEmailRequest } from 'src/viewModel/account/info/CheckEmailRequest';
import { LinkEmailRequest } from 'src/viewModel/account/info/LinkEmailRequest';
import { LinkWalletRequest } from 'src/viewModel/account/info/LinkWalletRequest';
import { SearchAccountInfoRequest } from 'src/viewModel/account/info/SearchAccountInfoRequest';
import { UnlinkEmailRequest } from 'src/viewModel/account/info/UnlinkEmailRequest';
import { UnlinkWalletRequest } from 'src/viewModel/account/info/UnlinkWalletRequest';
import { AccountInfoService } from './account-info.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/v2/account/info')
@ApiTags('/api/v2/account/info')
export class AccountInfoController {
  logger: any;
  constructor(private readonly accountInfoService: AccountInfoService) {
    this.logger = new W3Logger('AccountInfoController');
  }

  @Post('/searchAccountInfo')
  @ApiOperation({
    summary: 'search account info for specified account',
  })
  @ApiOkResponse({ type: AccountInfo, isArray: true })
  async searchAccountInfo(@Body() searchAccountInfo: SearchAccountInfoRequest): Promise<AccountInfo[]> {
    return await this.accountInfoService.getAccountInfo(searchAccountInfo.accountIds, searchAccountInfo.includeExtraInfo || false);
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

