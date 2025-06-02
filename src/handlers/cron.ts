import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RepeatPeriod, TaskStatus } from '@prisma/client';
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  isSameDay,
  startOfDay,
  subDays,
} from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async dailyCron() {
    const yesterday = startOfDay(subDays(new Date(), 1));

    const users = await this.prisma.user.findMany();

    for (const user of users) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          streak:
            !user.lastEarnedXp || !isSameDay(user.lastEarnedXp, yesterday)
              ? 0
              : { increment: 1 },
        },
      });
    }

    const tasks = await this.prisma.task.findMany({
      where: {
        repeatPeriod: { not: null },
        repeatInterval: { not: null },
        status: TaskStatus.COMPLETED,
      },
    });
    //добавить день повторения
    await Promise.all(
      tasks.map(async (task) => {
        let nextDate = addDays(task.deadline, task.repeatInterval);
        switch (task.repeatPeriod) {
          case RepeatPeriod.WEEKLY: {
            nextDate = addWeeks(task.deadline, task.repeatInterval);
            break;
          }
          case RepeatPeriod.MONTHLY: {
            nextDate = addMonths(task.deadline, task.repeatInterval);
            break;
          }
          case RepeatPeriod.YEARLY: {
            nextDate = addYears(task.deadline, task.repeatInterval);
            break;
          }
        }
        await this.prisma.task.update({
          where: { id: task.id },
          data: { deadline: nextDate },
        });
      }),
    );
  }
  async hourlyCron() {
    //просроченность
  }
}
