import { IsArray, IsNotEmpty, IsString, IsUrl, ValidateNested } from 'class-validator';
import { Translation } from '../../common/dto/Translation.dto';
import { Type } from 'class-transformer';

class BankTranslationDto extends Translation {
  @IsString()
  name: string;
}

export class CreateBankDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsUrl({ require_protocol: true, require_valid_protocol: true })
  @IsNotEmpty()
  logo: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => BankTranslationDto)
  translation: BankTranslationDto[];
}
