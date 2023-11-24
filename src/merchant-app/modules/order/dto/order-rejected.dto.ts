import { ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayNotEmpty, IsOptional, IsString } from 'class-validator';

export class DashboardOrderRejectDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ each: true })
  rejectedNotes?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ each: true })
  outOfStockProductsIds?: string[];
}
