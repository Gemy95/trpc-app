import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { SETTING_MODEL_NAME } from '../../common/constants/setting.constants';

export class CreateTimeAfterDeliveredOrderSettingDto {
  // @ApiProperty()
  // @IsEnum([SETTING_MODEL_NAME.Setting_Order])
  // @IsString()
  // @IsNotEmpty()
  // modelName: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  TimeAfterDeliveredOrder: number;
}
