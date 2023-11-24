import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsOptional } from 'class-validator';

import { TicketScope } from '../../common/constants/ticket.constants';
import { GetAllDto } from '../../common/dto/get-all.dto';

export class GetAllForOperation extends PartialType(GetAllDto) {
  @ApiPropertyOptional({ enum: TicketScope })
  @IsOptional()
  @IsEnum(TicketScope)
  scope: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  merchant: string;
}
