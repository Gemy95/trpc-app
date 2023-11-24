import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateTicketDto } from './create-ticket.dto';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  internalNotes: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status: string;
}
