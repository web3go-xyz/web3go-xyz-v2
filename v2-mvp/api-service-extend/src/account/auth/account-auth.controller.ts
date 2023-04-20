import { BadRequestException, Get, Query } from '@nestjs/common';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthorizedUser } from 'src/base/auth/AuthorizedUser'; 
import { W3Logger } from 'src/base/log/logger.service';
import { AccountInfo } from 'src/account/model/AccountInfo';
import { AccountSearchResult } from 'src/account/model/AccountSearchResult';
import { AccountSigninRequest } from 'src/account/model/auth/AccountSigninRequest';
import { AccountSignupRequest } from 'src/account/model/auth/AccountSignupRequest';
import { ChangePasswordRequest } from 'src/account/model/auth/ChangePasswordRequest';
import { EmailVerifyRequest } from 'src/account/model/EmailVerifyRequest';
import { VerifyCodePurpose } from 'src/account/model/VerifyCodeType';

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

    return await this.accountAuthService.verifyCodeAndGrantToken({
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
  @ApiOkResponse({ type: AuthorizedUser })
  async signin(@Body() request: AccountSigninRequest): Promise<AuthorizedUser> {
    {
      this.logger.debug(`signin:${JSON.stringify(request)}`);
      return await this.accountAuthService.signin(request);
    }
  }


  @Get('/jwt_verify')
  @ApiOperation({ summary: 'verify access token' })
  @ApiOkResponse({ type: Object })
  async jwt_verify(@Query('jwt') jwt: string): Promise<Object> {
    {
      this.logger.debug(`jwt_verify:${jwt}`);
      return await this.accountAuthService.jwt_verify(jwt);
    }
  }
}

