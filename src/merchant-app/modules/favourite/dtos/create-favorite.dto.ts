import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsMongoId, IsOptional } from 'class-validator';

export class CreateFavoriteDto {
  @ApiProperty()
  @IsString()
  @IsMongoId()
  merchantId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  branchId: string;
}
