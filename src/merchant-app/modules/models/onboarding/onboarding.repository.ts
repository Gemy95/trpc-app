import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { OnBoarding } from '../../../../libs/database/src/lib/models/onboarding/onboarding.schema';
import { EntityRepository } from '../../database/entity.repo';
import { DeviceTypeEnum } from '../../onboarding/enums/device-type.enum';
import { UserTypeEnum } from '../../onboarding/enums/user-type.enum';
import { BaseRepository } from '../BaseRepository';

@Injectable()
export class OnBoardingRepository extends EntityRepository<OnBoarding> {
  constructor(@InjectModel(OnBoarding.name) userModel: Model<OnBoarding>) {
    super(userModel);
  }
}
