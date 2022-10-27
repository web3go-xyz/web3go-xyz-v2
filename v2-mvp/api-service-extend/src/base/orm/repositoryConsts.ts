import { ReportDashboard } from "../entity/metabase/Report-Dashboard";
import { AccountEmail } from "../entity/platform-user/Account-Email.entity";
import { AccountSocial } from "../entity/platform-user/Account-Social.entity";
import { AccountVerifyCode } from "../entity/platform-user/Account-VerifyCode.entity";
import { AccountWallet } from "../entity/platform-user/Account-Wallet.entity";
import { Account } from "../entity/platform-user/Account.entity";

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
    }
  }


  public static REPOSITORYS_METABASE = {
    MB_REPORT_DASHBOARD_REPOSITORY: {
      provide: 'MB_REPORT_DASHBOARD_REPOSITORY',
      connection: RepositoryConsts.DATABASE_CONNECTION_METABASE,
      entityTarget: ReportDashboard
    },
  }
}

