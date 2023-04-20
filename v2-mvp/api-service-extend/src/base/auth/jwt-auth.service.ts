import { Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { W3Logger } from 'src/base/log/logger.service';
import { AuthorizedUser } from './AuthorizedUser';
import { SignTokenPayload } from './SignTokenPayload';
import { Request } from 'express';
const md5 = require('js-md5');

@Injectable()
export class JWTAuthService {


  logger: W3Logger;

  constructor(
    private readonly jwtService: JwtService,


  ) {
    this.logger = new W3Logger(`JWTAuthService`);
  }

  async grantToken(payload: SignTokenPayload): Promise<string> {
    let token = this.jwtService.sign(payload);
    this.logger.debug(`signin with payload:${JSON.stringify(payload)}, got token:${token}`);
    return token;
  }


  passwordVerify(id: string, passwordHash: string, password: string) {
    let encrypt = this.passwordEncrypt(id, password);
    return encrypt === passwordHash;
  }
  passwordEncrypt(id: string, password: string): string {
    let encrypt = md5(id + password);
    return encrypt;
  }


  jwt_verify(jwt: string): Object | PromiseLike<Object> {
    let verify_result = this.jwtService.verify(jwt);
    this.logger.debug(`verify_result:${JSON.stringify(verify_result)}`);
    return verify_result;
  }

  jwt_decode(jwt: string): Object | PromiseLike<Object> {
    let decode_result = this.jwtService.decode(jwt);
    this.logger.debug(`decode_result:${JSON.stringify(decode_result)}`);
    return decode_result;
  }

  decodeAuthUserFromHttpRequest(request: Request): AuthorizedUser {
    let jwt = '';
    if (request && request.headers && request.headers.authorization) {
      jwt = request.headers.authorization.replace('Bearer', '').trim();
    }
    if (!jwt) {
      return null;
    }
    let decode_result = this.jwt_decode(jwt);
    if (decode_result) {

      let user: AuthorizedUser = {
        id: (decode_result as any).id || '',
        name: (decode_result as any).first_name || ''
      };
      return user;
    }
    return null;

  }

  extractXCookieFromHttpRequest(request: Request): string {
    let x_cookie = '';
    let header_key = 'X-Cookie';
    if (request && request.headers && request.header(header_key)) {
      x_cookie = request.header(header_key).toString().trim();
    }
    return x_cookie;
  }
}
