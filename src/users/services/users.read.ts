import { Injectable } from '@nestjs/common';
import { startOfWeek } from 'date-fns';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersReadService {
  constructor(private prisma: PrismaService) {}

  async findFamilyMembers(familyId: string) {
    return await this.prisma.family.findUnique({
      where: { id: familyId },
      include: {
        users: {
          omit: {
            password: true,
            email: true,
            familyId: true,
            lastEarnedXp: true,
          },
        },
      },
    });
  }

  async streakInfo(userId: string) {
    const productivity = await this.prisma.taskCompletion.count({
      where: { userId, completedAt: { gte: startOfWeek(new Date()) } },
    });

    const achievements = await this.prisma.userAchievements.count({
      where: { userId },
    });

    return { productivity, achievements };
  }

  async findUser(id: string) {
    const streakInfo = await this.streakInfo(id);
    const userInfo = await this.prisma.user.findUnique({
      where: { id },
      omit: { password: true, role: true, levelId: true },
      include: { level: { omit: { xp: true, id: true, familyId: true } } },
    });
    return { ...userInfo, ...streakInfo };
  }

  /*  async getUserWishes(id: string) {
    const userWishes = await this.prisma.wishes.findMany({
      where: { userId: id },
    });

    return userWishes;
  } */

  /*   async getFamilyWishes(familyId: string) {
    const familyMembers = await this.findFamilyMembers(familyId);

    return await Promise.all(
      familyMembers.map(async (member) => {
        const memberWishes = await this.getFamilyWishes(member.id);
        return memberWishes;
      }),
    );
  } */
}
