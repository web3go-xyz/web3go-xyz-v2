import { RedisModuleOptions } from 'nestjs-redis';
export class AppConfig {

  public static dbConnection = {
    type: process.env.DB_TYPE || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'Dev123!@#',
    synchronize: true,
    logging: false,
  }

  public static typeOrmOption4PlatformDB = {
    ...this.dbConnection,
    database: process.env.DB_DATABASE || 'dev-web3go-v2-extend',
  };
  public static typeOrmOption4MetabaseDB = {
    ...this.dbConnection,
    database: process.env.DB_DATABASE_METABASE || 'dev-web3go-v2-metabase',
  };

  public static PORT = process.env.PORT || 12350;
  public static BASE_API_URL = process.env.BASE_API_URL || "http://localhost:12350";
  public static BASE_WEB_URL = process.env.BASE_WEB_URL || "http://localhost:3000";

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

