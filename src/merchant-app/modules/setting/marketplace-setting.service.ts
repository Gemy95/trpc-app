import { Injectable } from '@nestjs/common';
import { SettingRepository } from '../models/setting/setting.repository';

@Injectable()
export class MarketplaceSettingService {
  constructor(private readonly settingRepository: SettingRepository) {}

  async getOneByModelName(modelName: string) {
    return this.settingRepository.getOne({ modelName });
  }
}
