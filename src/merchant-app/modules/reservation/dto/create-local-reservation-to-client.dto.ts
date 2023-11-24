import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Validate } from 'class-validator';
import { IsMongoObjectId } from '../../lib/mongodb-helper';
import { CreateReservationDto } from './create-reservation.dto';

export class CreateLocalReservationToClientDto extends CreateReservationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Validate(IsMongoObjectId)
  clientId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  clientName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  clientMobile?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isWaitingList?: boolean;
}
