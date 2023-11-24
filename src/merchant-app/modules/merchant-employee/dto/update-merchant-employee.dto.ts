import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { MERCHANT_EMPLOYEE_ACTIVE_STATUS, MERCHANT_EMPLOYEE_STATUS } from '../../common/constants/merchant-employee';
import { CreateMerchantEmployeeDto } from './create-merchant-employee.dto';

export class UpdateMerchantEmployeeDto extends PartialType(CreateMerchantEmployeeDto) {
  @ApiPropertyOptional({
    default: MERCHANT_EMPLOYEE_ACTIVE_STATUS,
    enum: MERCHANT_EMPLOYEE_STATUS,
    required: true,
  })
  @IsOptional()
  @IsEnum(MERCHANT_EMPLOYEE_STATUS)
  status?: string;
}
