import { Account } from "../entity/platform-user/Account.entity";

export class RepositoryConsts {

  public static DATABASE_CONNECTION_PLATFORM: string =
    'DATABASE_CONNECTION_PLATFORM';

  public static DATABASE_CONNECTION_METABASE: string =
    'DATABASE_CONNECTION_METABASE';

  public static REPOSITORYS_PLATFORM = {
    PLATFORM_USER_REPOSITORY: {
      provide: 'PLATFORM_USER_REPOSITORY',
      connection: RepositoryConsts.DATABASE_CONNECTION_PLATFORM,
      entityTarget: Account
    }
  }
}

