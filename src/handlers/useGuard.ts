import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  CanActivate,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

import { TokenService } from 'src/token/token.service';

const cookiePrefix = process.env.COOKIES_PREFIX ?? 'PREFIX';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    if (this.isPublicRoute(context)) return true;
    const accessToken = request.cookies[`${cookiePrefix}_ACCESS`];
    let payload;

    try {
      payload = await this.jwtService.verifyAsync(accessToken);
    } catch {
      const refreshToken = request.cookies[`${cookiePrefix}_REFRESH`];

      if (!refreshToken) throw new UnauthorizedException('No refresh token');

      const { tokens, tokenInfo } =
        await this.tokenService.refreshToken(refreshToken);

      response.cookie(`${cookiePrefix}_ACCESS`, tokens.accessToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
      response.cookie(`${cookiePrefix}_REFRESH`, tokens.refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });

      payload = tokenInfo;
    }

    request['userId'] = payload.userId;
    request['familyId'] = payload.familyId;
    request['role'] = payload.role;
    request['payed'] = payload.payed;

    return true;
  }
  private isPublicRoute(context: ExecutionContext): boolean {
    const metadata = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    return metadata === true;
  }
}
