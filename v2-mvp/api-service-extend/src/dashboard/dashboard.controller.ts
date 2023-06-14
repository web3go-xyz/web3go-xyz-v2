import { Body, Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors, Request } from '@nestjs/common';
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
import { ReportCard } from 'src/base/entity/metabase/ReportCard';
import { randomUUID } from 'crypto';
import { JWTAuthService } from 'src/base/auth/jwt-auth.service';
import { QueryDashboardByDataset } from './model/QueryDashboardByDataset';



@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/v2/dashboard')
@ApiTags('/api/v2/dashboard')
export class DashboardController {
  logger: W3Logger;
  constructor(
    private readonly service: DashboardService,
    private readonly jwtService: JWTAuthService) {
    this.logger = new W3Logger(`DashboardController`);
  }

  private getUserSession(/*@Request() */rawRequest) {
    try {
      return this.jwtService.decodeAuthUserFromHttpRequest(rawRequest);
    } catch (e) {
      // mute invalid sessions, jus treated as unlogged users.
    }
    return null;
  }

  @AllowAnonymous()
  @Post('/list')
  @ApiOperation({ summary: 'list dashboard' })
  @ApiOkResponse({ type: QueryDashboardListResponse })
  async list(@Body() param: QueryDashboardListRequest, @Request() rawRequest): Promise<QueryDashboardListResponse> {

    this.logger.debug(`list:${JSON.stringify(param)}`);
    return await this.service.list(param, this.getUserSession(rawRequest));
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
  async searchRelatedDashboards(@Body() param: QueryRelatedDashboardsRequest, @Request() rawRequest): Promise<QueryDashboardListResponse> {

    this.logger.debug(`searchRelatedDashboards:${JSON.stringify(param)}`);
    return await this.service.searchRelatedDashboards(param, this.getUserSession(rawRequest));
  }

  @Post('/searchByDataset')
  @ApiOperation({ summary: 'search related dashboards by the specified datasetId' })
  @ApiOkResponse({ type: QueryDashboardListResponse })
  async searchByDataset(@Body() param: QueryDashboardByDataset, @Request() rawRequest): Promise<QueryDashboardListResponse> {
    this.logger.debug(`searchRelatedDashboards:${JSON.stringify(param)}`);
    return await this.service.searchByDataset(param, this.getUserSession(rawRequest));
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

    let dir = join(AppConfig.IMG_UPLOAD_DIR || __dirname, '/imgUpload/preview');
    // console.log(dir);

    if (existsSync(dir) == false) {
      mkdirSync(dir, { recursive: true });
    }

    let path = 'dashboard-' + id + '-' + (new Date()).getTime() + "." + file.mimetype.split('/')[1];

    const writeImage = createWriteStream(join(dir, `${path}`))
    writeImage.write(file.buffer);

    const previewImgUrl = `${AppConfig.BASE_WEB_URL}/imgUpload/preview/${path}`
    this.service.updateDashboardPreviewImgUrl(id, previewImgUrl);
    return previewImgUrl;
  }

  @Post('/uploadPublicImg')
  @ApiOperation({ summary: 'upload background img and return the path' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
  })
  uploadPublicImg(@UploadedFile() file, @Body() body) {

    let dir = join(AppConfig.IMG_UPLOAD_DIR || __dirname, '/imgUpload/public');
    if (existsSync(dir) == false) {
      mkdirSync(dir, { recursive: true });
    }

    const uuid = randomUUID();
    let path = uuid + "." + file.mimetype.split('/')[1]
    const writeImage = createWriteStream(join(dir, `${path}`))
    writeImage.write(file.buffer);

    const publicImgUrl = `${AppConfig.BASE_WEB_URL}/imgUpload/public/${path}`
    return publicImgUrl;
  }

  @Get('/getDataSets')
  @ApiOperation({ summary: 'get all datasets' })
  @ApiOkResponse({ type: ReportCard, isArray: true })
  async getDataSets(): Promise<ReportCard[]> {
    return await this.service.getDataSets();
  }
}