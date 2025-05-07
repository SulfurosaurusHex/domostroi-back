import { Injectable } from '@nestjs/common';
import { EditUserDto } from '../user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

export const roundsOfHashing = 10;

@Injectable()
export class UsersUpdateService {
  constructor(private prisma: PrismaService) {}

  async update(id: string, updateUserDto: EditUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        roundsOfHashing,
      );
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async clearData(userId: string, fullDelete?: boolean) {
    await this.prisma.listItem.deleteMany({ where: { list: { userId } } });
    await this.prisma.listTask.deleteMany({ where: { list: { userId } } });
    await this.prisma.list.deleteMany({ where: { userId } });
    await this.prisma.taskCompletion.deleteMany({ where: { userId } });
    await this.prisma.traditionTask.deleteMany({ where: { task: { userId } } });
    await this.prisma.goalTask.deleteMany({ where: { goal: { userId } } });
    await this.prisma.taskXp.deleteMany({ where: { task: { userId } } });
    await this.prisma.task.deleteMany({ where: { userId } });
    await this.prisma.goal.deleteMany({ where: { userId } });
    await this.prisma.userFeature.deleteMany({ where: { userId } });
    await this.prisma.userSkill.deleteMany({ where: { userId } });
    if (!fullDelete) {
      const levelId = (
        await this.prisma.user.findUnique({
          where: { id: userId },
          include: { family: { include: { levels: { where: { level: 0 } } } } },
        })
      ).family.levels[0].id;

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          xp: 0,
          lastEarnedXp: null,
          gold: 0,
          levelId,
        },
      });
    }
    return 'ok';
  }

  async remove(id: string) {
    await this.clearData(id, true);
    await this.prisma.token.deleteMany({ where: { userId: id } });
    await this.prisma.user.delete({ where: { id } });

    return 'ok';
  }
}
