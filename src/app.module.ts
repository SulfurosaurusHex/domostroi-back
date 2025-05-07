import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ListsModule } from './lists/lists.module';
import { APP_GUARD } from '@nestjs/core';
import { SharedModule } from './shared/shared.module';
import { JwtRefreshGuard } from './handlers/useGuard';

import { JwtModule } from '@nestjs/jwt';
import { TokenModule } from './token/token.module';
import { CharacteristicsModule } from './characteristics/characteristics.module';
export const jwtSecret = 'someVerySecretShit';
@Module({
  imports: [
    TasksModule,
    UsersModule,
    PrismaModule,
    AuthModule,
    ListsModule,
    CharacteristicsModule,
    TokenModule,
    SharedModule,
    ScheduleModule.forRoot(),
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: '25m' },
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtRefreshGuard,
    },
  ],
})
export class AppModule {}
