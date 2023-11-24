import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { StorageService } from '../../storage.service';
import { OnBoarding, OnBoardingRepository, OnBoardingSchema } from '../models';
import { OnBoardingController } from './onboarding.controller';
import { OnboardingResolver } from './onboarding.resolver';
import { OnBoardingService } from './onboarding.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: OnBoarding.name, schema: OnBoardingSchema }])],
  controllers: [OnBoardingController],
  providers: [StorageService, OnBoardingService, OnBoardingRepository, OnboardingResolver],
  exports: [OnBoardingRepository],
})
export class OnboardingModule {}
