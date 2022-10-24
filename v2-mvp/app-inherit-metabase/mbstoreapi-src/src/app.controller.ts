import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


  @Get("api/:tokenId/v2/status")
  status(@Param() tokenId): any {
    console.log(`request status:`, tokenId);

    return {
      valid: true,
      status: 'active',
      features: ["embedding",
        "whitelabel",
        "audit-app",
        "sandboxes",
        "sso",
        "advanced-config",
        "advanced-permissions",
        "content-management",
        "hosting"],
      trial: false,
      valid_thru: '2099-01-01',
      tokenId: tokenId
    }
  }
  // /api/[token-id]/v2/status

  // (def ^:private TokenStatus
  //   {:valid                          s/Bool
  //    :status                         su/NonBlankString
  //    (s/optional-key :error-details) (s/maybe su/NonBlankString)
  //    (s/optional-key :features)      [su/NonBlankString]
  //    (s/optional-key :trial)         s/Bool
  //    (s/optional-key :valid_thru)    su/NonBlankString ; ISO 8601 timestamp
  //    ;; don't explode in the future if we add more to the response! lol
  //    s/Any                           s/Any})
}
