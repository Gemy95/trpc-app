import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { CreateProductDto } from '../../product/dto/create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  @Min(1)
  serialDisplayNumber: number;
}
