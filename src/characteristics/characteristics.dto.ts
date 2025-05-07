import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { PercentDto } from 'src/tasks/tasks.dto';
export class SkillListDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
}

export class SkillXpDto extends SkillListDto {
  @ApiProperty()
  xp: number;
}

export class FeatureBaseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  parentBrunchId: string;
  @ApiProperty()
  userXp: number;
}

export class FeatureDto extends OmitType(FeatureBaseDto, ['parentBrunchId']) {
  @ApiProperty({ type: FeatureBaseDto, isArray: true })
  children: FeatureBaseDto[];
}

export class CreateSkillDto {
  @ApiProperty()
  name: string;
  @ApiPropertyOptional()
  description?: string;
  @ApiProperty({ type: PercentDto, isArray: true })
  features: PercentDto[];
}

export class EditSkillDto extends PartialType(CreateSkillDto) {}

export class OutputSkillDto extends CreateSkillDto {
  @ApiProperty()
  id: string;
}
