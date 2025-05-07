import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginOutputDto, LoginInputDto } from './auth.dto';
import { CreateUserDto } from 'src/users/user.dto';
import { UsersCreateService } from 'src/users/services';
import { UsersReadService } from 'src/users/services';
import * as bcrypt from 'bcrypt';

import { TokenService } from 'src/token/token.service';

import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private usersCreateService: UsersCreateService,
    private usersReadService: UsersReadService,
    private tokenService: TokenService,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async me(token?: string) {
    if (!token) throw new UnauthorizedException('no token on');
    try {
      const payload = await this.jwtService.verify(token);
      const userData = await this.usersReadService.findUser(payload.userId);
      return userData;
    } catch (e) {
      console.error(e);
      throw new Error('bad');
    }
  }
  async login({ name, password }: LoginInputDto): Promise<LoginOutputDto> {
    const user = await this.prisma.user.findUnique({ where: { name } });

    if (!user) {
      throw new UnauthorizedException('Неверное имя пользователя или пароль');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверное имя пользователя или пароль');
    }
    const token = await this.tokenService.generateTokens(user.id);
    return {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    };
  }

  async signup(userCredentials: CreateUserDto): Promise<LoginOutputDto> {
    const user = await this.usersCreateService.create(userCredentials);
    const token = await this.tokenService.generateTokens(user.userId);
    return {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    };
  }

  async logout(userId: string) {
    await this.tokenService.deleteToken(userId);
  }
}
