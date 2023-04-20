import { createConnection } from 'typeorm';
import { join } from 'path';
import { AppConfig } from '../../setting/appConfig';
import { RepositoryConsts } from '../repositoryConsts';

export const databaseProviders_platform = [
  {
    provide: RepositoryConsts.DATABASE_CONNECTION_PLATFORM,
    useFactory: async () => {
      let connectionOption: any = {
        ...AppConfig.typeOrmOption4PlatformDB,
        entities: [
          join(
            __dirname,
            '../..',
            'entity',
            'platform-user',
            '*.{js,ts}',
          ),
          join(
            __dirname,
            '../..',
            'entity',
            'platform-dashboard',
            '*.{js,ts}',
          ),
          join(
            __dirname,
            '../..',
            'entity',
            'platform-dataset',
            '*.{js,ts}',
          ),
          join(
            __dirname,
            '../..',
            'entity',
            'platform-ad',
            '*.{js,ts}',
          ),
          ,
          join(
            __dirname,
            '../..',
            'entity',
            'platform-config',
            '*.{js,ts}',
          ),
        ],
      };
      return await createConnection(connectionOption);
    },
  },
];
