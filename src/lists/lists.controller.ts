import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import {
  UserAbilityDto,
  OutputListDto,
  CreateListDto,
  EditListDto,
  OutputListsDto,
} from './lists.dto';
import { ListsService } from './lists.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { RequestWithId } from 'src/shared/types';
@Controller('lists')
@ApiTags('lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Get('abilities')
  @ApiOkResponse({ type: UserAbilityDto })
  async getUserAbilitie(
    @Req() request: RequestWithId,
  ): Promise<UserAbilityDto> {
    return this.listsService.getUserAbilities(request.role, request.payed);
  }

  @Get()
  @ApiOkResponse({ type: [OutputListsDto] })
  async getUserLists(@Req() request: RequestWithId): Promise<OutputListsDto[]> {
    return await this.listsService.getUserLists(request.userId);
  }

  @Get(':type')
  @ApiOkResponse({ type: OutputListDto })
  async getListsByType(
    @Param('type') type: string,
    @Req() request: RequestWithId,
  ): Promise<OutputListDto> {
    return await this.listsService.getListsByType(type, request.userId);
  }

  @Post()
  async createList(
    @Body() createListDto: CreateListDto,
    @Req() request: RequestWithId,
  ) {
    return await this.listsService.createList(request.userId, createListDto);
  }

  @Patch()
  async editList(
    @Body() editListDto: EditListDto,
    @Req() request: RequestWithId,
  ) {
    return await this.listsService.editList(request.userId, editListDto);
  }

  /*@Get('enums')
  @ApiOkResponse({ type: [FeatureDto] }) 
  async getEnums(@Body() id: string) {
    return this.listsService.getFeaturesXp(id);
  }*/
}
