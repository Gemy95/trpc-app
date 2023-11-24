import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Validate } from 'class-validator';
import { GetAllDto } from '../../common/dto/get-all.dto';
import { IsMongoObjectId } from '../../lib/mongodb-helper';

export class FavoriteQueryDto extends GetAllDto {
  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;
}
