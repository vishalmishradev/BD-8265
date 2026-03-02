import { Module } from '@nestjs/common';
import { CrudModule } from './crud/crud.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthUser, User } from './entities';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CrudModule,
    AuthModule,
    ChatModule,
    DatabaseModule.forRoot({
      dbName: 'user_management_demo',
      entities: [AuthUser, User],
    }),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'postgres',
    //     host: configService.get('DB_HOST'),
    //     port: configService.get('DB_PORT'),
    //     username: configService.get('DB_USER'),
    //     password: configService.get('DB_PASSWORD'),
    //     database: configService.get('DB_NAME'),
    //     entities: [AuthUser, User],
    //     synchronize: true,
    //   }),
    // }),
  ],
})
export class AppModule {}
