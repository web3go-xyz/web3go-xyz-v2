import { createConnection } from 'typeorm';
import { join } from 'path';
import { AppConfig } from '../../setting/appConfig';
import { RepositoryConsts } from '../repositoryConsts';

export const databaseProviders_metabase = [
  {
    provide: RepositoryConsts.DATABASE_CONNECTION_METABASE,
    useFactory: async () => {
      let connectionOption: any = {
        ...AppConfig.typeOrmOption4MetabaseDB,
        entities: [
          join(
            __dirname,
            '../..',
            'entity',
            'metabase',
            '*.{js,ts}',
          ),
        ],
      };
      return await createConnection(connectionOption);
    },
  },
];
