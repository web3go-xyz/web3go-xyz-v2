import { Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { W3Logger } from 'src/base/log/logger.service';
import { SignTokenPayload } from './SignTokenPayload';

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

}
