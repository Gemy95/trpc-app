import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';

import { GetAllDto } from '../../common/dto/get-all.dto';
import { EMPLOYEE_STATUS } from '../interface/status.enum';

export class getShoppexEmployeesDto extends GetAllDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  employeeName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  employeeEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  employeeMobile?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ each: true })
  @Type(() => String)
  @IsMongoId({ each: true })
  departments?: string[];

  @ApiPropertyOptional({ enum: EMPLOYEE_STATUS })
  @IsOptional()
  @IsEnum(EMPLOYEE_STATUS)
  status?: EMPLOYEE_STATUS;
}
