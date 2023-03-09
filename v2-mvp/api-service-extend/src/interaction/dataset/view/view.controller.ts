import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';

import { AuthorizedUser } from 'src/base/auth/AuthorizedUser';
import { AllowAnonymous } from 'src/base/auth/decorator/AllowAnonymous';
import { JwtAuthGuard } from 'src/base/auth/decorator/JwtAuthGuard';
import { JWTAuthService } from 'src/base/auth/jwt-auth.service';
import { W3Logger } from 'src/base/log/logger.service';

import { Log4ViewRequest } from './model/Log4ViewRequest';
import { Log4ViewResponse } from './model/Log4ViewResponse';
import { ViewService } from './view.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/v2/dataset/view')
@ApiTags('/api/v2/dataset/')
export class ViewController {
    logger: W3Logger;
    constructor(private readonly service: ViewService,
        private readonly jwtService: JWTAuthService) {
        this.logger = new W3Logger(`ViewController`);
    }

    @AllowAnonymous()
    @Post('/logView')
    @ApiOperation({ summary: 'create a log when view the specified dataset' })
    @ApiOkResponse({ type: Log4ViewResponse })
    async logView(@Req() req,
        @Body() param: Log4ViewRequest): Promise<Log4ViewResponse> {

        let accountId = '';
        let validateUser: AuthorizedUser = this.jwtService.decodeAuthUserFromHttpRequest(req);
        if (validateUser) {
            accountId = validateUser.id;
        }
        this.logger.debug(`logView:accountId=${accountId},${JSON.stringify(param)}`);
        return await this.service.logView(param, accountId || '');
    }

    @AllowAnonymous()
    @Post('/logView4DataSet')
    @ApiOperation({ summary: 'create a log when view the specified dataset' })
    @ApiOkResponse({ type: Log4ViewRequest })
    async logView4Dataset(@Req() req,
        @Body() param: Log4ViewRequest): Promise<Log4ViewResponse> {

        let accountId = '';
        let validateUser: AuthorizedUser = this.jwtService.decodeAuthUserFromHttpRequest(req);
        if (validateUser) {
            accountId = validateUser.id;
        }
        this.logger.debug(`logDataSet/View:accountId=${accountId},${JSON.stringify(param)}`);
        return await this.service.logView4Dataset(param, accountId || '');
    }
}