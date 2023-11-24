import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketsTagDto } from './create-tickets-tag.dto';

export class UpdateTicketsTagDto extends PartialType(CreateTicketsTagDto) {}
