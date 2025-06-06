import { Injectable } from '@nestjs/common';
import { DifficultyXP, InputEditTaskDto } from '../tasks.dto';
import { PrismaService } from 'src/prisma/prisma.service';

import { TaskStatus } from '@prisma/client';
import { SharedService } from 'src/shared/shared.service';
import { differenceInDays, isSameDay } from 'date-fns';

@Injectable()
export class TasksUpdateService {
  constructor(
    private prisma: PrismaService,
    private sharedService: SharedService,
  ) {}

  async updateTaskStatus(id: string, status: TaskStatus) {
    await this.prisma.task.update({
      where: { id },
      data: {
        status,
      },
    });
    return 'OK';
  }

  calculateEarnedXp(baseXp: number, lastEarned?: Date | null) {
    if (!lastEarned) return baseXp;
    const timePassed = differenceInDays(new Date(), lastEarned);
    const multiplier = 1 - timePassed / 10;
    return baseXp * (multiplier < 0.25 ? 0.25 : multiplier);
  }

  async completeTask(id: string, familyId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { taskXp: true, user: true },
    });
    const currentLastEarnedXp = task.user.lastEarnedXp;
    let userEarnedXp = 0;

    if (!task.taskXp || !task.taskXp.length) {
      userEarnedXp = this.calculateEarnedXp(
        DifficultyXP[task.difficulty].xp,
        task.user?.lastEarnedXp,
      );

      const updeteData = {
        lastEarnedXp: new Date(),
        xp: { increment: userEarnedXp },
        gold: { increment: task.gold },
      };
      await this.prisma.user.update({
        where: { id: task.userId },
        data:
          !currentLastEarnedXp || !isSameDay(currentLastEarnedXp, new Date())
            ? { ...updeteData, streak: { increment: 1 } }
            : updeteData,
      });
    } else {
      await Promise.all(
        task.taskXp.map(async (taskXp) => {
          if (taskXp.skillId) {
            const userSkill = await this.prisma.userSkill.findUnique({
              where: {
                userSkillId: { userId: task.userId, skillId: taskXp.skillId },
              },
            });
            const features = await this.prisma.featureSkill.findMany({
              where: { skillId: taskXp.skillId },
            });
            const skillXp =
              this.calculateEarnedXp(
                DifficultyXP[task.difficulty].xp,
                userSkill?.lastEarnedXp,
              ) * taskXp.skillPercent;
            userEarnedXp += skillXp;

            await Promise.all(
              features.map(async (feature) => {
                this.prisma.userFeature.upsert({
                  where: {
                    userFeatureId: {
                      userId: task.userId,
                      featureId: feature.featureId,
                    },
                  },
                  create: {
                    userId: task.userId,
                    featureId: feature.featureId,
                    xp: skillXp * feature.percent,
                    lastEarnedXp: new Date(),
                  },
                  update: {
                    xp: {
                      increment: skillXp * feature.percent,
                    },
                    lastEarnedXp: new Date(),
                  },
                });
              }),
            );

            await this.prisma.userSkill.upsert({
              where: {
                userSkillId: { userId: task.userId, skillId: taskXp.skillId },
              },
              create: {
                xp: skillXp,
                lastEarnedXp: new Date(),
                userId: task.userId,
                skillId: taskXp.skillId,
              },
              update: {
                xp: { increment: skillXp },
                lastEarnedXp: new Date(),
              },
            });
          } else if (taskXp.featureId) {
            const userFeature = await this.prisma.userFeature.findUnique({
              where: {
                userFeatureId: {
                  userId: task.userId,
                  featureId: taskXp.featureId,
                },
              },
            });

            const featureXp =
              this.calculateEarnedXp(
                DifficultyXP[task.difficulty].xp,
                userFeature?.lastEarnedXp,
              ) * taskXp.featurePercent;

            userEarnedXp += featureXp;

            await this.prisma.userFeature.upsert({
              where: {
                userFeatureId: {
                  userId: task.userId,
                  featureId: taskXp.featureId,
                },
              },
              create: {
                xp: featureXp,
                lastEarnedXp: new Date(),
                userId: task.userId,
                featureId: taskXp.featureId,
              },
              update: {
                xp: { increment: featureXp },
                lastEarnedXp: new Date(),
              },
            });
          }
        }),
      );

      const currentUserXp = await this.prisma.user.findUnique({
        where: { id: task.userId },
        select: { xp: true },
      });
      const newLevel = await this.sharedService.recalculateLevel(
        familyId,
        currentUserXp.xp + userEarnedXp,
      );
      console.log('newLevel', newLevel);
      const updeteData = {
        lastEarnedXp: new Date(),
        xp: { increment: userEarnedXp },
        gold: { increment: task.gold },
        levelId: newLevel,
      };

      await this.prisma.user.update({
        where: { id: task.userId },
        data:
          !currentLastEarnedXp || isSameDay(currentLastEarnedXp, new Date())
            ? { ...updeteData, streak: { increment: 1 } }
            : updeteData,
      });
    }

    await this.prisma.taskCompletion.create({
      data: {
        completedAt: new Date(),
        taskId: task.id,
        userId: task.userId,
        xp: userEarnedXp,
      },
    });
  }

  async updateTask(data: InputEditTaskDto, familyId: string) {
    await this.prisma.task.update({
      where: { id: data.id },
      data,
    });
    if (data.status === TaskStatus.COMPLETED)
      await this.completeTask(data.id, familyId);
    return 'OK';
  }

  async deleteTask(id: string) {
    await this.prisma.task.delete({ where: { id } });
    return 'Deleted';
  }
}
