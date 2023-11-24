import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { SETTING_MODEL_NAME } from '../../common/constants/setting.constants';
import { AMOUNT_TYPE } from '../../common/constants/order.constants';

export class CreateShoppexOrderTaxSettingDto {
  // @ApiProperty()
  // @IsEnum([SETTING_MODEL_NAME.Setting_ShoppexOrderTax])
  // @IsString()
  // @IsNotEmpty()
  // modelName: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ default: AMOUNT_TYPE.PERCENTAGE, enum: AMOUNT_TYPE, required: true })
  @IsNotEmpty()
  @IsEnum(AMOUNT_TYPE)
  type: AMOUNT_TYPE;
}
