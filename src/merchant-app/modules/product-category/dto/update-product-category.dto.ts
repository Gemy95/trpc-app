import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min, Validate } from 'class-validator';
import { IsMongoObjectId } from '../../lib/mongodb-helper';
import { CreateProductCategoryDto } from './product-category.dto';

export class UpdateProductCategoryDto extends PartialType(CreateProductCategoryDto) {
  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  @Min(1)
  serialDisplayNumber: number;
}
