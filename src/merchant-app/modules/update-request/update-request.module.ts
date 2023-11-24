import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UpdateRequest, UpdateRequestSchema, UpdateRequestRepository } from '../models';

@Module({
  imports: [MongooseModule.forFeature([{ name: UpdateRequest.name, schema: UpdateRequestSchema }])],
  providers: [UpdateRequestRepository],
  exports: [UpdateRequestRepository],
})
export class UpdateRequestModule {}
