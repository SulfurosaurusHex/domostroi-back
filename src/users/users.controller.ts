import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  UsersCreateService,
  UsersReadService,
  UsersUpdateService,
} from './services';
import { CreateUserDto, EditUserDto, OutputUserDto } from './user.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DefaultResponseDto } from './services/types';
import { RequestWithId } from 'src/shared/types';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersCreateService: UsersCreateService,
    private readonly usersReadService: UsersReadService,
    private readonly usersUpdateService: UsersUpdateService,
  ) {}

  @Patch()
  async update(
    @Req() request: RequestWithId,
    @Body() updateUserDto: EditUserDto,
  ) {
    return await this.usersUpdateService.update(request.userId, updateUserDto);
  }

  @Patch('/clearInfo')
  async clearData(@Req() request: RequestWithId) {
    return await this.usersUpdateService.clearData(request.userId);
  }

  @Delete()
  async remove(@Req() request: RequestWithId) {
    return await this.usersUpdateService.remove(request.userId);
  }
}
