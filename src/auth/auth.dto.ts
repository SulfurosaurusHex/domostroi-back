import { ApiProperty } from '@nestjs/swagger';

export class LoginInputDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  password: string;
}

export class LoginOutputDto {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  refreshToken: string;
}
