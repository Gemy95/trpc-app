import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PAYMENT_TYPES } from '../../common/constants/common.constants';
import { ORDER_TYPE } from '../../common/constants/order.constants';

class Options {
  @ApiProperty()
  @IsMongoId()
  _id: any;

  name?: string;
  extraPrice?: number;
}

class Groups {
  @ApiProperty({ type: String })
  @IsMongoId()
  productGroupId: any;

  @ApiProperty({ type: [Options] })
  @IsOptional()
  @IsArray()
  // @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => Options)
  options: Options[];
}
export class Item {
  @ApiProperty()
  @IsNumber()
  count: number;

  @ApiProperty({ type: String })
  @IsMongoId()
  productId: any;

  @ApiPropertyOptional({ type: [Groups] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Groups)
  groups?: Groups[];
}

export class CreateOrderDto {
  @ApiProperty()
  @IsMongoId()
  branchId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ArrayNotEmpty()
  @IsString({ each: true })
  clientNotes?: string[];

  @ApiProperty({ example: PAYMENT_TYPES.PAYMENT_CASH_TYPE, enum: PAYMENT_TYPES })
  @IsEnum(PAYMENT_TYPES)
  paymentType: string;

  @ApiPropertyOptional({ example: ORDER_TYPE.ORDER_DINING, enum: ORDER_TYPE })
  @IsOptional()
  @IsEnum([
    ORDER_TYPE.ORDER_DINING,
    ORDER_TYPE.ORDER_CAR_PICKUP,
    ORDER_TYPE.ORDER_PICKUP,
    ORDER_TYPE.ORDER_DELIVERY,
    ORDER_TYPE.ORDER_BOOK,
  ])
  orderType: string;

  @ApiProperty({ type: [Item] })
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Item)
  items: Item[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  tableId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  couponCode?: string;
}
