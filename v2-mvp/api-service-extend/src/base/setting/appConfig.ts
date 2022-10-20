import { RedisModuleOptions } from 'nestjs-redis';
export class AppConfig {

  public static dbConnection = {
    type: process.env.DB_TYPE || 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    synchronize: true,
    logging: false,
  }

  public static typeOrmOption4PlatformDB = {
    ...this.dbConnection,
    database: process.env.DB_DATABASE,
  };
  public static typeOrmOption4MetabaseDB = {
    ...this.dbConnection,
    database: process.env.DB_DATABASE_METABASE,
  };

  public static redisOption: RedisModuleOptions = {
    port: Number(process.env.REDIS_PORT || 6379),
    host: process.env.REDIS_HOST || 'localhost',
    password: process.env.REDIS_PASSWORD || 'redis123',
    db: 0,
  };

  public static initilize() {
    console.log(AppConfig);
  }

}

