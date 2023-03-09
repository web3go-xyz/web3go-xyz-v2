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
import { DashboardGetShareUrlRequest } from './model/DashboardGetShareUrlRequest';
import { KVService } from 'src/base/kv/kv.service';
import { randomUUID } from 'crypto';
import { DashboardService } from '../../../dashboard/dashboard.service';

import { AppConfig } from 'src/base/setting/appConfig';
import { AllowAnonymous } from 'src/base/auth/decorator/AllowAnonymous';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/v2/dashboard/sns/share')
@ApiTags('/api/v2/dashboard/sns/share')
export class DashboardShareController {
  // logger: W3Logger;
  constructor(
    private dashboardService: DashboardService,
    private kvService: KVService,
  ) {
    // this.logger = new W3Logger(`DashboardShareController`);
  }

  @Post('getUrl')
  async getShareUrl(@Body() data: DashboardGetShareUrlRequest) {
    const supportedPlatform = ['twitter'];
    this.assert(supportedPlatform.indexOf(data.platform) > -1, 'not supported');
    this.assert(data && data.metaData.filter(it => it.key==='twitter:url')[0], 'missing required data')

    const uuid = `${data.dashboardId}-${randomUUID()}`;
    await this.kvService.set(
      `dashboard:share:${uuid}`,
      JSON.stringify(data),
      5 * 60 * 60,
    ); // persist for 5 hours
    return `${AppConfig.BASE_API_URL}/api/v2/dashboard/sns/share/gateway/${uuid}`;
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
    let data = {metaData: [], platform: undefined, dashboardId: undefined};
    let rawCache = await this.kvService.get(`dashboard:share:${uuid}`);
    const isCacheValid = !!rawCache;
    if (isCacheValid) {
      // this.assert(!!rawCache, 'sorry, the sharing link has been expired.');
      data = JSON.parse(rawCache) as DashboardGetShareUrlRequest;
    } else {
      data.dashboardId = parseInt(uuid.substring(0, uuid.indexOf('-')));
      this.assert(!!data.dashboardId, 'sorry, the sharing link has been expired.');
    }

    const record = await this.dashboardService.findDashboardExtByPK(
      data.dashboardId,
    );
    if (record) {
      if (record.previewImg) data.metaData.push({ key: 'twitter:image', value: record.previewImg });
      if (!isCacheValid) {
        data.metaData.push({key:'twitter:url', value: `${AppConfig.BASE_WEB_URL}/layout/dashboardDetail/${record.publicUUID}`});
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
