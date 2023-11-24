import { InjectQueue } from '@nestjs/bull';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Job, Queue } from 'bull';
import moment from 'moment-timezone';
import mongoose, { Types } from 'mongoose';

import { ERROR_CODES } from '../../../libs/utils/src';
import {
  APPROVE_OR_REJECT_RESERVATION_STATUS,
  RESERVATION_CANCELED_BY_CLIENT_STATUS,
  RESERVATION_STATUS,
  RESERVATION_TYPE,
} from '../common/constants/reservation.constants';
import { GetAllDto } from '../common/dto/get-all.dto';
import { MailService } from '../mail/mail.service';
import { BranchRepository, Client, MerchantRepository, ReservationRepository } from '../models';
import { DashboardOrderService } from '../order/dashboard-order.service';
import { ApproveOrRejectReservationDto } from './dto/approve-or-reject.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { DeleteOneReservationDto } from './dto/delete-one-reservation.dto';
import { GetOneReservationDto } from './dto/get-one-reservation.dto';
import { CREATE_RESERVATION_PROCESSOR, RESERVATION_QUEUE } from './reservation.constants';
import { SharedReservationService } from './reservation.shared.service';

@Injectable()
export class MerchantReservationService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly branchRepository: BranchRepository,
    @InjectQueue(RESERVATION_QUEUE) private readonly reservationQueue: Queue,
    private readonly merchantRepository: MerchantRepository,
    private dashboardOrderService: DashboardOrderService,
    private sharedReservationService: SharedReservationService,
    private readonly mailService: MailService,
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

  async findAllReservation(query: GetAllDto, user: any) {
    const { page, limit } = query;

    const merchantId = user?.merchant?._id
      ? user?.merchant?._id
      : user?.type == 'Owner'
      ? await this.merchantRepository.getOne({ ownerId: user?._id })
      : '';

    const result = await this.reservationRepository.aggregate([
      {
        $match: {
          merchant: new mongoose.Types.ObjectId(merchantId),
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
        $skip: page <= 0 ? 0 : limit * page,
      },
      {
        $limit: limit,
      },
    ]);
    return result;
  }

  async approveOrRejectReservation(
    reservationId: string,
    approveOrRejectReservationDto: ApproveOrRejectReservationDto,
    user: any,
  ) {
    const { status, notes } = approveOrRejectReservationDto;

    const reservation = await this.reservationRepository.getOne(
      {
        _id: new Types.ObjectId(reservationId),
      },
      {
        lean: true,
        populate: [
          {
            path: 'client',
            select: '_id name mobile email uuid',
          },
        ],
      },
    );

    if (!reservation) throw new NotFoundException(ERROR_CODES.err_request_not_found);

    if (status == APPROVE_OR_REJECT_RESERVATION_STATUS.RESERVATION_REJECTED_STATUS) {
      const [updatedReservation] = await Promise.all([
        this.reservationRepository.updateOne(
          {
            _id: new Types.ObjectId(reservationId),
          },
          {
            status: APPROVE_OR_REJECT_RESERVATION_STATUS.RESERVATION_REJECTED_STATUS,
            employeeNotes: notes,
          },
        ),
      ]);

      return { success: true };
    } else if (status == APPROVE_OR_REJECT_RESERVATION_STATUS.RESERVATION_ACCEPTED_STATUS) {
      const [updatedReservation] = await Promise.all([
        this.reservationRepository.updateOne(
          {
            _id: new Types.ObjectId(reservationId),
          },
          {
            status: APPROVE_OR_REJECT_RESERVATION_STATUS.RESERVATION_ACCEPTED_STATUS,
            employeeNotes: notes,
          },
        ),
      ]);

      //   const orderData = {
      //     branchId: reservation.branch.toString(),
      //     clientNotes: reservation.clientNotes,
      //     paymentType: reservation.paymentType,
      //     items: reservation.items,
      //     orderType: reservation.type,
      //   };

      // await this.dashboardOrderService.create(user, orderData);

      return {
        success: true,
      };
    } else if (status == APPROVE_OR_REJECT_RESERVATION_STATUS.RESERVATION_WAITING_STATUS) {
      const [updatedReservation] = await Promise.all([
        this.reservationRepository.updateOne(
          {
            _id: new Types.ObjectId(reservationId),
          },
          {
            status: APPROVE_OR_REJECT_RESERVATION_STATUS.RESERVATION_WAITING_STATUS,
            isWaitingList: true,
            employeeNotes: notes,
          },
        ),
      ]);

      const reservationDateTime = moment(updatedReservation.dateTime);

      const delayedMilliseconds =
        reservationDateTime.subtract(1, 'hour').valueOf() - moment(updatedReservation['createdAt']).valueOf();

      if (reservation.status != RESERVATION_STATUS.RESERVATION_WAITING_STATUS) {
        await this.reservationQueue.add(
          CREATE_RESERVATION_PROCESSOR,
          { ...reservation['_doc'] },
          {
            // delay: 3600 * 1000, // cancel reservation by system after 1 hour
            delay: delayedMilliseconds,
            jobId: `Branch_${updatedReservation.branch.toString()}_${reservation['_doc']['_id']}`,
          },
        );
      }

      return {
        success: true,
      };
    }

    if (
      approveOrRejectReservationDto.status != APPROVE_OR_REJECT_RESERVATION_STATUS.RESERVATION_WAITING_STATUS &&
      reservation.status == RESERVATION_STATUS.RESERVATION_WAITING_STATUS
    ) {
      const result = await this.reservationQueue.getDelayed();
      const job = result.filter((ele: Job) => {
        return ele?.data?.['_id'].toString() == reservationId;
      });
      //const job = await queue.getJob(requested._id);
      if (job) {
        await job?.[0]?.moveToCompleted('succeeded', true);
        //await job?.[0]?.remove();
      }
    }

    if (
      (reservation.client && status == APPROVE_OR_REJECT_RESERVATION_STATUS.RESERVATION_ACCEPTED_STATUS) ||
      status == APPROVE_OR_REJECT_RESERVATION_STATUS.RESERVATION_REJECTED_STATUS
    ) {
      await this.mailService.reservationAction(reservation['client'] as Client, reservation.reservationRefId, status);
    }
  }
}
