import { ArrayNotEmpty, IsEnum, IsMongoId, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ORDER_TYPE } from '../../common/constants/order.constants';
import { Type } from 'class-transformer';
import { Item } from '../../order/dto/create-order.dto';

export class CheckCouponDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  clientId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ORDER_TYPE)
  orderType: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  branchId: string;

  @ApiProperty({ type: [Item] })
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Item)
  items: Item[];
}
