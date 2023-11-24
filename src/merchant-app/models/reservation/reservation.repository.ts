import { BaseRepository } from '../BaseRepository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Reservation } from '../../../libs/database/src/lib/models/reservation/reservation.schema';

@Injectable()
export class ReservationRepository extends BaseRepository<Reservation> {
  constructor(
    @InjectModel(Reservation.name)
    private readonly nModel: Model<Reservation>,
  ) {
    super(nModel);
  }
}
