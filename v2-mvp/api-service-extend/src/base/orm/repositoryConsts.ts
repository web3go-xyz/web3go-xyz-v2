import { ReportDashboard } from '../entity/metabase/ReportDashboard';
import { AccountEmail } from '../entity/platform-user/AccountEmail.entity';
import { AccountSocial } from '../entity/platform-user/AccountSocial.entity';
import { AccountVerifyCode } from '../entity/platform-user/AccountVerifyCode.entity';
import { AccountWallet } from '../entity/platform-user/AccountWallet.entity';
import { Account } from '../entity/platform-user/Account.entity';
import { ConfigTag } from '../entity/platform-config/ConfigTag';
import { AccountFollower } from '../entity/platform-user/AccountFollower';
import { AdCourse } from '../entity/platform-ad/AdCourse';
import { DashboardExt } from '../entity/platform-dashboard/DashboardExt';
import { DashboardFavoriteLog } from '../entity/platform-dashboard/DashboardFavoriteLog';
import { DashboardForkLog } from '../entity/platform-dashboard/DashboardForkLog';
import { DashboardShareLog } from '../entity/platform-dashboard/DashboardShareLog';
import { DashboardViewLog } from '../entity/platform-dashboard/DashboardViewLog';
import { DashboardTag } from '../entity/platform-dashboard/DashboradTag';
import { ShareReferralCode } from '../entity/platform-dashboard/ShareReferralCode';
import { ReportCard } from '../entity/metabase/ReportCard';
import { ReportDashboardcard } from '../entity/metabase/ReportDashboardcard';
import { CoreUser } from '../entity/metabase/CoreUser';
import { DatasetExt } from '../entity/platform-dataset/DatasetExt';
import { DatasetFavoriteLog } from '../entity/platform-dataset/DatasetFavoriteLog';
import { DatasetViewLog } from '../entity/platform-dataset/DatasetViewLog';
import { DatasetShareLog } from '../entity/platform-dataset/DatasetShareLog';
import { DatasetForkLog } from '../entity/platform-dataset/DatasetForkLog';
import { DatasetTag } from '../entity/platform-dataset/DatasetdTag';
import { DatasetTagGroup } from '../entity/platform-dataset/DatasetTagGroup';
import { DashboardDatasetRelation } from '../entity/platform-dataset/DashboardDatasetRelation';

export class RepositoryConsts {
  public static DATABASE_CONNECTION_PLATFORM: string =
    'DATABASE_CONNECTION_PLATFORM';

  public static DATABASE_CONNECTION_METABASE: string =
    'DATABASE_CONNECTION_METABASE';

