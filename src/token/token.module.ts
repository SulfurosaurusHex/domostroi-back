import { TokenService } from './token.service';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';

import { JwtModule } from '@nestjs/jwt';

export const jwtSecret = 'someVerySecretShit';
@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: '25m' },
    }),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
