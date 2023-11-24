import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsMongoId, IsOptional } from 'class-validator';

export class UploadFileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  merchantId?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isOperation?: boolean;
}
