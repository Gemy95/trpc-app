import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { MERCHANT_EMPLOYEE_JOB } from '../../common/constants/merchant-employee';
import { GetAllDto } from '../../common/input/get-all.dto';

export class FindAllMerchantEmployeeByMerchantIdDto extends PartialType(GetAllDto) {
  @ApiProperty({
    description: 'List of jobs',
    isArray: true,
    enum: MERCHANT_EMPLOYEE_JOB,
  })
  @IsOptional()
  @IsEnum(MERCHANT_EMPLOYEE_JOB, { each: true })
  job?: MERCHANT_EMPLOYEE_JOB[];
}
