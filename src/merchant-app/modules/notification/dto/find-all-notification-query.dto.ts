import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsDate, IsMongoId, IsString, IsEnum, IsBoolean } from 'class-validator';
import { PLATFORM } from '../../common/constants/notification.constant';
import { GetAllDto } from '../../common/dto/get-all.dto';

export class FindAllNotificationQuery extends PartialType(GetAllDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => new Date(new Date(value).setHours(0, 0, 0, 0)))
  @IsDate()
  fromCreatedAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => new Date(new Date(value).setHours(23, 59, 59, 999)))
  @IsDate()
  toCreatedAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  target?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId({ each: true })
  @IsString({ each: true })
  @Transform(({ value }) => value.split(','))
  merchants?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId({ each: true })
  @IsString({ each: true })
  @Transform(({ value }) => value.split(','))
  branches?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  action?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(PLATFORM)
  platform?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  useOneSignal?: boolean;
}
