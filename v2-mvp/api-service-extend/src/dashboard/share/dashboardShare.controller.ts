import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/base/auth/decorator/JwtAuthGuard';
import { W3Logger } from 'src/base/log/logger.service';
import { DashboardGetShareUrlRequest } from './model/DashboardGetShareUrlRequest';
import { KVService } from 'src/base/kv/kv.service';
import { randomUUID } from 'crypto';
import { DashboardService } from '../dashboard.service';

import { AppConfig } from 'src/base/setting/appConfig';
import { AllowAnonymous } from 'src/base/auth/decorator/AllowAnonymous';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/v2/dashboard/sns/share')
@ApiTags('/api/v2/dashboard/sns/share')
export class DashboardShareController {
  logger: W3Logger;
  constructor(
    private dashboardService: DashboardService,
    private kvService: KVService,
  ) {
    this.logger = new W3Logger(`DashboardShareController`);
  }

  @Post('getUrl')
  async getShareUrl(@Body() data: DashboardGetShareUrlRequest) {
    const supportedPlatform = ['twitter'];
    if (supportedPlatform.indexOf(data.platform) < 0) {
      return 'not supported';
    }

    const uuid = randomUUID();
    await this.kvService.set(
      `dashboard:share:${uuid}`,
      JSON.stringify(data),
      5 * 60 * 60,
    ); // persist for 5 hours
    return `${AppConfig.BASE_API_URL}/v2/dashboard/sns/share/gateway/${uuid}`;
  }

  @Get('gateway/:uuid')
  @ApiOperation({ summary: 'twitter share metadata' })
  @AllowAnonymous()
  async twitterShare(@Param('uuid') uuid): Promise<string> {
    const rawCache = await this.kvService.get(`dashboard:share:${uuid}`);
    if (!rawCache) {
      return 'sorry, the sharing link has been expired.';
    }

    const data = JSON.parse(rawCache) as DashboardGetShareUrlRequest;
    if (data.platform !== 'twitter') {
      return 'sorry, not supported platform';
    }
    const record = await this.dashboardService.findDashboardExtByPK(
      data.dashboardId,
    );
    if (record) {
      data.metaData.push({ key: 'twitter:image', value: record.previewImg });
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
    console.log(retHtml);

    return retHtml;
  }
}
