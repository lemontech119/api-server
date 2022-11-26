import { Module } from '@nestjs/common';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { typeOrmAsyncConfig } from 'src/database/typeorm.config';
import { AuthModule } from 'src/auth/auth.module';
import { PlaceModule } from './place/place.module';
import { PlaceReviewModule } from './place_review/place_review.module';
import { WantPlaceModule } from './want_place/want_place.module';
import { PlaceMoodModule } from './place_mood/place_mood.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'prod' ? '.env' : '.env.dev',
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    AuthModule,
    PlaceModule,
    PlaceReviewModule,
    WantPlaceModule,
    PlaceMoodModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
