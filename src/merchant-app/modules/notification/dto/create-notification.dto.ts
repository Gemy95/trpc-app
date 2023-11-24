import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ONE_SIGNAL_FILTERS, PLATFORM } from '../../common/constants/notification.constant';

class Languages {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  en: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ar: string;
}

export class CreateNotificationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId({ each: true })
  @ArrayMinSize(1)
  receiver?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  branch?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  merchant?: string;

  @ApiPropertyOptional({ type: String, enum: PLATFORM })
  @IsOptional()
  @IsArray()
  @IsEnum(PLATFORM)
  @ArrayMinSize(1)
  platform?: string[];

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
  subtitle?: Languages;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sound?: string;

  @ApiPropertyOptional({ type: [String], enum: ONE_SIGNAL_FILTERS })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  oneSignalFilters?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  useOneSignal?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  radius?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @Type(() => String)
  notes?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  product?: string;
}
