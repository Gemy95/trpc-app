import { InjectQueue } from '@nestjs/bull';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Queue } from 'bull';
import moment from 'moment-timezone';
import mongoose from 'mongoose';
import { customAlphabet } from 'nanoid';

import { ERROR_CODES } from '../../../libs/utils/src';
import { QueuesManagerService } from '../bull/generate-queue';
import { DAYS, RESERVATION_USER_TYPES } from '../common/constants/branch.constants';
import {
  RESERVATION_CANCELED_BY_CLIENT_STATUS,
  RESERVATION_STATUS,
  RESERVATION_TYPE,
} from '../common/constants/reservation.constants';
import { GetAllDto } from '../common/dto/get-all.dto';
import buildDateQuery from '../common/utils/build-date-query';
import generateFilters from '../common/utils/generate-filters';
import { setDateTime } from '../common/utils/set-time-as-date';
import { getCountryTimeZone } from '../helpers/get-timezone';
import { BranchRepository, ReservationRepository, TableRepository } from '../models';
import { CancelOneReservationDto } from './dto/cancel-one-reservation.dto';
import { CreateLocalReservationToClientDto } from './dto/create-local-reservation-to-client.dto';
import { DeleteOneReservationDto } from './dto/delete-one-reservation.dto';
import { GetOneReservationDto } from './dto/get-one-reservation.dto';
import { MerchantFindAllReservationByDateDto } from './dto/merchant-find-all-filter-date.dto';
import { MerchantFindAllReservationDto } from './dto/merchant-find-all-filter.dto';
import { CREATE_RESERVATION_PROCESSOR, RESERVATION_QUEUE } from './reservation.constants';

