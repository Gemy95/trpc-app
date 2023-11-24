import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { GetAllDto } from '../../common/dto/get-all.dto';

export class GetAllWithFiltersDto extends GetAllDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  longitude: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  latitude: number;

  @ApiPropertyOptional({ default: 25000 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  maxDistance?: number = 25000;

  @ApiPropertyOptional({ default: 0 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  minDistance?: number = 0;
}
