import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { JwtService } from '@nestjs/jwt';
import { AuthUser } from 'src/base/auth/authUser';
import { IAuthService } from 'src/base/auth/IAuthService';
import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { W3Logger } from 'src/base/log/logger.service';
import { Account } from 'src/base/entity/platform-user/Account.entity';


const md5 = require('js-md5');

@Injectable()
export class AccountAuthService implements IAuthService {
  logger: W3Logger;

  constructor(
    private readonly jwtService: JwtService,
    @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_USER_REPOSITORY.provide)
    private accountRepository: Repository<Account>,

  ) {
    this.logger = new W3Logger(`AccountAuthService`);
  }

  async validateUser(account_id: string, password_verify: string): Promise<AuthUser> {
    const user = await this.accountRepository.findOne({
      where: { accountId: account_id }
    });
    if (user && this.verifyPassword(user.accountId, user.authMasterPassword, password_verify)) {

      let authUser: AuthUser = { id: user.accountId, name: user.nickName };
      this.logger.log(`validate user:${JSON.stringify(authUser)}`);

      return authUser;
    }
    let error = `user [${account_id}] or password invalid, please check`;
    this.logger.error(error);
    throw new UnauthorizedException(error);
  }
  async grantToken(user: AuthUser): Promise<string> {
    const payload = { ...user };
    // console.debug(payload);

    let token = this.jwtService.sign(payload);
    // console.debug(token);
    return token;

  } 

  verifyPassword(id: string, passwordHash: string, password: string) {
    let encrypt = this.encryptPassword(id, password);
    return encrypt === passwordHash;
  }
  encryptPassword(id: string, password: string): string {
    let encrypt = md5(id + password);
    return encrypt;
  }
}
