import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

import { AllowAnonymous } from 'src/base/auth/decorator/AllowAnonymous';
import { JwtAuthGuard } from 'src/base/auth/decorator/JwtAuthGuard';
import { W3Logger } from 'src/base/log/logger.service';
import { FileUploadDto } from 'src/viewModel/base/FileUploadDto';
import { DatasetService } from './dataset.service';

import { AppConfig } from 'src/base/setting/appConfig';
import { randomUUID } from 'crypto';
import { JWTAuthService } from 'src/base/auth/jwt-auth.service';
import { DatasetListResponse } from './model/DatasetListResponse';
import { DatasetListRequest } from './model/DatasetListRequest';
import { DatasetDetailVO } from './model/DatasetDetailVO';
import { DatasetDetailRequest } from './model/DatasetDetailRequest';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/v2/dataset')
@ApiTags('/api/v2/dataset')
export class DatasetController {
  logger: W3Logger;
  constructor(
    private readonly service: DatasetService,
    private readonly jwtService: JWTAuthService,
  ) {
    this.logger = new W3Logger(`DatasetController`);
  }

  private getUserSession(/*@Request() */ rawRequest) {
    try {
      return this.jwtService.decodeAuthUserFromHttpRequest(rawRequest);
    } catch (e) {
      // mute invalid sessions, just treated it as unlogged users.
    }
    return null;
  }

  @AllowAnonymous()
  @Post('/list')
  @ApiOperation({ summary: 'list dataset' })
  @ApiOkResponse({ type: DatasetListResponse })
  async list(
    @Body() param: DatasetListRequest,
    @Request() rawRequest,
  ): Promise<DatasetListResponse> {
    this.logger.debug(`list:${JSON.stringify(param)}`);
    return await this.service.list(param, this.getUserSession(rawRequest));
  }

  @AllowAnonymous()
  @Post('/detail')
  @ApiOperation({ summary: 'get detail info of the specified dataset' })
  // @ApiOkResponse({ type: { list: Array<DatasetDetailVO> } })
  detail(
    @Body() param: DatasetDetailRequest,
  ): Promise<{ list: Array<DatasetDetailVO> }> {
    this.logger.debug(`detail:${JSON.stringify(param)}`);
    return this.service.detail(param);
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

    let path =
      'dataset-' +
      id +
      file.originalname.substr(file.originalname.indexOf('.'));

    const writeImage = createWriteStream(join(dir, `${path}`));
    writeImage.write(file.buffer);

    const previewImgUrl = `${AppConfig.BASE_WEB_URL}/imgUpload/preview/${path}`;
    this.service.updateDatasetPreviewImgUrl(id, previewImgUrl);
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
    let path = uuid + '.' + file.mimetype.split('/')[1];
    const writeImage = createWriteStream(join(dir, `${path}`));
    writeImage.write(file.buffer);

    const publicImgUrl = `${AppConfig.BASE_WEB_URL}/imgUpload/public/${path}`;
    return publicImgUrl;
  }
}
