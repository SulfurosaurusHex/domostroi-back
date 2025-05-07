import {
  Controller,
  Param,
  Get,
  Body,
  Post,
  Req,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  FeatureDto,
  SkillListDto,
  SkillXpDto,
  CreateSkillDto,
  EditSkillDto,
  OutputSkillDto,
} from './characteristics.dto';
import { CharacteristicsService } from './characteristics.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { RequestWithId } from 'src/shared/types';

@Controller('characteristics')
@ApiTags('characteristics')
export class CharacteristicsController {
  constructor(
    private readonly characteristicsService: CharacteristicsService,
  ) {}
  @Get('features/user')
  @ApiOkResponse({ type: [FeatureDto] })
  async getFeatures(@Req() request: RequestWithId): Promise<FeatureDto[]> {
    return await this.characteristicsService.getFeatureList(request.userId);
  }

  @Get('skills/user')
  @ApiOkResponse({ type: [SkillXpDto] })
  async getUserSkills(@Req() request: RequestWithId): Promise<SkillXpDto[]> {
    return this.characteristicsService.getSkillsXp(
      request.userId,
      request.familyId,
    );
  }

  @Get('skills')
  @ApiOkResponse({ type: [SkillListDto] })
  async getSkills(@Req() request: RequestWithId): Promise<SkillListDto[]> {
    return this.characteristicsService.getSkillList(request.familyId);
  }

  @Get('skill/:id')
  @ApiOkResponse({ type: OutputSkillDto })
  findSkill(@Param('id') id: string) {
    return this.characteristicsService.findSkill(id);
  }

  @Post('skills')
  @ApiOkResponse()
  async createSkill(
    @Body() data: CreateSkillDto,
    @Req() request: RequestWithId,
  ) {
    return this.characteristicsService.createSkill(data, request.familyId);
  }

  @Patch('skills/:id')
  @ApiOkResponse()
  async editSkill(@Body() data: EditSkillDto, @Param('id') id: string) {
    return this.characteristicsService.editSkill(data, id);
  }

  @Delete('skills/:id')
  @ApiOkResponse()
  async deleteSkill(@Param('id') id: string, @Req() request: RequestWithId) {
    return this.characteristicsService.deleteSkill(id, request.userId);
  }
}
