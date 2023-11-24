import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ticket, TicketRepository, TicketSchema } from '../models';
import { TicketsResolver } from './tickets.resolver';

@Module({
  imports: [MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }])],
  controllers: [TicketsController],
  providers: [TicketsService, TicketRepository, TicketsResolver],
})
export class TicketsModule {}
