import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { ReviewRepository } from '../models';

@Injectable()
export class RequestsService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  public findAllRequests(query) {
    return this.reviewRepository.findAllRequests(query);
  }

  public findOne(id: string) {
    return this.reviewRepository.getOne({
      reference: new mongoose.Types.ObjectId(id),
    });
  }
}
