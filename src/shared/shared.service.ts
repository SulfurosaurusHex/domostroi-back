import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { calcXpPerLevel, calcLevel } from 'src/handlers/calcLevel';

@Injectable()
export class SharedService {
  constructor(private prisma: PrismaService) {}
  async generateLevels(familyId: string) {
    const [zeroLevel] = await this.prisma.level.createManyAndReturn({
      data: [...Array(10)].map((item, index) => ({
        level: index,
        name: '',
        xp: calcXpPerLevel(index),
        familyId,
      })),
    });

    return zeroLevel;
  }

  async recalculateLevel(familyId: string, currentXp: number) {
    const level = calcLevel(currentXp);

    const foundLevel = await this.prisma.level.findUnique({
      where: {
        uniqueLevelFamily: {
          familyId,
          level,
        },
      },
    });
    if (!foundLevel) {
      const newLevel = await this.prisma.level.create({
        data: {
          level,
          name: '',
          xp: calcXpPerLevel(level),
          familyId,
        },
      });
      return newLevel.id;
    }
    return foundLevel.id;
  }
}
