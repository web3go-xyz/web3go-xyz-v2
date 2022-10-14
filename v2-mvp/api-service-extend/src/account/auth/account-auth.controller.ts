import { Get } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { Response } from '@nestjs/common';
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/base/auth/authUser';
import { JwtAuthGuard } from 'src/base/auth/JwtAuthGuard';
import { AccountAuthService, } from './account-auth.service';
const escapeHtml = require("escape-html");
const jwt = require("jsonwebtoken");
const url = require("url");

@Controller('/api/v2/account/auth')
@ApiTags('/api/v2/account/auth')
export class AccountAuthController {
  constructor(private readonly accountAuthService: AccountAuthService) { }

  //sso 
  @Get('/sso')
  @ApiOperation({ summary: 'sso integration' })
  async sso_request(@Request() req, @Response() resp): Promise<any> {
    resp.send(`
    <html>
      <h1>Login</h1>
      <form method="post" action="/api/v2/user/auth/sso">
        <label>Email</label>
        <input type="text" name="email">
        <label>Password</label>
        <input type="password" name="password">
        <input type="hidden" name="return_to" value="${escapeHtml(
      req.query.return_to || '/',
    )}">
        <input type="submit" value="Submit">
      </form>
    </html>
  `);
  }

  @Post('/sso')
  @ApiOperation({ summary: 'sso integration' })
  async sso_response(@Request() req, @Response() resp): Promise<any> {
    {
      const METABASE_JWT_URL = "http://13.214.196.16:12345/auth/sso";
      const METABASE_JWT_SHARED_SECRET =
        "f47547372b2274db2572c77697f4aff6dbd4ce46961c4e7fb90f2bd90ea13ef3";

      let email = req.body.email;
      let user = {
        email: email,
        first_name: 'user01',
        last_name: 'sso',
        groups: ['CommonUser'],
        exp: Math.round(Date.now() / 1000) + (60 * 60), // 60 minute expiration
      }
      if (user) {
        let jwt_token = jwt.sign(
          user,
          METABASE_JWT_SHARED_SECRET,
        );
        let return_to = '/';
        if (req.body && req.body.return_to) {
          return_to = req.body.return_to;
        }

        resp.redirect(
          url.format({
            pathname: METABASE_JWT_URL,
            query: {
              jwt: jwt_token,
              return_to: return_to,
            },
          }),
        );
      } else {
        resp.status(400).send("Invalid username or password");
      }
    }
  }




}

