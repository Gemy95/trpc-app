import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { MENU_UPLOAD_STATUS } from '../../common/constants/merchant';

export class DashboardUpdateMenuUploadDto {
  @ApiProperty({ default: MENU_UPLOAD_STATUS, enum: MENU_UPLOAD_STATUS, required: false })
  @IsNotEmpty()
  @IsEnum(MENU_UPLOAD_STATUS)
  menu_upload_status: string;
}