@Injectable()
export class SharedReservationService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly branchRepository: BranchRepository,
    private readonly tableRepository: TableRepository,
    @InjectQueue(RESERVATION_QUEUE) private readonly reservationQueue: Queue,
    private queuesManagerService: QueuesManagerService,
  ) {}

  async create(createReservationDto: CreateLocalReservationToClientDto, user?: any) {
    const { _id, type } = user;

    const branch = await this.checkReservationDay(createReservationDto.branch, createReservationDto.day, user);

    // const formatReservationDayTime = 'YYYY-MM-DD HH:mm:ss Z';

    // const timezone = moment.tz.guess(true);

    // const reservationDateTime = moment(
    //   `${moment(createReservationDto.dateTime).format('YYYY-MM-DD')} ${createReservationDto.timeFrom}`,
    //   formatReservationDayTime,
    // ).tz(timezone);

    const countryTimezone = getCountryTimeZone(branch?.country?.code);

    const reservationDateTime = moment.tz(
      `${moment(createReservationDto.dateTime).format('YYYY-MM-DD')} ${createReservationDto.timeFrom}`,
      countryTimezone,
    );

    const reservationEndDateTime = moment.tz(
      `${moment(createReservationDto.dateTime).format('YYYY-MM-DD')} ${createReservationDto.timeTo}`,
      countryTimezone,
    );

    if (reservationDateTime.isSameOrBefore(new Date())) {
      throw new BadRequestException(ERROR_CODES.err_reservation_date_time_less_than_now);
    }

    const tables = await this.tableRepository.capacityOfTables(
      createReservationDto.branch,
      createReservationDto.tablesIds,
    );

    if (
      tables.totalCapacity < createReservationDto.numberOfGuests ||
      tables.totalCapacity < createReservationDto.numberOfChildrenGuests + createReservationDto.numberOfAdultsGuests
    ) {
      throw new BadRequestException(ERROR_CODES.err_reservation_tables_has_not_enough_capacity);
    }

    // const workingHour = branch?.reservationsDays?.workingHours?.filter(ele => {
    //   const currentDate = new Date(createReservationDto.dateTime);
    //   const current = new Date(currentDate.getTime()),
    //     start = setDateTime(ele.timeFrom, new Date(currentDate)),
    //     end = setDateTime(ele.to, new Date(currentDate));
    //   return start < current && end > current;
    // })?.[0];

    const format = 'HH:mm:ss';

    const workingHour = branch?.reservationsDays?.workingHours?.filter((ele) => {
      const rTimeFrom = moment(createReservationDto.timeFrom, format),
        rTimeTo = moment(createReservationDto.timeTo, format),
        start = moment(ele.startAt, format),
        end = moment(ele.endAt, format);
      return start.isSameOrBefore(rTimeFrom) && end.isSameOrAfter(rTimeTo);
    })?.[0];

    if (!workingHour) {
      // in case reservation hour is not found in day
      throw new BadRequestException(ERROR_CODES.err_reservation_hour_is_not_found_in_day);
    }

    if (workingHour?.disabled) {
      // in case reservation hour is disabled in day
      throw new BadRequestException(ERROR_CODES.err_reservation_hour_is_disable);
    }

    // const diffDates = moment.duration(
    //   moment(createReservationDto.dateTime).diff(
    //     moment(new Date().setHours(parseInt(createReservationDto.timeFrom))),
    //   ),
    // );

    // if (Math.floor(diffDates.asDays()) == 0 && Math.floor(diffDates.asHours()) < 1 && diffDates.asMinutes() < 60) {
    //   throw new BadRequestException(ERROR_CODES.err_reservation_time_is_not_more_than_or_equal_one_hour_as_minimum);
    // }

    if (
      branch?.reservationsSettings?.waitingListCapacity + workingHour?.capacityPerAverageClientTime <
      workingHour?.reservations?.length + createReservationDto?.numberOfGuests
    ) {
      // in case reservation setting capacity + working hour capacity is less than or equals reservations count + numberOfGuests
      throw new BadRequestException(ERROR_CODES.err_reservation_setting_capacity_and_waiting_list_is_full);
    }

    const checkIsExistsReservations = await this.checkIsExistsReservations(
      createReservationDto.branch,
      createReservationDto.tablesIds,
      createReservationDto.day,
      createReservationDto.dateTime,
      createReservationDto.timeFrom,
      createReservationDto.timeTo,
    );

    if (checkIsExistsReservations && checkIsExistsReservations?.count > 0) {
      throw new BadRequestException(ERROR_CODES.err_reservation_already_exists_during_this_time);
    }

    let reservation = {};

    const reservationRefId = await this._generateReservationRefId();

    if (
      workingHour?.capacityPerAverageClientTime >=
        workingHour?.reservations?.length + createReservationDto?.numberOfGuests ||
      !createReservationDto.isWaitingList
    ) {
      reservation = await this.reservationRepository.create({
        ...createReservationDto,
        dateTime: reservationDateTime,
        endDateTime: reservationEndDateTime,
        isWaitingList: false,
        client: new mongoose.Types.ObjectId(createReservationDto.clientId),
        reservationCreatedBy: type != 'Client' ? new mongoose.Types.ObjectId(_id) : undefined,
        type: type == 'Client' ? RESERVATION_TYPE.ORDER_BOOK : RESERVATION_TYPE.ORDER_OFFLINE_BOOK,
        reservationRefId,
      });
    } else if (
      branch?.reservationsSettings?.waitingListCapacity + workingHour?.capacityPerAverageClientTime >=
      workingHour?.reservations?.length + createReservationDto?.numberOfGuests
    ) {
      reservation = await this.reservationRepository.create({
        ...createReservationDto,
        dateTime: reservationDateTime,
        endDateTime: reservationEndDateTime,
        client: new mongoose.Types.ObjectId(createReservationDto.clientId),
        reservationCreatedBy: type != 'Client' ? new mongoose.Types.ObjectId(_id) : undefined,
        type: type == 'Client' ? RESERVATION_TYPE.ORDER_BOOK : RESERVATION_TYPE.ORDER_OFFLINE_BOOK,
        reservationRefId,
        isWaitingList: true,
        status: RESERVATION_STATUS.RESERVATION_WAITING_STATUS,
      });

      const delayedMilliseconds =
        reservationDateTime.subtract(1, 'hour').valueOf() - moment(reservation['_doc'].createdAt).valueOf();

      await this.reservationQueue.add(
        CREATE_RESERVATION_PROCESSOR,
        { ...reservation['_doc'] },
        {
          // delay: 3600 * 1000, // cancel reservation by system after 1 hour
          delay: delayedMilliseconds,
          jobId: `Branch_${createReservationDto.branch}_${reservation['_doc']['_id']}`,
        },
      );
    } else {
      throw new BadRequestException(ERROR_CODES.err_reservation_setting_capacity_and_waiting_list_is_full);
    }

    // await this.queuesManagerService.generateQueue(`Branch_${createReservationDto.branch}`, reservation);
    // const getDelayedJobs= await this.queuesManagerService.getAllJobsFromQueue(`Branch_${createReservationDto.branch}`,['delayed','waiting','paused']);
    // console.log("getDelayedJobs=",getDelayedJobs.length)

    return { success: true };
  }

  async getReservations(query: GetAllDto, user: any) {
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

  async cancel(params: CancelOneReservationDto, user: any) {
    const { id } = params;

    const reservation = await this.reservationRepository.updateOne(
      {
        _id: id,
        clientId: user._id,
        isDeleted: false,
      },
      { status: RESERVATION_CANCELED_BY_CLIENT_STATUS },
      { new: true, lean: true },
    );

    if (!reservation) {
      throw new NotFoundException(ERROR_CODES.err_reservation_not_found);
    }

    return reservation;
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

  async checkReservationDay(branchId: string, day: string, user: any) {
    const [branch] = await this.branchRepository._model.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(branchId),
          'reservationsDays.day': day,
        },
      },
      {
        $project: {
          _id: 1,
          cityId: 1,
          reservationsSettings: 1,
          reservationsDays: {
            $filter: {
              input: '$reservationsDays',
              as: 'reservationsDays',
              cond: { $eq: ['$$reservationsDays.day', day] },
            },
          },
        },
      },
      {
        $unwind: {
          path: '$reservationsDays',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          workingReservationHours: '$reservationsDays.workingHours',
        },
      },
      {
        $unwind: {
          path: '$workingReservationHours',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'reservations',
          let: { workingReservationHours: '$workingReservationHours' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$timeFrom', '$$workingReservationHours.startAt'] },
                    { $eq: ['$timeTo', '$$workingReservationHours.endAt'] },
                    { $eq: ['$day', day] },
                    { $gt: ['$dateTime', new Date()] },
                    { $in: ['$status', [RESERVATION_STATUS.RESERVATION_PENDING_STATUS]] },
                  ],
                },
              },
            },
          ],
          as: 'reservations',
        },
      },
      {
        $lookup: {
          from: 'cities',
          localField: 'cityId',
          foreignField: '_id',
          as: 'city',
        },
      },
      {
        $unwind: {
          path: '$city',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'countries',
          localField: 'city.country',
          foreignField: '_id',
          as: 'country',
        },
      },
      {
        $unwind: {
          path: '$country',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          cityId: { $first: '$cityId' },
          city: { $first: '$city' },
          country: { $first: '$country' },
          reservationsSettings: { $first: '$reservationsSettings' },
          reservationsDays: { $first: '$reservationsDays' },
          workingReservationHours: {
            $push: {
              startAt: '$workingReservationHours.startAt',
              endAt: '$workingReservationHours.endAt',
              avgClientLifeTime: '$workingReservationHours.avgClientLifeTime',
              capacityPerAverageClientTime: '$workingReservationHours.capacityPerAverageClientTime',
              disabled: '$workingReservationHours.disabled',
              capacity: '$workingReservationHours.capacity',
              reservations: '$reservations',
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          country: 1,
          reservationsSettings: 1,
          reservationsDays: {
            available: 1,
            day: 1,
            workingHours: '$workingReservationHours',
            disabled: 1,
            full_reserved: 1,
            instructions: 1,
          },
        },
      },
      {
        $limit: 1,
      },
    ]);

    if (!branch?.reservationsDays) {
      // in case day not found in reservations days
      throw new BadRequestException(ERROR_CODES.err_reservation_day_is_not_found_in_reservation_setting);
    }

    if (!branch?.reservationsSettings?.enabled) {
      // in case reservations Settings is disabled
      throw new BadRequestException(ERROR_CODES.err_reservation_setting_is_disabled);
    }

    if (!branch?.reservationsDays?.available) {
      // in case reservation day is not available
      throw new BadRequestException(ERROR_CODES.err_reservation_day_is_not_available);
    }

    if (branch?.reservationsDays?.disabled) {
      // in case reservation day is disabled
      throw new BadRequestException(ERROR_CODES.err_reservation_day_is_disable);
    }

    return branch;
  }

  async merchantFindAllReservationsByBranchId(branchId: string, query: MerchantFindAllReservationDto, user: any) {
    const { limit, page, day, paginate, ...rest } = query;
    const generatedMatch = generateFilters(rest);

    if (generatedMatch['clientMobile']) {
      delete Object.assign(generatedMatch, {
        'client.mobile': generatedMatch['clientMobile'],
      })['clientMobile'];
    }

    if (generatedMatch['isVipTable']) {
      delete Object.assign(generatedMatch, {
        'tables.vip': generatedMatch['isVipTable'],
      })['isVipTable'];
    }

    if (generatedMatch['tables']) {
      delete Object.assign(generatedMatch, {
        'tables._id': generatedMatch['tables'],
      })['tables'];
    }

    if (generatedMatch['tables']) {
      delete Object.assign(generatedMatch, {
        'tables._id': generatedMatch['tables'],
      })['tables'];
    }

    const response = await this.reservationRepository.aggregate([
      {
        $facet: {
          Result1: [
            {
              $match: {
                branch: new mongoose.Types.ObjectId(branchId),
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
                  {
                    $lookup: {
                      from: 'tables',
                      localField: 'branchId',
                      foreignField: '_id',
                      as: 'tables',
                    },
                  },
                  {
                    $lookup: {
                      from: 'reservations',
                      as: 'waiting_reservations',
                      let: { branchId: '$branchId' },
                      pipeline: [
                        {
                          $match: {
                            $expr: {
                              $and: [
                                { $eq: ['$branch', '$$branchId'] },
                                { $eq: ['$isWaitingList', true] },
                                {
                                  $in: [
                                    '$status',
                                    [
                                      RESERVATION_STATUS.RESERVATION_PENDING_STATUS,
                                      RESERVATION_STATUS.RESERVATION_WAITING_STATUS,
                                    ],
                                  ],
                                },
                              ],
                            },
                          },
                        },
                      ],
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
              $lookup: {
                from: 'users',
                let: { clientId: '$client' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [{ $eq: ['$_id', '$$clientId'] }],
                      },
                    },
                  },
                  {
                    $lookup: {
                      from: 'reservations',
                      let: { clientId: '$clientId' },
                      pipeline: [
                        {
                          $match: {
                            $expr: {
                              $and: [{ $eq: ['$clientId', '$$clientId'] }],
                            },
                          },
                        },
                      ],
                      as: 'reservations',
                    },
                  },
                  {
                    $lookup: {
                      from: 'reservations',
                      let: { clientId: '$clientId' },
                      pipeline: [
                        {
                          $match: {
                            $expr: {
                              $and: [
                                { $eq: ['$clientId', '$$clientId'] },
                                { $eq: ['$status', RESERVATION_STATUS.RESERVATION_CANCELED_BY_CLIENT_STATUS] },
                              ],
                            },
                          },
                        },
                      ],
                      as: 'canceled_reservations',
                    },
                  },
                ],
                as: 'client',
              },
            },
            {
              $unwind: {
                path: '$client',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: 'tables',
                let: { tablesIds: '$tablesIds' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [{ $in: ['$_id', '$$tablesIds'] }],
                      },
                    },
                  },
                ],
                as: 'tables',
              },
            },
            {
              $match: {
                ...generatedMatch,
              },
            },
            {
              $project: {
                _id: 1,
                merchant: 1,
                branch: 1,
                client: 1,
                clientName: 1,
                clientMobile: 1,
                reservationCreatedBy: 1,
                clientDetails: 1,
                type: 1,
                status: 1,
                dateTime: 1,
                day: 1,
                timeFrom: 1,
                timeTo: 1,
                numberOfGuests: 1,
                numberOfAdultsGuests: 1,
                numberOfChildrenGuests: 1,
                clientNotes: 1,
                paymentType: 1,
                isWaitingList: 1,
                employeeNotes: 1,
                invoice: 1,
                isDeleted: 1,
                // items: 1,
                tables: 1,
                platform: 1,
                // totalClientReservationsCount: { $ifNull: [{ $size: '$client.reservations' }, []] },
                totalClientReservationsCount: {
                  $cond: { if: { $isArray: '$client.reservations' }, then: { $size: '$client.reservations' }, else: 0 },
                },
                // totalClientCanceledReservationsCount: { $ifNull: [{ $size: '$client.canceled_reservations' }, []] },
                totalClientCanceledReservationsCount: {
                  $cond: {
                    if: { $isArray: '$client.canceled_reservations' },
                    then: { $size: '$client.canceled_reservations' },
                    else: 0,
                  },
                },
                createdAt: 1,
                updatedAt: 1,
              },
            },
            {
              $skip: page <= 0 ? 0 : limit * page,
            },
            {
              $limit: limit,
            },
          ],
          Result2: [
            {
              $match: {
                branch: new mongoose.Types.ObjectId(branchId),
                status: {
                  $in: [RESERVATION_STATUS.RESERVATION_PENDING_STATUS, RESERVATION_STATUS.RESERVATION_WAITING_STATUS],
                },
                isWaitingList: true,
              },
            },
            { $group: { _id: null, count: { $sum: 1 } } },
            { $project: { _id: 0 } },
          ],
          Result3: [
            {
              $match: {
                branch: new mongoose.Types.ObjectId(branchId),
                dateTime: generatedMatch['dateTime'],
                day: day,
              },
            },
            { $group: { _id: null, count: { $sum: 1 } } },
            { $project: { _id: 0 } },
          ],
          Result4: [
            {
              $match: {
                branch: new mongoose.Types.ObjectId(branchId),
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
                  {
                    $lookup: {
                      from: 'tables',
                      localField: 'branchId',
                      foreignField: '_id',
                      as: 'tables',
                    },
                  },
                  {
                    $lookup: {
                      from: 'reservations',
                      as: 'waiting_reservations',
                      let: { branchId: '$branchId' },
                      pipeline: [
                        {
                          $match: {
                            $expr: {
                              $and: [
                                { $eq: ['$branch', '$$branchId'] },
                                { $eq: ['$isWaitingList', true] },
                                {
                                  $in: [
                                    '$status',
                                    [
                                      RESERVATION_STATUS.RESERVATION_PENDING_STATUS,
                                      RESERVATION_STATUS.RESERVATION_WAITING_STATUS,
                                    ],
                                  ],
                                },
                              ],
                            },
                          },
                        },
                      ],
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
              $lookup: {
                from: 'users',
                let: { clientId: '$client' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [{ $eq: ['$_id', '$$clientId'] }],
                      },
                    },
                  },
                  {
                    $lookup: {
                      from: 'reservations',
                      let: { clientId: '$clientId' },
                      pipeline: [
                        {
                          $match: {
                            $expr: {
                              $and: [{ $eq: ['$clientId', '$$clientId'] }],
                            },
                          },
                        },
                      ],
                      as: 'reservations',
                    },
                  },
                  {
                    $lookup: {
                      from: 'reservations',
                      let: { clientId: '$clientId' },
                      pipeline: [
                        {
                          $match: {
                            $expr: {
                              $and: [
                                { $eq: ['$clientId', '$$clientId'] },
                                { $eq: ['$status', RESERVATION_STATUS.RESERVATION_CANCELED_BY_CLIENT_STATUS] },
                              ],
                            },
                          },
                        },
                      ],
                      as: 'canceled_reservations',
                    },
                  },
                ],
                as: 'client',
              },
            },
            {
              $unwind: {
                path: '$client',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: 'tables',
                let: { tablesIds: '$tablesIds' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [{ $in: ['$_id', '$$tablesIds'] }],
                      },
                    },
                  },
                ],
                as: 'tables',
              },
            },
            {
              $match: {
                ...generatedMatch,
              },
            },
            { $group: { _id: null, count: { $sum: 1 } } },
            { $project: { _id: 0 } },
          ],
        },
      },
    ]);

    const [branch] = await this.branchRepository._model.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(branchId),
        },
      },
      {
        $lookup: {
          from: 'tables',
          let: { branchId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$branchId', '$$branchId'] }],
                },
              },
            },
          ],
          as: 'tables',
        },
      },
      {
        $project: {
          _id: 1,
          reservationsDays: {
            $filter: {
              input: '$reservationsDays',
              as: 'currentDay',
              cond: { $in: ['$$currentDay.day', [day]] },
            },
          },
          reservationsSettings: 1,
          totalTablesCount: {
            $cond: { if: { $isArray: '$tables' }, then: { $size: '$tables' }, else: 0 },
          },
        },
      },
    ]);

    const totalTablesCount = branch?.totalTablesCount || 0;
    const reservationsDays = branch?.reservationsDays;
    const reservationsSettings = branch?.reservationsSettings;
    const separationTimeBetweenEachReservation = 0; //reservationsSettings?.separationTimeBetweenEachReservation || 0;
    // const dayDurationAsHours = reservationsDays?.[0]?.workingHours?.reduce((total, item) => total + parseFloat(item.to) - parseFloat(item.from), 0);
    const dayDurationAsHours = reservationsDays?.[0]?.workingHours?.length || 0;
    const separationTimeAsHours = separationTimeBetweenEachReservation / 60;
    const expectedReservationsCount = totalTablesCount * dayDurationAsHours; // as 100%
    // const actualReservationsCount = totalTablesCount * (dayDurationAsHours - separationTimeAsHours); // as what percentage ?
    const actualReservationsCount = response?.reservations?.[0]?.Result3?.[0]?.count || 0;

    const dayCoverage = (actualReservationsCount * 100) / expectedReservationsCount;

    const pagesCount =
      !isNaN(page) && !isNaN(limit) ? Math.ceil((response?.reservations?.[0]?.Result4?.[0]?.count || 0) / limit) : 1;

    return {
      ...response,
      page: page,
      pages: pagesCount,
      length: response?.reservations?.[0]?.Result4?.[0]?.count || 0,
      reservations: response?.reservations?.[0]?.Result1,
      totalWaitingListReservationsCount: response?.reservations?.[0]?.Result2?.[0]?.count || 0,
      dayCoverage: (dayCoverage || 0)?.toFixed(2),
    };
  }

  async merchantFindOneReservation(reservationId: string, user: any) {
    const [reservation] = await this.reservationRepository._model.aggregate([
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
      {
        $lookup: {
          from: 'users',
          let: { clientId: '$client' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$_id', '$$clientId'] }],
                },
              },
            },
            {
              $lookup: {
                from: 'reservations',
                let: { clientId: '$clientId' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [{ $eq: ['$clientId', '$$clientId'] }],
                      },
                    },
                  },
                ],
                as: 'reservations',
              },
            },
            {
              $lookup: {
                from: 'reservations',
                let: { clientId: '$clientId' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ['$clientId', '$$clientId'] },
                          { $eq: ['$status', RESERVATION_STATUS.RESERVATION_CANCELED_BY_CLIENT_STATUS] },
                        ],
                      },
                    },
                  },
                ],
                as: 'canceled_reservations',
              },
            },
          ],
          as: 'client',
        },
      },
      {
        $unwind: {
          path: '$client',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'tables',
          let: { tablesIds: '$tablesIds' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $in: ['$_id', '$$tablesIds'] }],
                },
              },
            },
          ],
          as: 'tables',
        },
      },
      { $limit: 1 },
      {
        $project: {
          _id: 1,
          merchant: 1,
          branch: 1,
          client: 1,
          clientName: 1,
          clientMobile: 1,
          reservationCreatedBy: 1,
          clientDetails: 1,
          type: 1,
          status: 1,
          dateTime: 1,
          day: 1,
          timeFrom: 1,
          timeTo: 1,
          numberOfGuests: 1,
          numberOfAdultsGuests: 1,
          numberOfChildrenGuests: 1,
          clientNotes: 1,
          paymentType: 1,
          isWaitingList: 1,
          employeeNotes: 1,
          invoice: 1,
          isDeleted: 1,
          // items: 1,
          tables: 1,
          platform: 1,
          createdAt: 1,
          updatedAt: 1,
          // totalClientReservationsCount: { $ifNull: [{ $size: '$client.reservations' }, []] },
          totalClientReservationsCount: {
            $cond: { if: { $isArray: '$client.reservations' }, then: { $size: '$client.reservations' }, else: 0 },
          },
          // totalClientCanceledReservationsCount: { $ifNull: [{ $size: '$client.canceled_reservations' }, []] },
          totalClientCanceledReservationsCount: {
            $cond: {
              if: { $isArray: '$client.canceled_reservations' },
              then: { $size: '$client.canceled_reservations' },
              else: 0,
            },
          },
        },
      },
    ]);
    return reservation;
  }

  async merchantFindCountReservationsByBranchIdAndDate(
    branchId: string,
    query: MerchantFindAllReservationByDateDto,
    user: any,
  ) {
    const { ...rest } = query;
    const generatedMatch = generateFilters(rest);

    if (generatedMatch['createdAt']) {
      delete Object.assign(generatedMatch, {
        dateTime: generatedMatch['createdAt'],
      })['createdAt'];
    }

    const reservations = await this.reservationRepository._model.aggregate([
      {
        $match: {
          branch: new mongoose.Types.ObjectId(branchId),
        },
      },
      {
        $project: {
          numberOfClient: { $literal: 1 },
          numberOfAdultsGuests: 1,
          numberOfChildrenGuests: 1,
          dateTime: { $dateToString: { format: '%Y-%m-%d', date: '$dateTime' } },
        },
      },
      {
        $group: {
          _id: '$dateTime',
          dateTime: { $first: '$dateTime' },
          totalReservationsCount: { $sum: 1 },
          totalPersonsCount: {
            $sum: { $add: ['$numberOfClient', '$numberOfAdultsGuests', '$numberOfChildrenGuests'] },
          },
        },
      },
      {
        $project: {
          dateTime: 1,
          totalReservationsCount: 1,
          totalPersonsCount: 1,
        },
      },
    ]);

    const mappedReservations = reservations?.sort((a, b) => Date.parse(a?.dateTime) - Date.parse(b?.dateTime));

    return mappedReservations;
  }

  async _generateReservationRefId() {
    const reservation = customAlphabet('123456789ABCDEFGH', 9)();
    const isReservationRefExist = await this.reservationRepository.getOne({
      reservationRefId: reservation,
    });
    if (isReservationRefExist) await this._generateReservationRefId();
    else return '#R' + reservation;
  }

  async checkIsExistsReservations(
    branchId: string,
    tablesIds: string[],
    day: DAYS,
    dateTime: Date,
    timeFrom: string,
    timeTo: string,
  ) {
    const [reservations] = await this.reservationRepository._model.aggregate([
      {
        $match: {
          branch: new mongoose.Types.ObjectId(branchId),
          tablesIds: {
            $in: tablesIds.map((ele) => {
              return new mongoose.Types.ObjectId(ele);
            }),
          },
          day: day,
          dateTime: buildDateQuery(dateTime, dateTime),
          timeFrom: timeFrom,
          timeTo: timeTo,
          status: {
            $nin: [
              RESERVATION_STATUS.RESERVATION_CANCELED_BY_CLIENT_STATUS,
              RESERVATION_STATUS.RESERVATION_CANCELED_BY_EMPLOYEE_STATUS,
              RESERVATION_STATUS.RESERVATION_CANCELED_BY_SHOPPEX_STATUS,
              RESERVATION_STATUS.RESERVATION_CANCELED_BY_SYSTEM_STATUS,
              RESERVATION_STATUS.RESERVATION_REJECTED_STATUS,
            ],
          },
        },
      },
      { $group: { _id: null, count: { $sum: 1 } } },
      { $project: { _id: 0 } },
    ]);
    return reservations;
  }
}
