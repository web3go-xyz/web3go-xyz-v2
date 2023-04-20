import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/base/auth/decorator/JwtAuthGuard';
import { W3Logger } from 'src/base/log/logger.service';
import { DatasetGetShareUrlRequest } from './model/DatasetGetShareUrlRequest';
import { KVService } from 'src/base/kv/kv.service';
import { randomUUID } from 'crypto';
import { DatasetService } from '../../../dataset/dataset.service';

import { AppConfig } from 'src/base/setting/appConfig';
import { AllowAnonymous } from 'src/base/auth/decorator/AllowAnonymous';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/v2/dataset/sns/share')
@ApiTags('/api/v2/dataset/')
export class DatasetShareController {
  // logger: W3Logger;
  constructor(
    private datasetService: DatasetService,
    private kvService: KVService,
  ) {
    // this.logger = new W3Logger(`DatasetShareController`);
  }

  @Post('getUrl')
  async getShareUrl(@Body() data: DatasetGetShareUrlRequest) {
    const supportedPlatform = ['twitter'];
    this.assert(supportedPlatform.indexOf(data.platform) > -1, 'not supported');
    this.assert(data && data.metaData.filter(it => it.key==='twitter:url')[0], 'missing required data')

    const uuid = `${data.datasetId}-${randomUUID()}`;
    await this.kvService.set(
      `dataset:share:${uuid}`,
      JSON.stringify(data),
      5 * 60 * 60,
    ); // persist for 5 hours
    return `${AppConfig.BASE_API_URL}/api/v2/dataset/sns/share/gateway/${uuid}`;
  }
  private assert(condition, msg) {
    if (!condition) {
      throw new BadRequestException(msg);
    }
  }

  @Get('gateway/:uuid')
  @ApiOperation({ summary: 'twitter share metadata' })
  @AllowAnonymous()
  async twitterShare(@Param('uuid') uuid: string): Promise<string> {
  
    let data = null;//
    let rawCache = await this.kvService.get(`dataset:share:${uuid}`);
    const isCacheValid = !!rawCache;
    if (isCacheValid) {
      // this.assert(!!rawCache, 'sorry, the sharing link has been expired.');
      data = JSON.parse(rawCache); // as DashboardGetShareUrlRequest;

      // old data =  {metaData: [], platform: undefined, datasetId: undefined};
      if (data && data.metaData) {  // to compatible with legacy codes
        data = data.metaData; // will lose the preview img but it's fine
      }

    } else {
      const datasetId = parseInt(uuid.substring(0, uuid.indexOf('-')));
      this.assert(!!datasetId, 'sorry, the sharing link has been expired.');
      
      const record = await this.datasetService.findDatasetExtByPK(
        datasetId,
      );

      if (!record || !record.publicLink) {
        throw new BadRequestException('the dataset is unavailable or is not ready')
      }

      data = {
        'twitter:card' : 'summary_large_image',
        'twitter:site': AppConfig.BASE_WEB_URL,
        'twitter:url': record.publicLink,
        'twitter:title': record.name,
        'twitter:image': record.previewImg,
        'og:url': record.publicLink,
        'og:title': record.name,
        'og:image': record.previewImg,
        'og:type' : 'website'
      }
    }

    let metas = data;
    let metaHtml = '';
    let url = '';
    let title = '';
    Object.keys(metas).forEach(key => {
      if (metas[key]) {
        metaHtml += `<meta property="${key}" name="${key}" content="${metas[key]}"/>\n`;
      }
      if (!url && key.endsWith(':url')) {
        url = metas[key];
      }
      if (!title && key.endsWith(':title')) {
        title = metas[key];
      }

    });
    var retHtml =
      '<!DOCTYPE html>\n' +
      '<html lang="en">\n' +
      '<head>\n' +
      '<title>' + title + '</title>' +
      metaHtml +
      '</head>\n' +
      '<body>\n' +
      '<script type="text/javascript">\n' +  // Telegram, use elegram to match is for ignoring case
      'navigator && navigator.userAgent && (navigator.userAgent.indexOf("elegram") < 0) && (window.location.href="' + url + '");\n' +
      '</script>' +
      '</body>\n' +
      '</html>';

    return retHtml;
  }
}
