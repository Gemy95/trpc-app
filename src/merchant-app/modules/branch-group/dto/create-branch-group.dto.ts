import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsString, IsUrl, Length, ValidateNested } from 'class-validator';
import { Translation } from '../../common/dto/Translation.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// class BranchGroupTranslationDto extends Translation {
//   @IsString()
//   name: string;
// }

export class CreateBranchGroupDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nameArabic: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nameEnglish: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @ApiProperty()
  @IsMongoId()
  @IsString()
  @IsNotEmpty()
  city: string;

  // @ApiProperty()
  // @IsNotEmpty()
  // @ValidateNested({ each: true })
  // @Type(() => BranchGroupTranslationDto)
  // translation: BranchGroupTranslationDto[];
}
