import { InputTokenDto } from './token.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 } from 'uuid';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async getTokenData(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        familyId: true,
        family: {
          select: {
            payed: true,
          },
        },
      },
    });

    if (!user) throw new UnauthorizedException('no user');
    return user;
  }
  async generateAccessToken(userId: string) {
    const user = await this.getTokenData(userId);
    return this.jwtService.sign({
      userId: user.id,
      role: user.role,
      familyId: user.familyId,
      payed: user.family.payed,
    });
  }

  async generateRefreshToken() {
    return v4();
  }

  async deleteToken(userId: string) {
    await this.prisma.token.deleteMany({ where: { userId } });
  }

  async saveRefreshToken(token: string, userId: string) {
    await this.deleteToken(userId);
    const expires = new Date();
    expires.setDate(expires.getDate() + 3);
    await this.prisma.token.create({ data: { token, userId, expires } });
  }

  async generateTokens(userId: string) {
    const accessToken = await this.generateAccessToken(userId);
    const refreshToken = await this.generateRefreshToken();
    await this.saveRefreshToken(refreshToken, userId);

    return { accessToken, refreshToken };
  }

  async refreshToken(token: string) {
    const existingToken = await this.prisma.token.findUnique({
      where: {
        token,
        expires: { gte: new Date() },
      },
    });

    if (!existingToken) throw new UnauthorizedException('no token in refresh');
    const tokenInfo = await this.getTokenData(existingToken.userId);
    const tokens = await this.generateTokens(existingToken.userId);
    return { tokens, tokenInfo };
  }
}
