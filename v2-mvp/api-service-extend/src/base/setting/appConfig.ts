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

  public static initilize() {
    console.log(AppConfig);
  }

}

