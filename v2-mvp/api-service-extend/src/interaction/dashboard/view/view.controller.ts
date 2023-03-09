import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';

import { AuthorizedUser } from 'src/base/auth/AuthorizedUser';
import { AllowAnonymous } from 'src/base/auth/decorator/AllowAnonymous';
import { JwtAuthGuard } from 'src/base/auth/decorator/JwtAuthGuard';
import { JWTAuthService } from 'src/base/auth/jwt-auth.service';
import { W3Logger } from 'src/base/log/logger.service';

import { Log4ViewDashboardRequest } from './model/Log4ViewDashboardRequest';
import { Log4ViewDashboardResponse } from './model/Log4ViewDashboardResponse';
import { Log4ViewDatasetRequest } from './model/Log4ViewDatasetRequest';
import { Log4ViewDatasetResponse } from './model/Log4ViewDatasetResponse';
import { ViewService } from './view.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/v2/view')
@ApiTags('/api/v2/view')
export class ViewController {
    logger: W3Logger;
    constructor(private readonly service: ViewService,
        private readonly jwtService: JWTAuthService) {
        this.logger = new W3Logger(`ViewController`);
    }



    @AllowAnonymous()
    @Post('/logView')
    @ApiOperation({ summary: 'create a log when view the specified dashboard' })
    @ApiOkResponse({ type: Log4ViewDashboardResponse })
    async logView(@Req() req,
        @Body() param: Log4ViewDashboardRequest): Promise<Log4ViewDashboardResponse> {

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
    @ApiOkResponse({ type: Log4ViewDatasetResponse })
    async logView4Dataset(@Req() req,
        @Body() param: Log4ViewDatasetRequest): Promise<Log4ViewDatasetResponse> {

        let accountId = '';
        let validateUser: AuthorizedUser = this.jwtService.decodeAuthUserFromHttpRequest(req);
        if (validateUser) {
            accountId = validateUser.id;
        }
        this.logger.debug(`logDataSet/View:accountId=${accountId},${JSON.stringify(param)}`);
        return await this.service.logView4Dataset(param, accountId || '');
    }

}