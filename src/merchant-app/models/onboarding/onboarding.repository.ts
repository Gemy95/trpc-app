import { BaseRepository } from '../BaseRepository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
// import { UserTypeEnum } from '../../onboarding/enums/user-type.enum';
// import { DeviceTypeEnum } from '../../onboarding/enums/device-type.enum';
// import { EntityRepository } from '../../database/entity.repo';
import { OnBoarding } from '../../../libs/database/src/lib/models/onboarding/onboarding.schema';

@Injectable()
export class OnBoardingRepository extends BaseRepository<OnBoarding> {
  constructor(@InjectModel(OnBoarding.name) userModel: Model<OnBoarding>) {
    super(userModel);
  }
}
