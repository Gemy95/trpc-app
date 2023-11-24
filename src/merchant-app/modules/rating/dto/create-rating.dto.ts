import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateRatingDto {
  @ApiPropertyOptional()
  @IsBoolean()
  ignore?: boolean = false;

  @ApiPropertyOptional()
  @IsMongoId()
  rating?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  extraNote?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  comment?: string;
}
