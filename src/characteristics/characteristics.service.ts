import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateSkillDto, EditSkillDto } from './characteristics.dto';
import { v4 } from 'uuid';
@Injectable()
export class CharacteristicsService {
  constructor(private prisma: PrismaService) {}

  async getFeatureList(userId: string) {
    const features = await this.prisma.feature.findMany({
      where: { parentBrunchId: null },
      include: { subbrunches: true },
    });

    const featuresWithXp = await Promise.all(
      features.map(async (feat) => {
        const children = await Promise.all(
          feat.subbrunches.map(async (sub) => {
            const userXp = await this.prisma.userFeature.findUnique({
              where: {
                userFeatureId: {
                  userId: userId,
                  featureId: sub.id,
                },
              },
            });

            return { ...sub, userXp: userXp?.xp ?? 0 };
          }),
        );
        const totalFeatureXp = children.reduce(
          (acc, curr) => acc + curr.userXp,
          0,
        );
        return {
          ...feat,
          userXp: totalFeatureXp,
          children,
        };
      }),
    );

    return await featuresWithXp.filter((f) => !!f);
  }

  async getSkillList(familyId: string) {
    const skills = await this.prisma.skill.findMany({
      where: { familyId },
      omit: { familyId: true },
    });
    return skills;
  }

  async getSkillsXp(userId: string, familyId: string) {
    const skills = await this.prisma.skill.findMany({
      where: { familyId },
      include: {
        userSkill: { where: { userId } },
      },
    });

    return skills.map((skill) => ({
      id: skill.id,
      xp: skill?.userSkill?.[0]?.xp ?? 0,
      name: skill.name,
    }));
  }

  async findSkill(id: string) {
    const foundSkill = await this.prisma.skill.findUnique({
      where: { id },
      omit: { familyId: true },
      include: { featureSkill: true },
    });
    if (!foundSkill) throw new NotFoundException('');
    return foundSkill;
  }

  async createSkill(data: CreateSkillDto, familyId: string) {
    const totalPercent = data.features.reduce(
      (acc, curr) => acc + curr.percent,
      0,
    );
    if (totalPercent !== 100)
      throw new BadRequestException('Сумма процентов должна быть равна 100');

    const createdSkill = await this.prisma.skill.create({
      data: {
        name: data.name,
        description: data.description,
        familyId,
      },
    });
    await Promise.all(
      data.features.map(async (feature) => {
        await this.prisma.featureSkill.create({
          data: {
            skillId: createdSkill.id,
            featureId: feature.id,
            percent: feature.percent,
          },
        });
      }),
    );
    return createdSkill.id;
  }

  async editSkill(data: EditSkillDto, skillId: string) {
    const existedSkill = await this.prisma.skill.findUnique({
      where: { id: skillId },
    });
    if (!existedSkill) throw new NotFoundException('Не найдено');
    const totalPercent = data.features.reduce(
      (acc, curr) => acc + curr.percent,
      0,
    );
    if (totalPercent !== 100)
      throw new BadRequestException('Сумма процентов должна быть равна 100');

    await this.prisma.skill.update({
      where: { id: skillId },
      data: {
        name: data.name,
        description: data.description,
      },
    });
    const features = await this.prisma.featureSkill.findMany({
      where: { skillId },
    });

    const featuresToDelete = features
      .filter((f) => !data.features.find((feat) => feat.id === f.featureId))
      .map(({ featureId }) => featureId);
    await this.prisma.featureSkill.deleteMany({
      where: { featureId: { in: featuresToDelete }, skillId },
    });

    await Promise.all(
      data.features.map(async (feature) => {
        await this.prisma.featureSkill.update({
          where: {
            featureSkillId: { skillId: skillId, featureId: feature.id },
          },
          data: {
            percent: feature.percent,
          },
        });
      }),
    );
    return skillId;
  }

  async deleteSkill(skillId: string, userId: string) {
    await this.prisma.taskXp.deleteMany({ where: { skillId } });
    await this.prisma.featureSkill.deleteMany({ where: { skillId } });
    await this.prisma.userSkill.delete({
      where: { userSkillId: { skillId, userId } },
    });
    await this.prisma.skill.delete({ where: { id: skillId } });

    /*  await this.prisma.$transaction({

  const featureSkillsToDelete = await this.prisma.featureSkill.findMany({
    where: { skillId },
    include: {
      feature: true,
    },
  });

  for (const fs of featureSkillsToDelete) {
    const featureId = fs.featureId;

    const remainingSkills = await this.prisma.featureSkill.findMany({
      where: {
        featureId,
        NOT: { skillId: skillIdToDelete },
      },
    });

    if (remainingSkills.length === 0) continue;

    const totalPercentToAdd = fs.percent;
    const share = totalPercentToAdd / remainingSkills.length;

    for (const rs of remainingSkills) {
      await this.prisma.featureSkill.update({
        where: { featureId_skillId: { featureId: rs.featureId, skillId: rs.skillId } },
        data: {
          percent: rs.percent + share,
        },
      });
    }

    await this.prisma.featureSkill.delete({
      where: { featureId_skillId: { featureId, skillId } },
    });
  }

  await this.prisman.skill.delete({
    where: { id: skillId },
  });
}); */
    return 'ok';
  }
}
