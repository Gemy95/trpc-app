import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min, Max, IsEnum } from 'class-validator';
import { SETTING_MODEL_NAME } from '../../common/constants/setting.constants';

export class CreateBranchGroupDistanceSettingDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  minDistance: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  maxDistance: number;

  // @ApiProperty()
  // @IsEnum([SETTING_MODEL_NAME.Setting_BranchGroup])
  // @IsString()
  // @IsNotEmpty()
  // modelName: string;
}
