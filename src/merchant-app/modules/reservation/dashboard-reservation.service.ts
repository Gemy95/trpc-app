import { InjectQueue } from '@nestjs/bull';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Queue } from 'bull';
import * as _ from 'lodash';

import { ERROR_CODES } from '../../../libs/utils/src';
import {
  RESERVATION_CANCELED_BY_EMPLOYEE_STATUS,
  RESERVATION_CANCELED_BY_SHOPPEX_STATUS,
} from '../common/constants/reservation.constants';
import { GetAllDto } from '../common/dto/get-all.dto';
import { BranchRepository, MerchantEmployee, Owner, ReservationRepository, ShoppexEmployee } from '../models';
import { CancelOneReservationDto } from './dto/cancel-one-reservation.dto';
import { CreateLocalReservationToClientDto } from './dto/create-local-reservation-to-client.dto';
import { DeleteOneReservationDto } from './dto/delete-one-reservation.dto';
import { GetOneReservationDto } from './dto/get-one-reservation.dto';
import { CREATE_RESERVATION_PROCESSOR, RESERVATION_QUEUE } from './reservation.constants';
import { SharedReservationService } from './reservation.shared.service';

@Injectable()
export class DashboardReservationService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly branchRepository: BranchRepository,
    @InjectQueue(RESERVATION_QUEUE) private readonly reservationQueue: Queue,
    private sharedReservationService: SharedReservationService,
  ) {}

  async create(createReservationDto: CreateLocalReservationToClientDto) {
    const { clientId } = createReservationDto;

    const reservationRefId = await this.sharedReservationService._generateReservationRefId();

    const reservation: any = await this.reservationRepository.create({
      ...createReservationDto,
      clientId,
      reservationRefId,
    });

    await this.reservationQueue.add(CREATE_RESERVATION_PROCESSOR, reservation, {
      delay: 3 * 1000 * 60,
      jobId: `${reservation._id}- ${clientId}`,
    });

    return reservation;
  }

  async getBranchReservations(branchId: string, getAllReservationsDto: GetAllDto) {
    const { limit, order, page, sortBy } = getAllReservationsDto;

    const branch = await this.branchRepository.getOne({ _id: branchId });

    if (_.isNil(branch)) {
      throw new NotFoundException(ERROR_CODES.err_branch_not_found);
    }

    const query: any = { isDeleted: false, branchId };

    return this.reservationRepository.getAll(query, {
      limit,
      page,
      paginate: true,
      sort: { [sortBy]: order },
    });
  }

  async getOneReservation(params: GetOneReservationDto, branchId: string) {
    const { id } = params;

    const reservation = await this.reservationRepository.getOne({
      _id: id,
      branchId,
      isDeleted: false,
    });

    if (!reservation) {
      throw new NotFoundException(ERROR_CODES.err_reservation_not_found);
    }

    return reservation;
  }

  async remove(params: DeleteOneReservationDto, branchId: string) {
    const { id } = params;

    const reservation = await this.reservationRepository.updateOne(
      {
        _id: id,
        branchId,
        isDeleted: false,
      },
      { isDeleted: true },
      { new: true, lean: true },
    );

    if (!reservation) {
      throw new NotFoundException(ERROR_CODES.err_reservation_not_found);
    }

    return reservation;
  }

  async cancel(params: CancelOneReservationDto, branchId: string, user: any) {
    const cancelByMap = {
      [MerchantEmployee.name]: RESERVATION_CANCELED_BY_EMPLOYEE_STATUS,
      [Owner.name]: RESERVATION_CANCELED_BY_EMPLOYEE_STATUS,
      [ShoppexEmployee.name]: RESERVATION_CANCELED_BY_SHOPPEX_STATUS,
    };

    const { type } = user;
    const { id } = params;

    const reservation = await this.reservationRepository.updateOne(
      {
        _id: id,
        branchId,
        isDeleted: false,
      },
      { status: cancelByMap[type] },
      { new: true, lean: true },
    );

    if (!reservation) {
      throw new NotFoundException(ERROR_CODES.err_reservation_not_found);
    }

    return reservation;
  }
}