  public static REPOSITORYS_PLATFORM = {
    PLATFORM_ACCOUNT_REPOSITORY: {
      provide: 'PLATFORM_ACCOUNT_REPOSITORY',
      connection: RepositoryConsts.DATABASE_CONNECTION_PLATFORM,
      entityTarget: Account,
    },
    PLATFORM_ACCOUNT_EMAIL_REPOSITORY: {
      provide: 'PLATFORM_ACCOUNT_EMAIL_REPOSITORY',
      connection: RepositoryConsts.DATABASE_CONNECTION_PLATFORM,
      entityTarget: AccountEmail,
    },
    PLATFORM_ACCOUNT_WALLET_REPOSITORY: {
      provide: 'PLATFORM_ACCOUNT_WALLET_REPOSITORY',
      connection: RepositoryConsts.DATABASE_CONNECTION_PLATFORM,
      entityTarget: AccountWallet,
    },
    PLATFORM_ACCOUNT_SOCIAL_REPOSITORY: {
      provide: 'PLATFORM_ACCOUNT_SOCIAL_REPOSITORY',
      connection: RepositoryConsts.DATABASE_CONNECTION_PLATFORM,
      entityTarget: AccountSocial,
    },
    PLATFORM_ACCOUNT_VERIFYCODE_REPOSITORY: {
      provide: 'PLATFORM_ACCOUNT_VERIFYCODE_REPOSITORY',
      connection: RepositoryConsts.DATABASE_CONNECTION_PLATFORM,
      entityTarget: AccountVerifyCode,
    },

    PLATFORM_ACCOUNT_FOLLOWER_REPOSITORY: {
      provide: 'PLATFORM_ACCOUNT_FOLLOWER_REPOSITORY',
      connection: RepositoryConsts.DATABASE_CONNECTION_PLATFORM,
      entityTarget: AccountFollower,
    },

    PLATFORM_CONFIG_TAG_REPOSITORY: {
      provide: 'PLATFORM_CONFIG_TAG_REPOSITORY',
      connection: RepositoryConsts.DATABASE_CONNECTION_PLATFORM,
      entityTarget: ConfigTag,
    },

    PLATFORM_AD_COURSE_REPOSITORY: {
      provide: 'PLATFORM_AD_COURSE_REPOSITORY',
      connection: RepositoryConsts.DATABASE_CONNECTION_PLATFORM,
      entityTarget: AdCourse,
    },

    //dashboard
    PLATFORM_DASHBOARD_EXT_REPOSITORY: {
      provide: 'PLATFORM_DASHBOARD_EXT_REPOSITORY',
      connection: RepositoryConsts.DATABASE_CONNECTION_PLATFORM,
      entityTarget: DashboardExt,
    },
    PLATFORM_DASHBOARD_FAVORITE_LOG_REPOSITORY: {
      provide: 'PLATFORM_DASHBOARD_FAVORITE_LOG_REPOSITORY',
      connection: RepositoryConsts.DATABASE_CONNECTION_PLATFORM,
      entityTarget: DashboardFavoriteLog,
    },
    PLATFORM_DASHBOARD_FORK_LOG_REPOSITORY: {
      provide: 'PLATFORM_DASHBOARD_FORK_LOG_REPOSITORY',
      connection: RepositoryConsts.DATABASE_CONNECTION_PLATFORM,
      entityTarget: DashboardForkLog,
    },
    PLATFORM_DASHBOARD_SHARE_LOG_REPOSITORY: {
      provide: 'PLATFORM_DASHBOARD_SHARE_LOG_REPOSITORY',
      connection: RepositoryConsts.DATABASE_CONNECTION_PLATFORM,
      entityTarget: DashboardShareLog,
    },
    PLATFORM_DASHBOARD_VIEW_LOG_REPOSITORY: {
      provide: 'PLATFORM_DASHBOARD_VIEW_LOG_REPOSITORY',
      connection: RepositoryConsts.DATABASE_CONNECTION_PLATFORM,
      entityTarget: DashboardViewLog,
    },
    PLATFORM_DASHBOARD_TAG_REPOSITORY: {
      provide: 'PLATFORM_DASHBOARD_TAG_REPOSITORY',
      connection: RepositoryConsts.DATABASE_CONNECTION_PLATFORM,
      entityTarget: DashboardTag,
    },

    PLATFORM_DATASET_EXT_REPOSITORY: {
      provide: 'PLATFORM_DATASET_EXT_REPOSITORY',
      connection: RepositoryConsts.DATABASE_CONNECTION_PLATFORM,
      entityTarget: DatasetExt,
    },

    PLATFORM_DATASET_FAVORITE_LOG_REPOSITORY: {
      provide: 'PLATFORM_DATASET_FAVORITE_LOG_REPOSITORY',
      connection: RepositoryConsts.DATABASE_CONNECTION_PLATFORM,
      entityTarget: DatasetFavoriteLog,
    },
    PLATFORM_DATASET_FORK_LOG_REPOSITORY: {
      provide: 'PLATFORM_DATASET_FORK_LOG_REPOSITORY',
      connection: RepositoryConsts.DATABASE_CONNECTION_PLATFORM,
      entityTarget: DatasetForkLog,
    },
    PLATFORM_DATASET_SHARE_LOG_REPOSITORY: {
      provide: 'PLATFORM_DATASET_SHARE_LOG_REPOSITORY',
      connection: RepositoryConsts.DATABASE_CONNECTION_PLATFORM,
      entityTarget: DatasetShareLog,
    },
    PLATFORM_DATASET_VIEW_LOG_REPOSITORY: {
      provide: 'PLATFORM_DATASET_VIEW_LOG_REPOSITORY',
      connection: RepositoryConsts.DATABASE_CONNECTION_PLATFORM,
      entityTarget: DatasetViewLog,
    },

    PLATFORM_DATASET_TAG_REPOSITORY: {
      provide: 'PLATFORM_DATASET_TAG_REPOSITORY',
      connection: RepositoryConsts.DATABASE_CONNECTION_PLATFORM,
      entityTarget: DatasetTag,
    },

    PLATFORM_DATASET_TAG_GROUP_REPOSITORY: {
      provide: 'PLATFORM_DATASET_TAG_GROUP_REPOSITORY',
      connection: RepositoryConsts.DATABASE_CONNECTION_PLATFORM,
      entityTarget: DatasetTagGroup,
    },

    PLATFORM_DASHBOARD_DATASET_RELATION_REPOSITORY: {
      provide: 'DASHBOARD_DATASET_RELATION_REPOSITORY',
      connection: RepositoryConsts.DATABASE_CONNECTION_PLATFORM,
      entityTarget: DashboardDatasetRelation,
    },

    //share
    PLATFORM_SHARE_REFERRAL_CODE_REPOSITORY: {
      provide: 'PLATFORM_SHARE_REFERRAL_CODE_REPOSITORY',
      connection: RepositoryConsts.DATABASE_CONNECTION_PLATFORM,
      entityTarget: ShareReferralCode,
    },
  };

  public static REPOSITORYS_METABASE = {
    MB_REPORT_DASHBOARD_REPOSITORY: {
      provide: 'MB_REPORT_DASHBOARD_REPOSITORY',
      connection: RepositoryConsts.DATABASE_CONNECTION_METABASE,
      entityTarget: ReportDashboard,
    },
    MB_REPORT_CARD_REPOSITORY: {
      provide: 'MB_REPORT_CARD_REPOSITORY',
      connection: RepositoryConsts.DATABASE_CONNECTION_METABASE,
      entityTarget: ReportCard,
    },
    MB_REPORT_DASHBOARD_CARD_REPOSITORY: {
      provide: 'MB_REPORT_DASHBOARD_CARD_REPOSITORY',
      connection: RepositoryConsts.DATABASE_CONNECTION_METABASE,
      entityTarget: ReportDashboardcard,
    },
    MB_CORE_USER_REPOSITORY: {
      provide: 'MB_CORE_USER_REPOSITORY',
      connection: RepositoryConsts.DATABASE_CONNECTION_METABASE,
      entityTarget: CoreUser,
    },
  };
}
