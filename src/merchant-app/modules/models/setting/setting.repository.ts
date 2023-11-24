import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Setting } from '../../../../libs/database/src/lib/models/setting/setting.schema';
import { BaseRepository } from '../BaseRepository';

@Injectable()
export class SettingRepository extends BaseRepository<Setting> {
  constructor(
    @InjectModel('Setting')
    private readonly nDistanceModel: Model<Setting>,
  ) {
    super(nDistanceModel);
  }
}
