import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { AuthorizedUser } from 'src/base/auth/AuthorizedUser';
import { AllowAnonymous } from 'src/base/auth/decorator/AllowAnonymous';
import { JwtAuthGuard } from 'src/base/auth/decorator/JwtAuthGuard';
import { DatasetTagGroup } from 'src/base/entity/platform-dataset/DatasetTagGroup';
import { W3Logger } from 'src/base/log/logger.service';
import { AddTag4DatasetRequest } from './model/AddTag4DatasetRequest';
import { AddTag4DatasetResponse } from './model/AddTag4DatasetResponse';
import { MarkTag4DatasetRequest } from './model/MarkTag4DatasetRequest';
import { MarkTag4DatasetResponse } from './model/MarkTag4DatasetResponse';
import { RemoveTag4DatasetRequest } from './model/RemoveTag4DatasetRequest';
import { RemoveTag4DatasetResponse } from './model/RemoveTag4DatasetResponse';
import { TagService } from './tag.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/v2/dataset/tag')
@ApiTags('/api/v2/dataset/')
export class TagController {
    logger: W3Logger;
    constructor(private readonly service: TagService) {
        this.logger = new W3Logger(`TagController`);
    }

    @AllowAnonymous()
    @Post('/listAllTags')
    @ApiOperation({ summary: 'list all tags' })
    @ApiOkResponse({ type: DatasetTagGroup, isArray: true })
    async listAllTags(@Body() param: Object): Promise<DatasetTagGroup[]> {
        return await this.service.listAllTags();
    }

    @Post('/markTags')
    @ApiOperation({ summary: 'mark tag for specified dashboard' })
    @ApiOkResponse({ type: MarkTag4DatasetResponse })
    async markTags(@Req() req, @Body() param: MarkTag4DatasetRequest): Promise<MarkTag4DatasetResponse> {

        this.logger.debug(`markTags:${JSON.stringify(param)}`);
        let validateUser: AuthorizedUser = req.user;
        let accountId = validateUser.id;

        return await this.service.markTags(param, accountId);
    }

    @Post('/removeTags')
    @ApiOperation({ summary: 'remove tag for specified dashboard' })
    @ApiOkResponse({ type: RemoveTag4DatasetResponse })
    async removeTags(@Req() req, @Body() param: RemoveTag4DatasetRequest): Promise<RemoveTag4DatasetResponse> {

        this.logger.debug(`removeTags:${JSON.stringify(param)}`);
        let validateUser: AuthorizedUser = req.user;
        let accountId = validateUser.id;

        return await this.service.removeTags(param, accountId);
    }

    @Get('/listDatasetTags/:id')
    @ApiOperation({ summary: 'list tags for specified dashboard' })
    async listDatasetTags(@Param('id') id: number){
        return await this.service.listDatasetTags(id);
    }

    @Post('/AddTag')
    @ApiOperation({ summary: 'add tag for specified dashboard' })
    @ApiOkResponse({ type: AddTag4DatasetResponse })
    async addTags(@Req() req, @Body() param: AddTag4DatasetRequest): Promise<AddTag4DatasetResponse> {

        this.logger.debug(`addTag:${JSON.stringify(param)}`);
        let validateUser: AuthorizedUser = req.user;
        let accountId = validateUser.id;
        return await this.service.addTag(param, accountId);
    }
}