import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { SETTING_MODEL_NAME } from '../../common/constants/setting.constants';
import { CreateBranchDistanceSettingDto } from './create-branch-distance-setting.dto';

export class UpdateDistanceDto extends PartialType(CreateBranchDistanceSettingDto) {
  @ApiProperty({ enum: SETTING_MODEL_NAME })
  @IsEnum(SETTING_MODEL_NAME)
  @IsString()
  @IsNotEmpty()
  modelName: string;
}
