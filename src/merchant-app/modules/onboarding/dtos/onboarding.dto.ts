import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ForTypeEnum } from '../../models';
import { Translation } from '../../common/dto/Translation.dto';
import { DeviceTypeEnum } from '../enums/device-type.enum';
import { UserTypeEnum } from '../enums/user-type.enum';

export class OnBoardingTranslationDto extends Translation {
  @IsString()
  @ApiProperty()
  readonly title: string;

  @IsString()
  @ApiProperty()
  readonly description: string;
}

export class OnBoardingDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly description: string;

  @IsNotEmpty()
  @ApiProperty({ type: 'string' })
  image: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @Min(1)
  @Max(4)
  stepNum: number;

  @ValidateNested({ each: true })
  @Type(() => OnBoardingTranslationDto)
  @ApiProperty({ type: [OnBoardingTranslationDto] })
  readonly translation: [OnBoardingTranslationDto];
}

export class CreateOnBoardingStepDto {
  @ApiProperty()
  @IsUrl()
  @IsNotEmpty()
  image: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(250)
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(250)
  description: string;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(4)
  stepNum: number;

  @ApiProperty()
  translation: OnBoardingTranslationDto[];
}

export class QueryBoardingDto {
  @ApiProperty({ enum: ForTypeEnum })
  @IsString()
  @IsOptional()
  for_type: ForTypeEnum;
}

export class CreateOnBoardingDto {
  @IsEnum(ForTypeEnum)
  @IsOptional()
  @ApiProperty({ enum: ForTypeEnum })
  for_type: ForTypeEnum;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  steps: CreateOnBoardingStepDto[];
}

export class UpdateOnBoardingDto {
  @ApiProperty({ type: [OnBoardingDto] })
  @IsNotEmpty()
  @IsArray()
  steps: CreateOnBoardingStepDto[];
}

class RemoveStepNum {
  @ApiProperty()
  @IsNumber()
  stepNum: number;
}
export class RemoveBoardingStepsDto {
  @ApiProperty({ type: [RemoveStepNum] })
  @IsOptional()
  @IsArray()
  steps: RemoveStepNum[];
}
