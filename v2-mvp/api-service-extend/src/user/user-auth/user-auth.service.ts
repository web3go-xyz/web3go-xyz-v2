import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { JwtService } from '@nestjs/jwt';
import { AuthUser } from 'src/base/auth/authUser';
import { IAuthService } from 'src/base/auth/IAuthService';
import { User } from 'src/base/entity/platform-user/User.entity';
import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { UserInfo } from 'src/viewModel/user-auth/UserInfo';
import { W3Logger } from 'src/base/log/logger.service';


const md5 = require('js-md5');

@Injectable()
export class UserAuthService implements IAuthService {
  logger: W3Logger;

  constructor(
    private readonly jwtService: JwtService,
    @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_USER_REPOSITORY.provide)
    private userRepository: Repository<User>,

  ) {
    this.logger = new W3Logger(`UserAuthService`);
  }

  async validateUser(username: string, password: string): Promise<AuthUser> {
    const user = await this.userRepository.findOne({
      where: { loginName: username }
    });
    if (user && this.verifyPassword(user.loginName, user.passwordHash, password)) {

      let authUser: AuthUser = { userId: user.userId, username: user.email };
      this.logger.log(`validate user:${JSON.stringify(authUser)}`);

      return authUser;
    }
    let error = `username [${username}] or password invalid, please check`;
    this.logger.error(error);
    throw new UnauthorizedException(error);
  }
  async grantToken(user: AuthUser): Promise<string> {
    const payload = { username: user.username, sub: user.userId };
    // console.debug(payload);

    let token = this.jwtService.sign(payload);
    // console.debug(token);
    return token;

  }



  async getUserInfo(userId: number): Promise<UserInfo> {
    const user = await this.userRepository.findOne({
      where: { userId: userId }
    });
    delete user.passwordHash;
    return user;
  }

  verifyPassword(loginName: string, passwordHash: string, password: string) {
    let encrypt = this.encryptPassword(loginName, password);
    return encrypt === passwordHash;
  }
  encryptPassword(loginName: string, password: string): string {
    let encrypt = md5(loginName + password);
    return encrypt;
  }

}
