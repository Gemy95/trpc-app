import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { OTP_VERIFICATION_TYPE } from '../../common/constants/users.types';
import { SETTING_MODEL_NAME } from '../../common/constants/setting.constants';

export class CreateVerificationTypeSettingDto {
  @ApiProperty({ description: 'Add Verification Type', type: String, enum: OTP_VERIFICATION_TYPE, example: 'mobile' })
  @IsEnum(OTP_VERIFICATION_TYPE)
  otp_verify_type: string;

  // @ApiProperty()
  // @IsEnum([SETTING_MODEL_NAME.Setting_Verification])
  // @IsString()
  // @IsNotEmpty()
  // modelName: string;
}
