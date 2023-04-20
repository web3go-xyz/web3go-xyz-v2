import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';

import { AuthorizedUser } from 'src/base/auth/AuthorizedUser';
import { AllowAnonymous } from 'src/base/auth/decorator/AllowAnonymous';
import { JwtAuthGuard } from 'src/base/auth/decorator/JwtAuthGuard';
import { JWTAuthService } from 'src/base/auth/jwt-auth.service';
import { W3Logger } from 'src/base/log/logger.service';
import { GenerateShareLink4DatasetRequest } from './model/GenerateShareLink4DatasetRequest';
import { GenerateShareLink4DatasetResponse } from './model/GenerateShareLink4DatasetResponse';
import { Log4ShareDatasetRequest } from './model/Log4ShareDatasetRequest';
import { Log4ShareDatasetResponse } from './model/Log4ShareDatasetResponse';

import { ShareService } from './share.service';


@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/v2/dataset/share')
@ApiTags('/api/v2/dataset/')
export class ShareController {
    logger: W3Logger;
    constructor(private readonly service: ShareService,
        private readonly jwtService: JWTAuthService) {
        this.logger = new W3Logger(`ShareController`);
    }

    @AllowAnonymous()
    @Post('/logShare')
    @ApiOperation({ summary: 'create a log when share the specified dataset' })
    @ApiOkResponse({ type: Log4ShareDatasetResponse })
    async logShare(@Req() req,
        @Body() param: Log4ShareDatasetRequest): Promise<Log4ShareDatasetResponse> {

        let accountId = '';
        let validateUser: AuthorizedUser = this.jwtService.decodeAuthUserFromHttpRequest(req);
        if (validateUser) {
            accountId = validateUser.id;
        }

        this.logger.debug(`logShare:${JSON.stringify(param)}, accountId:${accountId}`);

        return await this.service.logShare(param, accountId || '');
    }

    @AllowAnonymous()
    @Post('/generateDatasetShareLink')
    @ApiOperation({ summary: 'generate share link when share the specified dataset' })
    @ApiOkResponse({ type: GenerateShareLink4DatasetResponse })
    async generateDatasetShareLink(@Req() req,
        @Body() param: GenerateShareLink4DatasetRequest): Promise<GenerateShareLink4DatasetResponse> {

        let accountId = '';
        let validateUser: AuthorizedUser = this.jwtService.decodeAuthUserFromHttpRequest(req);
        if (validateUser) {
            accountId = validateUser.id;
        }

        this.logger.debug(`generateDatasetShareLink:${JSON.stringify(param)}, accountId:${accountId}`);

        return await this.service.generateDatasetShareLink(param, accountId || '');
    }



}