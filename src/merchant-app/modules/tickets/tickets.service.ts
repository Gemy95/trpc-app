import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { TICKET_MERCHANT_SCOPE } from '../common/constants/ticket.constants';
import { GetAllDto } from '../common/dto/get-all.dto';
import generateFilters from '../common/utils/generate-filters';
import { TicketRepository } from '../models';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { GetAllForOperation } from './dto/get-all-for-operation.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './entities/ticket.entity';

@Injectable()
export class TicketsService {
  constructor(private ticketRepository: TicketRepository) {}
  public create(user: any, createTicketDto: CreateTicketDto) {
    const newTicket = new Ticket();
    newTicket.clientNotes = createTicketDto.clientNotes ? [createTicketDto.clientNotes] : undefined;
    newTicket.tag = new mongoose.Types.ObjectId(createTicketDto.tag);
    newTicket.reason = new mongoose.Types.ObjectId(createTicketDto.reason);
    newTicket.createdBy = new mongoose.Types.ObjectId(user?._id);
    newTicket.description = createTicketDto.description;
    newTicket.scope = createTicketDto.scope;
    return this.ticketRepository.create(newTicket);
  }

  public findAllForMerchant(merchantId: string, params: GetAllDto) {
    const { limit, page, paginate, sortBy, order } = params;
    return this.ticketRepository.getAll(
      {
        scope: TICKET_MERCHANT_SCOPE,
        merchantId: new mongoose.Types.ObjectId(merchantId),
      },
      {
        limit,
        page,
        paginate,
        sort: { [sortBy]: order },
        populate: ['tag', 'reason'],
      },
    );
  }

  public findAllForOperation(params: GetAllForOperation) {
    const { limit, page, paginate, sortBy, order, ...rest } = params;
    const generatedMatch = generateFilters(rest);

    if (generatedMatch['merchant']) {
      delete Object.assign(generatedMatch, {
        'merchant._id': generatedMatch['merchant'],
      })['merchant'];
    }

    return this.ticketRepository.getAll(generatedMatch, {
      limit,
      page,
      paginate,
      sort: { [sortBy]: order },
      populate: ['tag', 'reason'],
    });
  }

  public findOne(id: string) {
    return this.ticketRepository.getById(id, { lean: true });
  }

  public async update(id: string, updateTicketDto: UpdateTicketDto) {
    const ticket = await this.findOne(id);
    const newTicket = new Ticket();
    updateTicketDto.internalNotes ? ticket.internalNotes.push(updateTicketDto.internalNotes) : null;

    updateTicketDto.clientNotes ? ticket.clientNotes.push(updateTicketDto.clientNotes) : null;

    newTicket.internalNotes = ticket.internalNotes;
    newTicket.clientNotes = ticket.clientNotes;
    newTicket.status = updateTicketDto.status && updateTicketDto.status;
    return this.ticketRepository.updateOne(
      {
        _id: new mongoose.Types.ObjectId(id),
      },
      newTicket,
      { lean: true, new: true },
    );
  }

  public remove(id: string) {
    return this.ticketRepository.updateOne(
      {
        _id: new mongoose.Types.ObjectId(id),
      },
      { isDeleted: true },
      { lean: true, new: true },
    );
  }
}
