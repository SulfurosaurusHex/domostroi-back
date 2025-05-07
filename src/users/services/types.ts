import { ApiProperty, PartialType } from '@nestjs/swagger';

export class DefaultResponseDto {
  @ApiProperty()
  id: string;
}
