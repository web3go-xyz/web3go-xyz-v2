import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/base/auth/authUser';
import { JwtAuthGuard } from 'src/base/auth/JwtAuthGuard';
import { W3Logger } from 'src/base/log/logger.service';
import { AccountInfo } from 'src/viewModel/user-auth/AccountInfo';
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


  @Post('/getAccountInfo')
  @ApiOperation({
    summary: 'get current account info',
  })
  @ApiOkResponse({ type: AccountInfo })
  async getAccountInfo(@Request() request): Promise<AccountInfo> {

    let validateUser: AuthUser = request.user;
    this.logger.log(`validateUser:${JSON.stringify(validateUser)}`);
    let accountId = validateUser.id;
    return await this.accountInfoService.getAccountInfo(accountId);
  }

}

