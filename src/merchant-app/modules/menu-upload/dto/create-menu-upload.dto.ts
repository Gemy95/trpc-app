import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';

export class MenuUploadImageDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsUrl({ require_protocol: true, require_valid_protocol: true })
  url: string;
}

export class CreateMenuUploadDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  mobile: string;

  @ApiProperty({ type: [MenuUploadImageDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => MenuUploadImageDto)
  images: MenuUploadImageDto[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  notes?: string;
}
