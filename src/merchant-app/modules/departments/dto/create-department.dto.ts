import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateDepartmentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nameEnglish: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nameArabic: string;

  @ApiProperty()
  @IsOptional()
  // @IsUUID('all')
  uuid: string;

  @ApiProperty()
  @IsOptional()
  @IsUrl({ require_protocol: true, require_valid_protocol: true })
  image: string;

  @ApiProperty({ type: [String] })
  @IsOptional()
  oneSignalTags: string[];
}
