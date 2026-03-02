import { Module } from '@nestjs/common';
import { CrudModule } from './crud/crud.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthUser, User } from './entities';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CrudModule,
    AuthModule,
    DatabaseModule.forRoot({
      dbName: 'user_management_demo',
      entities: [AuthUser, User],
    }),
  ],
})
export class AppModule {}
