import { Module } from '@nestjs/common';
import { TicketsTagReasonService } from './tickets-tag-reason.service';
import { TicketsTagReasonController } from './tickets-tag-reason.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TagReason, TagReasonRepository, TagReasonSchema } from '../models';
import { TicketsTagReasonResolver } from './tickets-tag-reason.resolver';

@Module({
  imports: [MongooseModule.forFeature([{ name: TagReason.name, schema: TagReasonSchema }])],
  controllers: [TicketsTagReasonController],
  providers: [TicketsTagReasonService, TagReasonRepository, TicketsTagReasonResolver],
})
export class TicketsTagReasonModule {}
