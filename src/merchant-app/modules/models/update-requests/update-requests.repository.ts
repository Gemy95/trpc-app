import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UpdateRequest } from '../../../../libs/database/src/lib/models/update-requests/update-requests.schema';
import { BaseRepository } from '../BaseRepository';

@Injectable()
export class UpdateRequestRepository extends BaseRepository<UpdateRequest> {
  constructor(
    @InjectModel(UpdateRequest.name)
    private readonly nModel: Model<UpdateRequest>,
  ) {
    super(nModel);
  }
}
