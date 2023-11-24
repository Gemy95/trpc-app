import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import {
  RESERVATION_PENDING_STATUS,
  RESERVATION_CANCELED_BY_SYSTEM_STATUS,
  RESERVATION_WAITING_STATUS,
} from '../common/constants/reservation.constants';
import { ReservationRepository } from '../models/reservation/reservation.repository';
import { CREATE_RESERVATION_PROCESSOR, RESERVATION_QUEUE } from './reservation.constants';

@Processor(RESERVATION_QUEUE)
export class ReservationProcessor {
  constructor(private readonly reservationRepository: ReservationRepository) {}

  @Process(CREATE_RESERVATION_PROCESSOR)
  async handleCreateReservation(job: Job) {
    const { _id } = job.data;

    await this.reservationRepository.updateOne(
      { _id: _id, status: { $in: [RESERVATION_PENDING_STATUS, RESERVATION_WAITING_STATUS] } },
      { status: RESERVATION_CANCELED_BY_SYSTEM_STATUS, isWaitingList: false },
      { lean: true, new: true },
    );
  }
}
