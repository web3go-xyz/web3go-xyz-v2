import { Inject, Injectable } from '@nestjs/common';
import { AccountVerifyCode } from 'src/base/entity/platform-user/Account-VerifyCode.entity';
import { W3Logger } from 'src/base/log/logger.service';
import { RepositoryConsts } from 'src/base/orm/repositoryConsts';
import { Repository } from 'typeorm';

@Injectable()
export class DebugService {
    logger: W3Logger;

    constructor(
        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_ACCOUNT_VERIFYCODE_REPOSITORY.provide)
        private accountVerifyCodeRepository: Repository<AccountVerifyCode>,

    ) {
        this.logger = new W3Logger(`DebugService`);
    }

    async DEBUG_verifyCode(): Promise<any> {
        return await this.accountVerifyCodeRepository.find();
    }
}
