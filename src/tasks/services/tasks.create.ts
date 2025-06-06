import { Injectable } from '@nestjs/common';
import { CreateGoalDto, DifficultyXP, InputCreateTaskDto } from '../tasks.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role, TaskStatus } from '@prisma/client';

@Injectable()
export class TasksCreateService {
  constructor(private prisma: PrismaService) {}
  async createTask(
    data: InputCreateTaskDto & { contextId: string; role: Role },
  ) {
    const userId = data.asigneeId ? data.asigneeId : data.contextId;
    const creatorId = data.asigneeId ? data.contextId : undefined;
    console.log('data', data);
    const createdTask = await this.prisma.task.create({
      data: {
        userId,
        creatorId: creatorId,
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
        gold: DifficultyXP[data.difficulty].gold,
        deadline: data.deadline,
        repeatInterval: data.repeat?.interval ?? null,
        repeatPeriod: data.repeat?.period ?? null,
        repeatDay: data.repeat?.day ?? null,
        status:
          data.role === Role.ADMIN
            ? TaskStatus.IN_PROGRESS
            : TaskStatus.PENDING,
        isImportant: data.isImportant,
      },
    });

    await this.prisma.taskXp.createMany({
      data: data.skills.map((skill) => ({
        taskId: createdTask.id,
        skillId: skill.id,
        skillPercent: skill.percent,
      })),
    });

    const feat = await this.prisma.taskXp.createManyAndReturn({
      data: data.features.map((feature) => ({
        taskId: createdTask.id,
        featureId: feature.id,
        featurePercent: feature.percent,
      })),
    });
    console.log('feat', feat);
    return { id: createdTask.id };
  }

  async createGoal(data: CreateGoalDto & { userId: string }) {
    const createdGoal = await this.prisma.goal.create({
      data: {
        title: data.title,
        description: data.description,
        startDate: data.startDate,
        deadline: data.deadline,
        progress: 0,
        userId: data.userId,
      },
    });

    await this.prisma.goalTask.createMany({
      data: data.tasks.map((task, index) => ({
        goalId: createdGoal.id,
        taskId: task.taskId,
        order: task.order ?? index,
        completed: false,
      })),
    });
  }
}
