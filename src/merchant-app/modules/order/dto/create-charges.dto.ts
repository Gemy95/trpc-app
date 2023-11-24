import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { AMOUNT_TYPE } from '../../common/constants/order.constants';
import { Translation } from '../../common/input/Translation.dto';

class ChargesTranslationDto extends Translation {
  @IsString()
  @ApiProperty()
  readonly name: string;
}

export class ChargesDto {
  @ApiProperty({ default: 0 })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ example: AMOUNT_TYPE.FIXED, enum: AMOUNT_TYPE, default: AMOUNT_TYPE.FIXED })
  @IsNotEmpty()
  @IsEnum(AMOUNT_TYPE)
  type: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ type: [ChargesTranslationDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ChargesTranslationDto)
  translation?: ChargesTranslationDto[];
}
