import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Rating, RatingRepository, RatingSchema } from '../models';
import { OrderModule } from '../order/order.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RatingResolver } from './rating.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Rating.name, schema: RatingSchema }]),
    OrderModule,
    ClientsModule.register([
      {
        name: 'ACTIVITIES',
        transport: Transport.TCP,
      },
    ]),
  ],
  controllers: [RatingController],
  providers: [RatingService, RatingRepository, RatingResolver],
})
export class RatingModule {}
