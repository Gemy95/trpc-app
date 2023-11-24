import { BaseRepository } from '../BaseRepository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Ticket } from '../../../libs/database/src/lib/models/ticket/ticket.schema';

@Injectable()
export class TicketRepository extends BaseRepository<Ticket> {
  constructor(
    @InjectModel(Ticket.name)
    private readonly nModel: Model<Ticket>,
  ) {
    super(nModel);
  }
}
