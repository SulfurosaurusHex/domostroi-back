import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role, TaskStatus, TaskType } from '@prisma/client';
import { TaskQueryDto } from '../tasks.dto';
import { isBefore } from 'date-fns';
@Injectable()
export class TasksReadService {
  constructor(private prisma: PrismaService) {}

  async findTasksForUser(userId: string, query: TaskQueryDto) {
    const { status, type, limit, offset, dateFrom, dateTo } = query;
    const where: any = { userId };

    if (status) where.status = status;
    if (type) where.type = type;
    if (dateFrom) where.deadline = { gte: dateFrom };
    if (dateTo) where.deadline = { lte: dateTo };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where,
        take: +limit,
        skip: +offset,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          title: true,
          status: true,
          type: true,
          deadline: true,
          creator: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      this.prisma.task.count({ where }),
    ]);
    return { total, items };
  }

  async findTask(id: string) {
    const foundTask = await this.prisma.task.findUnique({
      where: { id },
      select: {
        id: true,
        difficulty: true,
        title: true,
        status: true,
        isImportant: true,
        deadline: true,
        taskXp: true,
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!foundTask) throw new NotFoundException('не найдено');
    return foundTask;
  }

  async findTasksForApproval(familyId: string) {
    const tasks = await this.prisma.family.findUnique({
      where: { id: familyId },
      include: {
        users: {
          where: { role: Role.MEMBER },
          include: {
            userTasks: {
              where: {
                status: TaskStatus.PENDING,
              },
            },
          },
        },
      },
    });

    return tasks.users
      .flatMap((member) => member.userTasks)
      .sort((a, b) => (isBefore(a.createdAt, b.createdAt) ? 1 : -1));
  }
}
