import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { BaseRepository } from '../BaseRepository';
import { Counter } from '../../../libs/database/src/lib/models/counter/counter.schema';

@Injectable()
export class CounterRepository extends BaseRepository<Counter> {
  constructor(
    @InjectModel(Counter.name)
    private readonly nModel: Model<Counter>,
  ) {
    super(nModel);
  }

  async counter(counterName: string) {
    const year = new Date().getFullYear();
    const seqStart = parseInt(`${year.toString().slice(2)}000001`);

    const validateOldSeq = await this.getOne(
      {
        name: counterName,
      },
      { new: true },
    );

    if (validateOldSeq?.seq && validateOldSeq.seq?.toString().slice(0, 2) != year.toString().slice(2)) {
      const updateNewYearSeq = await this.nModel.findOneAndUpdate(
        {
          name: counterName,
        },
        {
          seq: seqStart,
        },
        {
          new: true,
        },
      );
      return updateNewYearSeq.seq;
    }

    let updateSeq: Document<unknown, any, Counter> & Counter & { _id: Types.ObjectId };
    updateSeq = await this.nModel.findOneAndUpdate(
      {
        name: counterName,
      },
      {
        $inc: { seq: 1 },
      },
      {
        new: true,
      },
    );

    if (updateSeq == null) {
      updateSeq = await this.nModel.create({
        name: counterName,
        seq: seqStart,
      });
    }

    return updateSeq.seq;
  }
}
