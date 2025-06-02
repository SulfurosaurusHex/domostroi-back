import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';

export enum Abilities {
  ASSIGN_TASK = 'ASSIGN_TASK',
  CREATE_SKILL = 'CREATE_SKILL',
  ADD_ATTACHABLES = 'ADD_ATTACHABLES',
  CREATE_THEME = 'CREATE_THEME',
}

export enum Crud {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export class UserAbilityDto {
  @ApiProperty({ enum: Abilities, enumName: 'Abilities', isArray: true })
  create: Abilities[];
  @ApiProperty({ enum: Abilities, enumName: 'Abilities', isArray: true })
  read: Abilities[];
  @ApiProperty({ enum: Abilities, enumName: 'Abilities', isArray: true })
  update: Abilities[];
  @ApiProperty({ enum: Abilities, enumName: 'Abilities', isArray: true })
  delete: Abilities[];
}

export class UserListDto {}

export class ListItemDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  title: string;
  @ApiPropertyOptional()
  description?: string;
  @ApiProperty()
  isCompleted: boolean;
}
export class CreateListDto {
  @ApiProperty()
  title: string;
  @ApiPropertyOptional()
  description?: string;
  @ApiPropertyOptional()
  deadline?: Date;
  @ApiProperty({ type: [ListItemDto] })
  listItems: ListItemDto[];
}

export class OutputListDto extends CreateListDto {
  @ApiProperty({ type: [ListItemDto] })
  listItems: ListItemDto[];
}

export class EditListDto extends PartialType(CreateListDto) {
  @ApiProperty()
  id: string;
}

export class OutputListsDto extends OmitType(CreateListDto, ['listItems']) {
  @ApiProperty()
  id: string;
}
