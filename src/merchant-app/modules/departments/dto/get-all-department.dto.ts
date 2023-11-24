import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { GetAllDto } from '../../common/dto/get-all.dto';

export class GetAllDepartmentsDto extends GetAllDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => String)
  @IsString({ each: true })
  @Transform(({ obj }) => obj.tags.split(','))
  tags?: string[];
}
