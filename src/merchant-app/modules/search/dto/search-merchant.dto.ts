import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class SearchDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search: string = undefined;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  @Transform(({ obj }) => (obj.product.toLowerCase() === 'true' ? true : false))
  product?: boolean = true;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  @Transform(({ obj }) => (obj.merchant.toLowerCase() === 'true' ? true : false))
  merchant?: boolean = true;
}
