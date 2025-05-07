import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty()
  name: string;
  @ApiPropertyOptional()
  email: string;
  @ApiProperty()
  password: string;
  @ApiPropertyOptional()
  familyid?: string;
  @ApiPropertyOptional({ enum: Role, enumName: 'Role' })
  role?: Role;
}

export class EditUserDto extends PartialType(CreateUserDto) {}

export class SkillXpDto {
  @ApiProperty()
  skillId: string;
  @ApiProperty()
  xp: number;
}

export class FeatureXpDto {
  @ApiProperty()
  featureId: string;
  @ApiProperty()
  xp: number;
}

export class OutputUserDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiPropertyOptional()
  email?: string;
  @ApiProperty()
  xp: number;
  @ApiProperty()
  gold: number;
  @ApiProperty()
  familyId: string;
}
