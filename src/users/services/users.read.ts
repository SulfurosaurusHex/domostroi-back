import { Injectable } from '@nestjs/common';

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

  async findUser(id: string) {
    return await this.prisma.user.findUnique({
      omit: { password: true, lastEarnedXp: true, role: true },
      where: { id },
    });
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
