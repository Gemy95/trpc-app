import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsOptional } from 'class-validator';

import { ORDER_TYPE } from '../../common/constants/order.constants';
import { CreateOrderDto } from './create-order.dto';

export class DashboardCreateOrderDto extends OmitType(CreateOrderDto, ['orderType'] as const) {
  @ApiPropertyOptional({ example: ORDER_TYPE.ORDER_DINING, enum: ORDER_TYPE })
  @IsOptional()
  @IsEnum(ORDER_TYPE)
  orderType: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  clientId?: string;
}
