import { PartialType } from '@nestjs/mapped-types';
import { GetAllDto } from '../../common/input/get-all.dto';
import { MENU_UPLOAD_STATUS } from '../../common/constants/merchant';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class MenuUploadFilterDto extends PartialType(GetAllDto) {
  @ApiPropertyOptional({ enum: MENU_UPLOAD_STATUS, required: false })
  @IsOptional()
  @IsEnum(MENU_UPLOAD_STATUS)
  menu_upload_status?: string;
}
