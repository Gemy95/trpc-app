import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsMongoId, IsOptional, IsString } from 'class-validator';

export class DashboardOrderAcceptedDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  estimatedPreparationTime?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  @IsString()
  driverId?: string;
}
