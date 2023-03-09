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
    // TODO WE CAN infer the platform by HTTP HEADER REFFER
    // this.assert(data.platform === 'twitter', 'sorry, not supported platform'); 
    let data = {metaData: [], platform: undefined, datasetId: undefined};
    let rawCache = await this.kvService.get(`dataset:share:${uuid}`);
    const isCacheValid = !!rawCache;
    if (isCacheValid) {
      // this.assert(!!rawCache, 'sorry, the sharing link has been expired.');
      data = JSON.parse(rawCache) as DatasetGetShareUrlRequest;
    } else {
      data.datasetId = parseInt(uuid.substring(0, uuid.indexOf('-')));
      this.assert(!!data.datasetId, 'sorry, the sharing link has been expired.');
    }

    const record = await this.datasetService.findDatasetExtByPK(
      data.datasetId,
    );
    if (record) {
      if (record.previewImg) data.metaData.push({ key: 'twitter:image', value: record.previewImg });
      if (!isCacheValid) {
        data.metaData.push({key:'twitter:url', value: `${AppConfig.BASE_WEB_URL}/layout/datasetDetail/${record.publicUUID}`});
      }
    }

    let metas = data.metaData;
    let metaHtml = '';
    let url = '';
    metas.forEach((meta) => {
      metaHtml += `<meta property="${meta.key}" name="${meta.key}" content="${meta.value}"/>\n`;
      if (meta.key === 'twitter:url') {
        url = meta.value;
      }
    });
    var retHtml =
      '<!DOCTYPE html>\n' +
      '<html lang="en">\n' +
      '<head>\n' +
      metaHtml +
      '</head>\n' +
      '<body>\n' +
      '<script type="text/javascript">\n' +
      '\twindow.location.href="' +
      url +
      '";\n' +
      '</script>' +
      '</body>\n' +
      '</html>';

    return retHtml;
  }
}
