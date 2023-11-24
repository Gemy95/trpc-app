import { Module } from '@nestjs/common';
import { TicketsTagService } from './tickets-tag.service';
import { TicketsTagController } from './tickets-tag.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketTag, TicketTagRepository, TicketTagSchema } from '../models';
import { TicketsTagResolver } from './tickets-tag.resolver';

@Module({
  imports: [MongooseModule.forFeature([{ name: TicketTag.name, schema: TicketTagSchema }])],
  controllers: [TicketsTagController],
  providers: [TicketsTagService, TicketTagRepository, TicketsTagResolver],
})
export class TicketsTagModule {}
