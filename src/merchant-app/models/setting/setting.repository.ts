import { BaseRepository } from '../BaseRepository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Setting } from '../../../libs/database/src/lib/models/setting/setting.schema';

@Injectable()
export class SettingRepository extends BaseRepository<Setting> {
  constructor(
    @InjectModel('Setting')
    private readonly nDistanceModel: Model<Setting>,
  ) {
    super(nDistanceModel);
  }
}
