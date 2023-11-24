import { Injectable, NotFoundException } from '@nestjs/common';
import mongoose from 'mongoose';

import { ERROR_CODES } from '../../../libs/utils/src';
import { GetAllDto } from '../common/dto/get-all.dto';
import { TicketTagRepository } from '../models';
import { CreateTicketsTagDto } from './dto/create-tickets-tag.dto';
import { UpdateTicketsTagDto } from './dto/update-tickets-tag.dto';
import { TicketTag } from './entities/tickets-tag.entity';

@Injectable()
export class TicketsTagService {
  constructor(private ticketTagRepository: TicketTagRepository) {}
  create(createTicketsTagDto: CreateTicketsTagDto) {
    const newTicketTag = new TicketTag();
    newTicketTag.description = createTicketsTagDto.descriptionArabic;
    newTicketTag.translation = [
      {
        _lang: 'en',
        description: createTicketsTagDto.descriptionEnglish,
      },
    ];
    return this.ticketTagRepository.create(newTicketTag);
  }

  findAll(params: GetAllDto) {
    const { limit, page, paginate, sortBy, order } = params;
    return this.ticketTagRepository.getAll({}, { limit, page, paginate, sort: { [sortBy]: order } });
  }

  findOne(id: string) {
    return this.ticketTagRepository.getById(id, { lean: true });
  }

  async update(id: string, updateTicketsTagDto: UpdateTicketsTagDto) {
    const tag = await this.findOne(id);
    if (!tag) throw new NotFoundException(ERROR_CODES.err_ticket_tag_not_found);
    const newTicketTag = new TicketTag();
    newTicketTag.description = updateTicketsTagDto.descriptionArabic
      ? updateTicketsTagDto.descriptionArabic
      : tag.description;
    newTicketTag.translation = [
      {
        _lang: 'en',
        description: updateTicketsTagDto.descriptionEnglish
          ? updateTicketsTagDto.descriptionEnglish
          : tag.translation[0].description,
      },
    ];
    return this.ticketTagRepository.updateOne({ _id: new mongoose.Types.ObjectId(id) }, newTicketTag, {
      lean: true,
      new: true,
    });
  }

  remove(id: string) {
    return this.ticketTagRepository.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { isDeleted: true },
      { lean: true, new: true },
    );
  }
}
