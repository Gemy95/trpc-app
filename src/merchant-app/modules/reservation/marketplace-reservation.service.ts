import { InjectQueue } from '@nestjs/bull';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Queue } from 'bull';
import mongoose from 'mongoose';

import { ERROR_CODES } from '../../../libs/utils/src';
import { RESERVATION_CANCELED_BY_CLIENT_STATUS, RESERVATION_TYPE } from '../common/constants/reservation.constants';
import { GetAllDto } from '../common/dto/get-all.dto';
import generateFilters from '../common/utils/generate-filters';
import { BranchRepository, ReservationRepository } from '../models';
import { CancelOneReservationDto } from './dto/cancel-one-reservation.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { DeleteOneReservationDto } from './dto/delete-one-reservation.dto';
import { GetOneReservationDto } from './dto/get-one-reservation.dto';
import { MarketPlaceFindAllReservationDto } from './dto/marketplace-find-all-filter.dto';
import { CREATE_RESERVATION_PROCESSOR, RESERVATION_QUEUE } from './reservation.constants';
import { SharedReservationService } from './reservation.shared.service';

@Injectable()
export class MarketplaceReservationService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly branchRepository: BranchRepository,
    @InjectQueue(RESERVATION_QUEUE) private readonly reservationQueue: Queue,
    private readonly sharedReservationService: SharedReservationService,
  ) {}

  async create(createReservationDto: CreateReservationDto, user?: any) {
    const { _id, type } = user;

    const reservationRefId = await this.sharedReservationService._generateReservationRefId();

    const reservation = await this.reservationRepository.create({
      ...createReservationDto,
      user: new mongoose.Types.ObjectId(_id),
      type: type == 'Client' ? RESERVATION_TYPE.ORDER_BOOK : RESERVATION_TYPE.ORDER_OFFLINE_BOOK,
      reservationRefId,
    });

    await this.reservationQueue.add(CREATE_RESERVATION_PROCESSOR, reservation, {
      delay: 3600 * 1000, // cancel reservation after 1 hour
      jobId: `${reservation['_id']}`,
    });

    return reservation;
  }

  getReservations(query: GetAllDto, user: any) {
    const { limit, order, page, sortBy } = query;

    return this.reservationRepository.getAll(
      { clientId: user._id, isDeleted: false },
      {
        limit,
        page,
        paginate: true,
        sort: { [sortBy]: order },
      },
    );
  }

  async getOneReservation(params: GetOneReservationDto, user: any) {
    const { id } = params;

    const reservation = await this.reservationRepository.getOne({
      _id: id,
      clientId: user._id,
      isDeleted: false,
    });

    if (!reservation) {
      throw new NotFoundException(ERROR_CODES.err_reservation_not_found);
    }

    return reservation;
  }

  async remove(params: DeleteOneReservationDto, user: any) {
    const { id } = params;

    const reservation = await this.reservationRepository.updateOne(
      {
        _id: id,
        clientId: user._id,
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

  async cancel(reservationId: string, user: any) {
    const reservation = await this.reservationRepository.updateOne(
      {
        _id: new mongoose.Types.ObjectId(reservationId),
        user: new mongoose.Types.ObjectId(user._id),
        isDeleted: false,
      },
      { status: RESERVATION_CANCELED_BY_CLIENT_STATUS },
      { new: true, lean: true },
    );

    if (!reservation) {
      throw new NotFoundException(ERROR_CODES.err_reservation_not_found);
    }

    return { success: true };
  }

  async availableReservation(branchId: string) {
    const [result] = await this.branchRepository._model.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(branchId),
        },
      },
      {
        $project: {
          reservationsSettings: 1,
          reservationsDays: 1,
        },
      },
    ]);
    return result;
  }

  async findAllReservation(query: MarketPlaceFindAllReservationDto, user: any) {
    const { limit = 25, page = 0, search, ...rest } = query;

    const generatedMatch = generateFilters(rest);

    const result = await this.reservationRepository.aggregate([
      {
        $match: {
          client: new mongoose.Types.ObjectId(user?._id),
        },
      },
      {
        $lookup: {
          from: 'branches',
          let: { branchId: '$branch' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$_id', '$$branchId'] }],
                },
              },
            },
          ],
          as: 'branch',
        },
      },
      {
        $unwind: {
          path: '$branch',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'merchants',
          let: { merchantId: '$merchant' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$_id', '$$merchantId'] }],
                },
              },
            },
          ],
          as: 'merchant',
        },
      },
      {
        $unwind: {
          path: '$merchant',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          ...generatedMatch,
        },
      },
      {
        $skip: page <= 0 ? 0 : limit * page,
      },
      {
        $limit: limit,
      },
    ]);
    return result;
  }

  async findOneReservation(reservationId: string) {
    const [result] = await this.reservationRepository._model.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(reservationId),
        },
      },
      {
        $lookup: {
          from: 'branches',
          let: { branchId: '$branch' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$_id', '$$branchId'] }],
                },
              },
            },
          ],
          as: 'branch',
        },
      },
      {
        $unwind: {
          path: '$branch',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'merchants',
          let: { merchantId: '$merchant' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$_id', '$$merchantId'] }],
                },
              },
            },
          ],
          as: 'merchant',
        },
      },
      {
        $unwind: {
          path: '$merchant',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    if (!result) {
      throw new NotFoundException(ERROR_CODES.err_reservation_not_found);
    }

    return result;
  }
}
