import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class GetAllClientHistoryDto {
  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude: number;
}
