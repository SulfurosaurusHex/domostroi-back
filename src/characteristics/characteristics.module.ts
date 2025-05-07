import { Module } from '@nestjs/common';
import { CharacteristicsService } from './characteristics.service';
import { CharacteristicsController } from './characteristics.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
@Module({
  controllers: [CharacteristicsController],
  imports: [PrismaModule],
  providers: [CharacteristicsService],
})
export class CharacteristicsModule {}
