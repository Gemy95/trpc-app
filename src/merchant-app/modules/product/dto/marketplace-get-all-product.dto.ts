import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { GetAllDto } from '../../common/dto/get-all.dto';

export class MarketplaceGetAllProductDto extends GetAllDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsMongoId()
  merchantId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsMongoId()
  categoryId?: string;
}
