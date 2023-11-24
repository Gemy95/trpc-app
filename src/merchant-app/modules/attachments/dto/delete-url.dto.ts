import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsUrl, ValidateNested } from 'class-validator';

class ImageData {
  @ApiProperty({ type: String })
  @IsUrl({ require_protocol: true, require_valid_protocol: true })
  url: string;
}

export class DeleteUrlDto {
  @ApiProperty({ type: [ImageData] })
  @ValidateNested({ each: true })
  @Type(() => ImageData)
  images: ImageData[];
}
