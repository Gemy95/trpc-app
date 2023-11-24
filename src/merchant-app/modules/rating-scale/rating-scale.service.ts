import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import mongoose from 'mongoose';

import { ERROR_CODES } from '../../../libs/utils/src';
import { GetAllDto } from '../common/dto/get-all.dto';
import { RatingScaleRepository } from '../models';
import { CreateRatingScaleDto } from './dto/create-rating-scale.dto';
import { UpdateRatingScaleDto } from './dto/update-rating-scale.dto';
import { RatingScale } from './entities/rating-scale.entity';
import { RatingScaleModule } from './rating-scale.module';

@Injectable()
export class RatingScaleService {
  constructor(private ratingScaleRepository: RatingScaleRepository) {}
  private logger = new Logger(RatingScaleModule.name);
  public create(createRatingScaleDto: CreateRatingScaleDto) {
    const newRatingScale = new RatingScale();
    newRatingScale.name = createRatingScaleDto.nameArabic;
    newRatingScale.translation = [
      {
        _lang: 'en',
        name: createRatingScaleDto.nameEnglish,
      },
    ];
    newRatingScale.image = createRatingScaleDto.image;
    newRatingScale.level = createRatingScaleDto.level;
    try {
      return this.ratingScaleRepository.create(newRatingScale);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public findAll(params: GetAllDto) {
    const { limit, page, paginate, sortBy, order } = params;
    return this.ratingScaleRepository.getAll({}, { limit, page, paginate, sort: { [sortBy]: order } });
  }

  public findOne(id: string) {
    return this.ratingScaleRepository.getById(id, { lean: true });
  }

  public async update(id: string, updateRatingScaleDto: UpdateRatingScaleDto) {
    const ratingScale = await this.findOne(id);
    if (!ratingScale) throw new NotFoundException(ERROR_CODES.err_rating_scale_not_found);
    const newRatingScale = new RatingScale();
    newRatingScale.name = updateRatingScaleDto.nameArabic ? updateRatingScaleDto.nameArabic : ratingScale.name;
    newRatingScale.translation = [
      {
        _lang: 'en',
        name: updateRatingScaleDto.nameEnglish ? updateRatingScaleDto.nameEnglish : ratingScale.translation[0].name,
      },
    ];
    newRatingScale.image = updateRatingScaleDto.image ? updateRatingScaleDto.image : ratingScale.image;
    return this.ratingScaleRepository.updateOne(
      {
        _id: new mongoose.Types.ObjectId(id),
      },
      newRatingScale,
      { lean: true, new: true },
    );
  }
}
