import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';

import {
  TasksCreateService,
  TasksUpdateService,
  TasksReadService,
} from './services';

import {
  InputCreateTaskDto,
  InputEditTaskDto,
  OutputCreateTaskDto,
  OutputTaskListDto,
  OutputTaskDto,
  OutputTaskItemDto,
  TaskQueryDto,
  OutputHabitsDto,
  HabitQueryDto,
  CreateGoalDto,
} from './tasks.dto';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { TaskStatus, TaskType } from '@prisma/client';

import { RequestWithId } from 'src/shared/types';

@Controller('tasks')
@ApiTags('tasks')
export class TasksController {
  constructor(
    private readonly tasksCreateService: TasksCreateService,
    private readonly tasksUpdateService: TasksUpdateService,
    private readonly tasksReadService: TasksReadService,
  ) {}
  @Get()
  @ApiOkResponse({ type: OutputTaskListDto })
  @ApiQuery({
    name: 'status',
    enum: TaskStatus,
    enumName: 'TaskStatus',
    required: false,
  })
  @ApiQuery({
    name: 'type',
    enum: TaskType,
    enumName: 'TaskType',
    required: false,
  })
  @ApiQuery({ name: 'limit', type: Number })
  @ApiQuery({ name: 'offset', type: Number })
  @ApiQuery({ name: 'dateFrom', type: Date, required: false })
  @ApiQuery({ name: 'dateTo', type: Date, required: false })
  async findTasksForUser(
    @Req() request: RequestWithId,
    @Query() query: TaskQueryDto,
  ): Promise<OutputTaskListDto> {
    return this.tasksReadService.findTasksForUser(request.userId, query);
  }

  @Get(':id')
  @ApiOkResponse({ type: OutputTaskItemDto })
  async findTask(@Param('id') id: string) {
    return await this.tasksReadService.findTask(id);
  }

  @Get('/for_approval')
  @ApiOkResponse({ type: [OutputTaskDto] })
  async findTasksForApproval(@Req() request: RequestWithId) {
    return await this.tasksReadService.findTasksForApproval(request.familyId);
  }

  @Get('/habbits')
  @ApiOkResponse({ type: [OutputHabitsDto] })
  @ApiQuery({ name: 'dateFrom', type: Date, required: false })
  @ApiQuery({ name: 'dateTo', type: Date, required: false })
  async getHabbits(
    @Req() request: RequestWithId,
    @Query() query: HabitQueryDto,
  ): Promise<OutputHabitsDto[]> {
    return await this.tasksReadService.getHabbits(request.userId, query);
  }

  @Post()
  @ApiCreatedResponse({ type: OutputCreateTaskDto })
  async create(
    @Body() createTaskDto: InputCreateTaskDto,
    @Req() request: RequestWithId,
  ): Promise<OutputCreateTaskDto> {
    return await this.tasksCreateService.createTask({
      ...createTaskDto,
      contextId: request.userId,
      role: request.role,
    });
  }

  @Patch(':id')
  @ApiOkResponse()
  async completeTask(
    @Param('id') id: string,
    @Body() editTaskDto: InputEditTaskDto,
    @Req() request: RequestWithId,
  ) {
    return await this.tasksUpdateService.updateTask(
      { id, ...editTaskDto },
      request.familyId,
    );
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    return await this.tasksUpdateService.deleteTask(id);
  }

  @Post('/goal')
  async createGoal(
    @Req() request: RequestWithId,
    @Body() createGoalto: CreateGoalDto,
  ) {
    return await this.tasksCreateService.createGoal({
      ...createGoalto,
      userId: request.userId,
    });
  }
}
