import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/base/auth/authUser';
import { JwtAuthGuard } from 'src/base/auth/JwtAuthGuard';
import { AccountInfo } from 'src/viewModel/user-auth/UserInfo';
import { AccountInfoService } from './account-info.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/v2/account/info')
@ApiTags('/api/v2/account/info')
export class AccountInfoController {
  constructor(private readonly accountInfoService: AccountInfoService) { }


  @Post('/getAccountInfo')
  @ApiOperation({
    summary: 'get current account info',
  })
  @ApiOkResponse({ type: AccountInfo })
  async getAccountInfo(@Request() request): Promise<AccountInfo> {
    // console.log(request);
    let validateUser: AuthUser = request.user;
    let accountId = validateUser.id;
    return await this.accountInfoService.getAccountInfo(accountId);
  }

}

