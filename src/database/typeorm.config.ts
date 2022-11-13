import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  migrationsTableName: 'custom_migration_table',
  migrations: ['src/migrations/*{.ts,.js}'],
  logging: false,
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
};

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [],
  inject: [],
  useFactory: async () => {
    return {
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      migrations: ['dist/migrations/*{.ts,.js}'],
      cli: {
        entitiesDir: __dirname + '/../**/*.entity.{js,ts}',
        migrationsDir: 'scr/database/migrations',
      },
      logging: false,
      extra: {
        charset: 'utf8mb4_unicode_ci',
      },
    };
  },
};
