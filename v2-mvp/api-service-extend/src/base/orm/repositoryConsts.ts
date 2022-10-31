import { ReportDashboard } from "../entity/metabase/ReportDashboard";
import { AccountEmail } from "../entity/platform-user/AccountEmail.entity";
import { AccountSocial } from "../entity/platform-user/AccountSocial.entity";
import { AccountVerifyCode } from "../entity/platform-user/AccountVerifyCode.entity";
import { AccountWallet } from "../entity/platform-user/AccountWallet.entity";
import { Account } from "../entity/platform-user/Account.entity";
import { ConfigTag } from "../entity/platform-config/ConfigTag";

export class RepositoryConsts {

  public static DATABASE_CONNECTION_PLATFORM: string =
    'DATABASE_CONNECTION_PLATFORM';

  public static DATABASE_CONNECTION_METABASE: string =
    'DATABASE_CONNECTION_METABASE';

  public static REPOSITORYS_PLATFORM = {
    PLATFORM_ACCOUNT_REPOSITORY: {
      provide: 'PLATFORM_ACCOUNT_REPOSITORY',
      connection: RepositoryConsts.DATABASE_CONNECTION_PLATFORM,
      entityTarget: Account
    },
    PLATFORM_ACCOUNT_EMAIL_REPOSITORY: {
      provide: 'PLATFORM_ACCOUNT_EMAIL_REPOSITORY',
      connection: RepositoryConsts.DATABASE_CONNECTION_PLATFORM,
      entityTarget: AccountEmail
    },
    PLATFORM_ACCOUNT_WALLET_REPOSITORY: {
      provide: 'PLATFORM_ACCOUNT_WALLET_REPOSITORY',
      connection: RepositoryConsts.DATABASE_CONNECTION_PLATFORM,
      entityTarget: AccountWallet
    },
    PLATFORM_ACCOUNT_SOCIAL_REPOSITORY: {
      provide: 'PLATFORM_ACCOUNT_SOCIAL_REPOSITORY',
      connection: RepositoryConsts.DATABASE_CONNECTION_PLATFORM,
      entityTarget: AccountSocial
    },
    PLATFORM_ACCOUNT_VERIFYCODE_REPOSITORY: {
      provide: 'PLATFORM_ACCOUNT_VERIFYCODE_REPOSITORY',
      connection: RepositoryConsts.DATABASE_CONNECTION_PLATFORM,
      entityTarget: AccountVerifyCode
    },

    PLATFORM_CONFIG_TAG_REPOSITORY: {
      provide: 'PLATFORM_CONFIG_TAG_REPOSITORY',
      connection: RepositoryConsts.DATABASE_CONNECTION_PLATFORM,
      entityTarget: ConfigTag
    },
  }


  public static REPOSITORYS_METABASE = {
    MB_REPORT_DASHBOARD_REPOSITORY: {
      provide: 'MB_REPORT_DASHBOARD_REPOSITORY',
      connection: RepositoryConsts.DATABASE_CONNECTION_METABASE,
      entityTarget: ReportDashboard
    }
  }
}

