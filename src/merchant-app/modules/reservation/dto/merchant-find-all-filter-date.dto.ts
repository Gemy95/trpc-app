import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class MerchantFindAllReservationByDateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fromCreatedAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  toCreatedAt?: Date;
}
