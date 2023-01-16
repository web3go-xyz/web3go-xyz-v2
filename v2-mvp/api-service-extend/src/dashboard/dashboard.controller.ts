import { Body, Controller, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

import { AllowAnonymous } from 'src/base/auth/decorator/AllowAnonymous';
import { JwtAuthGuard } from 'src/base/auth/decorator/JwtAuthGuard';
import { W3Logger } from 'src/base/log/logger.service';
import { QueryDashboardDetailRequest } from 'src/dashboard/model/QueryDashboardDetailRequest';
import { QueryDashboardDetailResponse } from 'src/dashboard/model/QueryDashboardDetailResponse';
import { QueryDashboardListRequest } from 'src/dashboard/model/QueryDashboardListRequest';
import { QueryDashboardListResponse } from 'src/dashboard/model/QueryDashboardListResponse';
import { FileUploadDto } from 'src/viewModel/base/FileUploadDto';
import { DashboardService } from './dashboard.service';
import { QueryRelatedDashboardsRequest } from './model/QueryRelatedDashboardsRequest';


import { AppConfig } from 'src/base/setting/appConfig';



@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/v2/dashboard')
@ApiTags('/api/v2/dashboard')
export class DashboardController {
    logger: W3Logger;
    constructor(private readonly service: DashboardService) {
        this.logger = new W3Logger(`DashboardController`);
    }

    @AllowAnonymous()
    @Post('/list')
    @ApiOperation({ summary: 'list dashboard' })
    @ApiOkResponse({ type: QueryDashboardListResponse })
    async list(@Body() param: QueryDashboardListRequest): Promise<QueryDashboardListResponse> {

        this.logger.debug(`list:${JSON.stringify(param)}`);
        return await this.service.list(param);
    }

    @AllowAnonymous()
    @Post('/detail')
    @ApiOperation({ summary: 'get detail info of the specified dashboard' })
    @ApiOkResponse({ type: QueryDashboardDetailResponse })
    async detail(@Body() param: QueryDashboardDetailRequest): Promise<QueryDashboardDetailResponse> {

        this.logger.debug(`detail:${JSON.stringify(param)}`);
        return await this.service.detail(param);
    }


    @AllowAnonymous()
    @Post('/refresh')
    @ApiOperation({ summary: 'refresh the specified dashboards' })
    @ApiOkResponse({ type: Object })
    async refresh(@Body() param: QueryDashboardDetailRequest): Promise<any> {

        this.logger.debug(`refresh:${JSON.stringify(param)}`);
        return await this.service.refresh(param);
    }

    @AllowAnonymous()
    @Post('/searchRelatedDashboards')
    @ApiOperation({ summary: 'search related dashboards which has similar tags' })
    @ApiOkResponse({ type: QueryDashboardListResponse })
    async searchRelatedDashboards(@Body() param: QueryRelatedDashboardsRequest): Promise<QueryDashboardListResponse> {

        this.logger.debug(`searchRelatedDashboards:${JSON.stringify(param)}`);
        return await this.service.searchRelatedDashboards(param);
    }


  @Post('/update/preview-url/:id')
  @ApiOperation({ summary: 'upload img and return the path' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
  })
  updateMeta(@Param('id') id: number, @UploadedFile() file, @Body() body) {
    // console.log(body);
    // console.log(file);

    let dir = join(__dirname, '/imgUpload/preview');
    // console.log(dir);

    if (existsSync(dir) == false) {
      mkdirSync(dir, {recursive: true});
    }

    let path = 'dashboard-' + id + file.originalname.substr(file.originalname.indexOf('.'));

    const writeImage = createWriteStream(join(dir, `${path}`))
    writeImage.write(file.buffer);
    console.log("imgUpload path:", path);


    const previewImgUrl = `${AppConfig.BASE_WEB_URL}/imgUpload/preview/${path}`
    this.service.updateDashboardPreviewImgUrl(id, previewImgUrl);
    return previewImgUrl;
  }

}