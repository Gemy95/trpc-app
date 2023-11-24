import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { GetAllDto } from '../../common/input/get-all.dto';

export class GetAllDepartmentsDto extends GetAllDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => String)
  @IsString({ each: true })
  tags?: string[];
}
