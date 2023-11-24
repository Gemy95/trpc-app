import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUrl } from 'class-validator';

export class UpdateSocialMediaDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_protocol: true, require_valid_protocol: true })
  twitterUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_protocol: true, require_valid_protocol: true })
  facebookUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_protocol: true, require_valid_protocol: true })
  websiteUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_protocol: true, require_valid_protocol: true })
  snapUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_protocol: true, require_valid_protocol: true })
  tiktokUrl?: string;
}
