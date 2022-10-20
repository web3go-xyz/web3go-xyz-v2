import { BadRequestException, Get, Query } from '@nestjs/common';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/base/auth/authUser';
import { AccountVerifyCode } from 'src/base/entity/platform-user/Account-VerifyCode.entity';
import { VerifyCodePurpose } from 'src/base/entity/platform-user/VerifyCodeType';
import { W3Logger } from 'src/base/log/logger.service';
import { AccountInfo } from 'src/viewModel/user-auth/AccountInfo';
import { AccountSearchResult } from 'src/viewModel/user-auth/AccountSearchResult';
import { AccountSigninRequest } from 'src/viewModel/user-auth/AccountSigninRequest';
import { AccountSignupRequest } from 'src/viewModel/user-auth/AccountSignupRequest';
import { ChangePasswordRequest } from 'src/viewModel/user-auth/ChangePasswordRequest';
import { EmailVerifyRequest } from 'src/viewModel/user-auth/EmailVerifyRequest';
import { AccountAuthService, } from './account-auth.service';


@Controller('/api/v2/account/auth')
@ApiTags('/api/v2/account/auth')
export class AccountAuthController {
  logger: W3Logger;
  constructor(private readonly accountAuthService: AccountAuthService) {
    this.logger = new W3Logger(`AccountAuthController`);
  }


  @Post('/signup')
  @ApiOperation({ summary: '[Web2] create new user account' })
  @ApiOkResponse({ type: AccountInfo })
  async signup(@Body() request: AccountSignupRequest): Promise<AccountInfo> {

    this.logger.debug(`signup:${JSON.stringify(request)}`);
    let ifExist: boolean = await this.accountAuthService.checkEmailExist(request.email);
    if (ifExist) {
      throw new BadRequestException("current email has been registed, you can try with another email or just signin with current email. If your forget the password, please click the 'Forget Password' to reset it.");
    } else {
      this.logger.log('email check passed.')
    }

    let userInfo: AccountInfo = await this.accountAuthService.createAccount4Email(request);
    return userInfo;
  }

  @Post('/sendVerifyEmail')
  @ApiOperation({ summary: '[Web2] the service will send an email contains the verify code.' })
  @ApiOkResponse({ type: Boolean })
  async verifyEmail(@Body() request: EmailVerifyRequest): Promise<Boolean> {
    return await this.accountAuthService.sendVerifyEmail(request);
  }

  @Get('/verifyCode')
  @ApiOperation({ summary: '[Web2] verify code if valid' })
  @ApiOkResponse({ type: Boolean })
  async verifyCode(@Query('accountId') accountId: string,
    @Query('email') email: string,
    @Query('code') code: string,
    @Query('verifyCodePurpose') verifyCodePurpose: string,
  ): Promise<boolean> {

    return await this.accountAuthService.verifyCode({
      accountId: accountId,
      email: email,
      code: code,
      verifyCodePurpose: verifyCodePurpose as VerifyCodePurpose
    });
  }

  @Post('/changePassword')
  @ApiOperation({ summary: '[Web2] change password' })
  @ApiOkResponse({ type: Boolean })
  async changePassword(@Body() request: ChangePasswordRequest): Promise<boolean> {
    return await this.accountAuthService.changePassword(request);
  }

  @Get('/searchAccountsByEmail')
  @ApiOperation({ summary: '[Web2] find accountId with emails' })
  @ApiOkResponse({ type: AccountSearchResult })
  async searchAccountsByEmail(@Query('filter') filter: string): Promise<AccountSearchResult[]> {
    return await this.accountAuthService.searchAccountsByEmail(filter, false);
  }

  @Post('/signin')
  @ApiOperation({ summary: '[Web2] login in , return user info and access token' })
  @ApiOkResponse({ type: AuthUser })
  async signin(@Body() request: AccountSigninRequest): Promise<AuthUser> {
    {
      this.logger.debug(`signin:${JSON.stringify(request)}`);
      return await this.accountAuthService.signin(request);
    }
  }

}

