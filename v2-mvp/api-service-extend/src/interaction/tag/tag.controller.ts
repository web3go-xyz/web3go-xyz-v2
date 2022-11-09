import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { AuthorizedUser } from 'src/base/auth/AuthorizedUser';
import { AllowAnonymous } from 'src/base/auth/decorator/AllowAnonymous';
import { JwtAuthGuard } from 'src/base/auth/decorator/JwtAuthGuard';
import { JWTAuthService } from 'src/base/auth/jwt-auth.service';
import { ConfigTag } from 'src/base/entity/platform-config/ConfigTag';
import { W3Logger } from 'src/base/log/logger.service';
import { MarkTag4DashboardRequest } from './model/MarkTag4DashboardRequest';
import { MarkTag4DashboardResponse } from './model/MarkTag4DashboardResponse';
import { RemoveTag4DashboardRequest } from './model/RemoveTag4DashboardRequest';
import { RemoveTag4DashboardResponse } from './model/RemoveTag4DashboardResponse';
import { TagService } from './tag.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/v2/tag')
@ApiTags('/api/v2/tag')
export class TagController {
    logger: W3Logger;
    constructor(private readonly service: TagService) {
        this.logger = new W3Logger(`TagController`);
    }

    @AllowAnonymous()
    @Post('/listAllTags')
    @ApiOperation({ summary: 'list all tags' })
    @ApiOkResponse({ type: ConfigTag, isArray: true })
    async listAllTags(@Body() param: Object): Promise<ConfigTag[]> {
        return await this.service.listAllTags();
    }

    @Post('/markTags')
    @ApiOperation({ summary: 'mark tag for specified dashboard' })
    @ApiOkResponse({ type: MarkTag4DashboardResponse })
    async markTags(@Req() req, @Body() param: MarkTag4DashboardRequest): Promise<MarkTag4DashboardResponse> {

        this.logger.debug(`markTags:${JSON.stringify(param)}`);
        let validateUser: AuthorizedUser = req.user;
        let accountId = validateUser.id;

        return await this.service.markTags(param, accountId);
    }

    @Post('/removeTags')
    @ApiOperation({ summary: 'remove tag for specified dashboard' })
    @ApiOkResponse({ type: RemoveTag4DashboardResponse })
    async removeTags(@Req() req, @Body() param: RemoveTag4DashboardRequest): Promise<RemoveTag4DashboardResponse> {

        this.logger.debug(`removeTags:${JSON.stringify(param)}`);
        let validateUser: AuthorizedUser = req.user;
        let accountId = validateUser.id;

        return await this.service.removeTags(param, accountId);
    }

}