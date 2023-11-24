import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RequestChangeMobileRequestClientDto } from './request-change-mobile.dto';

export class RequestChangeMobileVerifyDto extends RequestChangeMobileRequestClientDto {
  @ApiProperty()
  @IsString()
  @MinLength(6)
  otp: string;
}
