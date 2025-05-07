import { Module } from '@nestjs/common';
import {
  UsersCreateService,
  UsersReadService,
  UsersUpdateService,
} from './services';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SharedModule } from 'src/shared/shared.module';
@Module({
  controllers: [UsersController],
  imports: [PrismaModule, SharedModule],
  providers: [UsersCreateService, UsersReadService, UsersUpdateService],
  exports: [UsersCreateService, UsersReadService, UsersUpdateService],
})
export class UsersModule {}
