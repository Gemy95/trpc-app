import { PartialType } from '@nestjs/swagger';
import { CreateTicketsTagReasonDto } from './create-tickets-tag-reason.dto';

export class UpdateTicketsTagReasonDto extends PartialType(CreateTicketsTagReasonDto) {}
