import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

import { Role } from '@prisma/client';
import { SharedService } from 'src/shared/shared.service';

export const roundsOfHashing = 10;

@Injectable()
export class UsersCreateService {
  constructor(
    private prisma: PrismaService,
    private sharedService: SharedService,
  ) {}
  async create(data: CreateUserDto) {
    const existed = await this.prisma.user.findFirst({
      where: { OR: [{ name: data.name }, { email: data.email }] },
    });
    if (existed) throw new ConflictException('Пользователь уже существует');

    const hashedPassword = await bcrypt.hash(data.password, roundsOfHashing);
    let familyId = data.familyid;

    if (!data.familyid) {
      const newFamily = await this.prisma.family.create({
        data: {
          name: `family-${Date.now()}`,
          payed: false,
        },
      });
      familyId = newFamily.id;
    }

    const firstLevel = await this.sharedService.generateLevels(familyId);

    const createdUser = await this.prisma.user.create({
      data: {
        name: data.name,
        password: hashedPassword,
        role: data.role ?? Role.ADMIN,
        email: data.email,
        xp: 0,
        gold: 0,
        familyId: familyId,
        createdAt: new Date(),
        levelId: firstLevel.id,
      },
    });

    return {
      userId: createdUser.id,
      role: createdUser.role,
      familyId: createdUser.familyId,
    };
  }
}
