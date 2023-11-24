import { Injectable, NotFoundException } from '@nestjs/common';
import mongoose from 'mongoose';

import { ERROR_CODES } from '../../../libs/utils/src';
import { GetAllDto } from '../common/dto/get-all.dto';
import { TagReasonRepository } from '../models';
import { CreateTicketsTagReasonDto } from './dto/create-tickets-tag-reason.dto';
import { UpdateTicketsTagReasonDto } from './dto/update-tickets-tag-reason.dto';
import { TagReason } from './entities/ticket-tag-reason.entity';

@Injectable()
export class TicketsTagReasonService {
  constructor(private ticketTagReasonRepository: TagReasonRepository) {}
  public create(tag: string, createTicketsTagReasonDto: CreateTicketsTagReasonDto) {
    const newTagReason = new TagReason();
    newTagReason.description = createTicketsTagReasonDto.descriptionArabic;
    newTagReason.translation = [
      {
        _lang: 'en',
        description: createTicketsTagReasonDto.descriptionEnglish,
      },
    ];
    newTagReason.tag = new mongoose.Types.ObjectId(tag);
    return this.ticketTagReasonRepository.create(newTagReason);
  }

  public findAll(tag: string, params: GetAllDto) {
    const { limit, page, paginate, sortBy, order } = params;
    return this.ticketTagReasonRepository.getAll(
      { tag: new mongoose.Types.ObjectId(tag) },
      { limit, page, paginate, sort: { [sortBy]: order }, populate: ['tag'] },
    );
  }

  public findForDashboard(params: GetAllDto) {
    const { limit, page, paginate, sortBy, order } = params;

    return this.ticketTagReasonRepository.getAll(
      {},
      { limit, page, paginate, sort: { [sortBy]: order }, populate: ['tag'] },
    );
  }

  public async update(id: string, updateTicketsTagReasonDto: UpdateTicketsTagReasonDto) {
    const tagReason = await this.ticketTagReasonRepository.getById(id, { lean: true });
    if (!tagReason) throw new NotFoundException(ERROR_CODES.err_ticket_tag_reason_not_found);
    const newTagReason = new TagReason();
    newTagReason.description = updateTicketsTagReasonDto.descriptionArabic
      ? updateTicketsTagReasonDto.descriptionArabic
      : tagReason.description;
    newTagReason.translation = [
      {
        _lang: 'en',
        description: updateTicketsTagReasonDto.descriptionEnglish
          ? updateTicketsTagReasonDto.descriptionEnglish
          : tagReason.translation[0].description,
      },
    ];
    return this.ticketTagReasonRepository.updateOne({ _id: new mongoose.Types.ObjectId(id) }, newTagReason, {
      lean: true,
      new: true,
    });
  }

  public remove(id: string) {
    return this.ticketTagReasonRepository.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { isDeleted: true },
      { lean: true, new: true },
    );
  }
}
