import { Module } from '@nestjs/common';
import { RatingScaleService } from './rating-scale.service';
import { RatingScaleController } from './rating-scale.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RatingScale, RatingScaleRepository, RatingScaleSchema } from '../models';
import { RatingScaleResolver } from './rating-scale.resolver';

@Module({
  imports: [MongooseModule.forFeature([{ name: RatingScale.name, schema: RatingScaleSchema }])],
  controllers: [RatingScaleController],
  providers: [RatingScaleService, RatingScaleRepository, RatingScaleResolver],
})
export class RatingScaleModule {}
