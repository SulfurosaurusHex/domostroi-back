import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { Role } from '@prisma/client';
import { CreateListDto, EditListDto, Abilities } from './lists.dto';
import { v4 } from 'uuid';
@Injectable()
export class ListsService {
  constructor(private prisma: PrismaService) {}

  getAbilities(role: Role, isPayed: boolean) {
    const abilityArray = { create: [], read: [], update: [], delete: [] };

    if (role === Role.ADMIN) {
      abilityArray.create.push(Abilities.ASSIGN_TASK);
      abilityArray.create.push(Abilities.CREATE_SKILL);
      abilityArray.update.push(Abilities.CREATE_SKILL);
    }

    if (isPayed) {
      abilityArray.create.push(Abilities.ADD_ATTACHABLES);
      abilityArray.create.push(Abilities.CREATE_THEME);
    }

    return abilityArray;
  }

  async getUserAbilities(role: Role, payed: boolean) {
    return this.getAbilities(role, payed);
  }

  async getUserLists(userId: string) {
    return await this.prisma.list.findMany({ where: { userId } });
  }

  async getListsByType(userId: string, listType: string) {
    const list = await this.prisma.list.findUnique({
      where: { uniqueTitleUser: { userId, title: listType } },
      include: { listItems: true },
    });

    return list;
  }

  async createList(userId: string, data: CreateListDto) {
    const { listItems, ...rest } = data;
    const list = await this.prisma.list.create({
      data: {
        userId,
        ...rest,
      },
    });

    await this.prisma.listItem.createMany({
      data: listItems.map((item) => ({ listId: list.id, ...item })),
    });

    return list.id;
  }

  async editList(userId: string, data: EditListDto) {
    const { listItems, id, ...rest } = data;
    await this.prisma.list.update({
      where: { id },
      data: {
        ...rest,
      },
    });

    await Promise.all(
      listItems.map(async (item) => {
        const { id, ...rest } = item;
        await this.prisma.listItem.upsert({
          where: { id },
          update: rest,
          create: { listId: id, ...rest },
        });
      }),
    );
    return id;
  }
}
