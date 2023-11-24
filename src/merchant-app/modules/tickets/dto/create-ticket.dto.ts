import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsString } from 'class-validator';

import { TicketScope } from '../../common/constants/ticket.constants';

export class CreateTicketDto {
  @ApiProperty()
  @IsMongoId()
  tag: string;

  @ApiProperty()
  @IsMongoId()
  reason: string;

  @ApiPropertyOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @IsString()
  clientNotes: string;

  @ApiPropertyOptional({ enum: TicketScope })
  @IsEnum(TicketScope)
  scope: string;
}
