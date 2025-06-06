import {
  ApiProperty,
  ApiPropertyOptional,
  ApiSchema,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import {
  DayOfWeek,
  Difficulty,
  RepeatPeriod,
  TaskStatus,
  TaskType,
} from '@prisma/client';

export const DifficultyXP: Record<Difficulty, { xp: number; gold: number }> = {
  [Difficulty.SMALL]: { xp: 5, gold: 0 },
  [Difficulty.EASY]: { xp: 10, gold: 1 },
  [Difficulty.MEDIUM]: { xp: 40, gold: 4 },
  [Difficulty.HARD]: { xp: 160, gold: 16 },
  [Difficulty.EPIC]: { xp: 640, gold: 64 },
  [Difficulty.LEGENDARY]: { xp: 2560, gold: 256 },
};

class RepeatDto {
  @ApiPropertyOptional({ enum: RepeatPeriod, enumName: 'RepeatPeriod' })
  period?: RepeatPeriod;
  @ApiPropertyOptional()
  interval?: number;
  @ApiPropertyOptional({ enum: DayOfWeek, enumName: 'DayOfWeek' })
  day?: DayOfWeek;
}

export class PercentDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  percent: number;
}

@ApiSchema({ description: 'Создание задачи' })
export class InputCreateTaskDto {
  @ApiProperty()
  title: string;
  @ApiPropertyOptional()
  description?: string;
  @ApiPropertyOptional()
  deadline?: Date;
  @ApiPropertyOptional()
  asigneeId?: string;
  @ApiPropertyOptional()
  creatorId?: string;
  @ApiPropertyOptional({ enum: Difficulty, enumName: 'Difficulty' })
  difficulty: Difficulty;
  @ApiPropertyOptional({ type: RepeatDto })
  repeat?: RepeatDto;
  @ApiProperty({ enum: TaskType, enumName: 'TaskType' })
  type: TaskType;
  @ApiPropertyOptional()
  isImportant?: boolean;
  @ApiProperty({ type: [PercentDto] })
  skills: PercentDto[];
  @ApiProperty({ type: [PercentDto] })
  features: PercentDto[];
}

@ApiSchema({ description: 'Редактирование задачи' })
export class InputEditTaskDto extends PartialType(InputCreateTaskDto) {
  @ApiProperty()
  id: string;
  @ApiPropertyOptional({ enum: TaskStatus, enumName: 'TaskStatus' })
  status?: TaskStatus;
}

@ApiSchema({ description: '' })
export class OutputCreateTaskDto {
  @ApiProperty()
  id: string;
}

class CreatorDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
}

export class OutputTaskDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  title: string;
  @ApiProperty({ enum: TaskStatus, enumName: 'TaskStatus' })
  status: TaskStatus;
  @ApiPropertyOptional()
  deadline?: Date;
  @ApiProperty({ enum: TaskType, enumName: 'TaskType' })
  type: TaskType;
  @ApiPropertyOptional({ type: CreatorDto })
  creator?: CreatorDto;
}

export class OutputTaskListDto {
  @ApiProperty()
  total: number;
  @ApiProperty({ type: [OutputTaskDto] })
  items: OutputTaskDto[];
}

export class OutputTaskItemDto extends OutputTaskDto {
  @ApiPropertyOptional()
  description?: string;
  @ApiProperty({ enum: Difficulty, enumName: 'Difficulty' })
  difficulty: Difficulty;
  @ApiPropertyOptional()
  isImportant?: boolean;
}

export class TaskQueryDto {
  status?: TaskStatus;
  type?: TaskType;
  limit: number;
  offset: number;
  dateFrom?: Date;
  dateTo?: Date;
}

export class HabitQueryDto extends PickType(TaskQueryDto, [
  'dateFrom',
  'dateTo',
]) {}

class TaskInfoDto {
  @ApiProperty()
  id: string;
  @ApiPropertyOptional()
  description?: string;
  @ApiProperty()
  title: string;
}
export class OutputHabitsDto {
  @ApiProperty()
  completedAt: Date;
  @ApiProperty({ type: TaskInfoDto })
  task: TaskInfoDto;
}

class GoalTasksDto {
  @ApiProperty()
  taskId: string;
  @ApiPropertyOptional()
  order?: number;
}
export class CreateGoalDto {
  @ApiProperty()
  title: string;
  @ApiPropertyOptional()
  description?: string;
  @ApiPropertyOptional()
  startDate?: Date;
  @ApiPropertyOptional()
  deadline?: Date;
  @ApiProperty({ type: GoalTasksDto, isArray: true })
  tasks: GoalTasksDto[];
}
