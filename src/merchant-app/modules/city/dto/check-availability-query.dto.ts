import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class AvailabilityQueryDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  longitude: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  latitude: number;

  @ApiPropertyOptional({ type: Number, default: 25000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxDistance?: number = 25000;
}
