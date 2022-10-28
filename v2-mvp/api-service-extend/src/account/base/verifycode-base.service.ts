import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { W3Logger } from 'src/base/log/logger.service';
import { AccountVerifyCode } from 'src/base/entity/platform-user/AccountVerifyCode.entity'; 
import { VerifyCodeType, VerifyCodePurpose } from 'src/viewModel/VerifyCodeType';

@Injectable()
export class VerifyCodeBaseService {
  public CODE_EXPIRED_MINUTES: number = 10;
  public CODE_LENGTH: number = 6;

  logger: W3Logger;

  constructor(
    @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_ACCOUNT_VERIFYCODE_REPOSITORY.provide)
    private accountVerifyCodeRepository: Repository<AccountVerifyCode>,

  ) {
    this.logger = new W3Logger(`VerifyCodeBaseService`);
  }
  async newCode(accountId: string, verifyKey: string, verifyType: VerifyCodeType, verifyCodePurpose: VerifyCodePurpose): Promise<AccountVerifyCode> {
    await this.clearCode(accountId, verifyKey, verifyType, verifyCodePurpose);
    let newCode: AccountVerifyCode = {
      id: 0,
      verifyType: verifyType,
      purpose: verifyCodePurpose,
      verifyKey: verifyKey,
      code: this.generateVerifyCode(this.CODE_LENGTH),
      accountId: accountId,
      created_time: new Date(),
      expired_time: new Date(new Date().getTime() + (this.CODE_EXPIRED_MINUTES * 1000 * 60))
    }
    await this.accountVerifyCodeRepository.save(newCode);

    return newCode;
  }
  async clearCode(accountId: string, verifyKey: string, verifyType: VerifyCodeType, purpose: VerifyCodePurpose) {
    await this.accountVerifyCodeRepository.delete({
      accountId: accountId,
      verifyKey: verifyKey,
      verifyType: verifyType,
      purpose: purpose
    });
  }

  generateVerifyCode(codeLength: number): string {
    let code = "";
    var codeChars = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
    for (var i = 0; i < codeLength; i++) {
      var charNum = Math.floor((Math.random() * (new Date()).getTime()) % codeChars.length);
      code += codeChars[charNum];
    }
    return code;
  }
  async verifyCode(accountId: string, code: string, verifyKey: string, verifyType: VerifyCodeType, verifyCodePurpose: VerifyCodePurpose, clearAfterVerifiedSuccess: boolean = true): Promise<Boolean> {
    this.logger.debug(`verify code: accountId=${accountId}, code=${code}, verifyKey=${verifyKey}, verifyCodePurpose=${verifyCodePurpose}`);
    let findCode = await this.accountVerifyCodeRepository.findOne({
      where: {
        accountId: accountId,
        code: code,
        verifyKey: verifyKey,
        verifyType: verifyType.toString(),
        purpose: verifyCodePurpose.toString()
      }
    });
    if (findCode && findCode.expired_time.getTime() > new Date().getTime()) {
      this.logger.debug(`verify code success: accountId=${accountId}, code=${code}, verifyKey=${verifyKey}, verifyCodePurpose=${verifyCodePurpose}`);
     
      if (clearAfterVerifiedSuccess) {
        await this.clearCode(accountId, verifyKey, verifyType, verifyCodePurpose);
      }
      return true;
    }

    return false;
  }

}
