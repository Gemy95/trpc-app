import { OmitType, PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID, Length } from 'class-validator';

import { Gender } from '../../common/constants/users.types';
import { CreateOwnerDto } from './create-owner.dto';

export class UpdateOwnerByItselfDto extends PartialType(
  OmitType(CreateOwnerDto, ['email', 'mobile', 'countryCode', 'password', 'uuid', 'countryId'] as const),
) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(8, 50, {
    message: 'password must be at least 8 characters and max 50 characters',
  })
  oldPassword?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(8, 50, {
    message: 'password must be at least 8 characters and max 50 characters',
  })
  newPassword?: string;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('all')
  uuid?: string;
}
