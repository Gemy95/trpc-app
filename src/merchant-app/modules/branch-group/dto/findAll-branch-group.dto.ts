import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import { GetAllDto } from '../../common/input/get-all.dto';

export class FindAllBranchGroupDto extends PartialType(GetAllDto) {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsMongoId({ each: true })
  @Type(() => String)
  citiesIds?: string[];
}
