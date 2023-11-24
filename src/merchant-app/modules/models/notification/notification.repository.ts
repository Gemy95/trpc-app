import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Notification } from '../../../../libs/database/src/lib/models/notification/notification.schema';
import { BaseRepository } from '../BaseRepository';

@Injectable()
export class NotificationRepository extends BaseRepository<Notification> {
  constructor(
    @InjectModel(Notification.name)
    private readonly nModel: Model<Notification>,
  ) {
    super(nModel);
  }
}
