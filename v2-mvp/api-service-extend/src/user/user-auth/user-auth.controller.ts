import { BadRequestException, Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/base/auth/authUser';
import { JwtAuthGuard } from 'src/base/auth/JwtAuthGuard';
import { LocalAuthGuard } from 'src/base/auth/LocalAuthGuard';
import { UserInfo } from 'src/viewModel/user-auth/UserInfo';
import { UserSigninRequest } from 'src/viewModel/user-auth/UserSigninRequest';
import { UserAuthService } from './user-auth.service';

@Controller('/v2/user/auth')
@ApiTags('v2/user/auth')
export class UserController {
  constructor(private readonly userAuthService: UserAuthService) { }


  // API for logging in a user
  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  @ApiOperation({ summary: '[Web2] login in , return user info and access token' })
  @ApiOkResponse()
  async signin(@Body() request: UserSigninRequest, @Request() req): Promise<any> {
    // console.log(request);
    // console.log(req.user);
    let validateUser: AuthUser = req.user;
    validateUser.username = request.username;
    let token = await this.userAuthService.grantToken(validateUser);
    if (token) {
      validateUser.token = token;
    }
    return validateUser;
  }

  // API for retriving user info by Id
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/getUserInfo')
  @ApiOperation({
    summary: 'get current user info',
    description: 'add [Authorization] in http header. Format:  "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vybm..." '
  })
  @ApiOkResponse({ type: UserInfo })
  async getUserInfo(@Request() request): Promise<UserInfo> {
    // console.log(request);
    let validateUser: AuthUser = request.user;
    let userId = validateUser.userId;
    return await this.userAuthService.getUserInfo(userId);
  }


}

