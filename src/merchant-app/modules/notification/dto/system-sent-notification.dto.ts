import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ONE_SIGNAL_FILTERS, ACTION, USER_TYPES } from '../../common/constants/notification.constant';

class Languages {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  en?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ar?: string;
}

export class SystemSentNotificationDto {
  @ApiProperty()
  @IsOptional()
  @IsMongoId()
  sender?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(USER_TYPES)
  senderType?: string = USER_TYPES.SYSTEM;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId({ each: true })
  @ArrayMinSize(1)
  receiver?: string[];

  @ApiProperty({ type: String, enum: ACTION })
  @IsEnum(ACTION)
  action: string;

  @ApiProperty()
  @IsMongoId()
  target: string;

  @ApiProperty()
  @IsOptional()
  @IsMongoId()
  branch?: string;

  @ApiProperty()
  @IsOptional()
  @IsMongoId()
  merchant?: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => Languages)
  content: Languages;

  @ApiProperty()
  @ValidateNested()
  @Type(() => Languages)
  title: Languages;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sound?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  oneSignalId?: string;

  @ApiPropertyOptional({ type: [String], enum: ONE_SIGNAL_FILTERS })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  oneSignalFilters?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  useOneSignal?: boolean = true;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @Type(() => String)
  notes?: string[];

  @ApiProperty()
  @IsOptional()
  @IsMongoId()
  product?: string;
}
