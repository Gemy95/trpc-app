import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsMongoId, IsOptional } from 'class-validator';
import { BaseQuery } from '../../common/dto/BaseQuery.dto';

export class ProductCategoryQueryDto extends BaseQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @IsMongoId({ each: true })
  readonly branches?: string[];
}
