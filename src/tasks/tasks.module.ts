import { Module } from '@nestjs/common';
import {
  TasksCreateService,
  TasksUpdateService,
  TasksReadService,
} from './services';
import { TasksController } from './tasks.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SharedModule } from 'src/shared/shared.module';
@Module({
  controllers: [TasksController],
  providers: [TasksCreateService, TasksUpdateService, TasksReadService],
  imports: [PrismaModule, SharedModule],
})
export class TasksModule {}
