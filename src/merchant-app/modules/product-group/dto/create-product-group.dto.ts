import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { STATUS } from '../../common/constants/status.constants';

export class OptionDto {
  @ApiProperty()
  @IsString()
  nameArabic: string;

  @ApiProperty()
  @IsString()
  nameEnglish: string;

  @ApiProperty()
  @IsNumber()
  extraPrice: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  serialDisplayNumber: number;
}

export class CreateProductGroupDto {
  @ApiProperty()
  @IsString({ message: 'nameEnglish must be a string' })
  @Length(1)
  nameEnglish: string;

  @ApiProperty()
  @IsString({ message: 'nameArabic must be a string' })
  @Length(1)
  nameArabic: string;

  @ApiProperty()
  @IsNumber()
  minimum: number;

  @ApiProperty()
  @IsNumber()
  maximum: number;

  @ApiProperty({
    type: [OptionDto],
    description: 'Array should take one and only one option object',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  options: OptionDto[];

  @ApiProperty({ default: true })
  @IsBoolean()
  required: boolean;

  @ApiProperty({ enum: STATUS, example: STATUS.ACTIVE })
  @IsEnum(STATUS)
  status: STATUS;
}
