import { AuthService } from './auth.service';
import {
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';

import { LoginInputDto } from './auth.dto';
import { CreateUserDto, OutputUserDto } from 'src/users/user.dto';
import {
  Controller,
  Body,
  Post,
  Res,
  Req,
  Get,
  SetMetadata,
} from '@nestjs/common';
import { RequestWithId } from 'src/shared/types';
import { Response, Request } from 'express';

const cookiePrefix = process.env.COOKIES_PREFIX ?? 'PREFIX';

export const Public = () => SetMetadata('isPublic', true);

@ApiTags('Auth Module')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/me')
  @ApiOperation({ summary: 'Get user info' })
  @ApiOkResponse({
    type: OutputUserDto,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not found' })
  async me(@Req() request: Request): Promise<OutputUserDto> {
    const data = await this.authService.me(
      request.cookies[`${cookiePrefix}_ACCESS`],
    );
    return data;
  }

  @Public()
  @Post('/login')
  @ApiOperation({ summary: 'Log In' })
  @ApiBody({ type: LoginInputDto })
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not found' })
  async login(
    @Body() loginUserDto: LoginInputDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<string> {
    const data = await this.authService.login(loginUserDto);
    response.cookie(`${cookiePrefix}_REFRESH`, data.refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    response.cookie(`${cookiePrefix}_ACCESS`, data.accessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    return 'ok';
  }

  @Public()
  @Post('/signup')
  @ApiOperation({ summary: 'Sign Up' })
  @ApiBody({ type: CreateUserDto })
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not found' })
  async signup(
    @Body() loginUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<string> {
    const data = await this.authService.signup(loginUserDto);
    response.cookie(`${cookiePrefix}_REFRESH`, data.refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    response.cookie(`${cookiePrefix}_ACCESS`, data.accessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    return 'ok';
  }

  @Public()
  @Post('/logout')
  @ApiOperation({ summary: 'Log In' })
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not found' })
  async logout(
    @Req() request: RequestWithId,
    @Res({ passthrough: true }) response: Response,
  ): Promise<string> {
    await this.authService.logout(request.userId);
    response.cookie(`${cookiePrefix}_REFRESH`, null);
    response.cookie(`${cookiePrefix}_ACCESS`, null);
    return 'ok';
  }
}
