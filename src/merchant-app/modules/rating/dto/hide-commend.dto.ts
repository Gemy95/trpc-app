import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsMongoId, IsOptional, IsString } from 'class-validator';

export class HideCommentRatingDto {
  @ApiProperty()
  @IsBoolean()
  is_public?: boolean;
}
