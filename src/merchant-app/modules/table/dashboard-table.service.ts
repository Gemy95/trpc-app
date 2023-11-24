import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import mongoose from 'mongoose';

import { ERROR_CODES } from '../../../libs/utils/src';
import { RESERVATION_STATUS } from '../common/constants/reservation.constants';
import generateFilters from '../common/utils/generate-filters';
import { BranchRepository, TableRepository } from '../models';
import { CreateTableDto } from './dto/create-table.dto';
import { GetAvailableTablesDto } from './dto/get-available-tables.dto';
import { GetTablesDto } from './dto/get-tables.dto';
import { UpdateTableDto } from './dto/update-table.dto';

@Injectable()
export class DashboardTableService {
  constructor(private readonly tableRepository: TableRepository, private readonly branchRepository: BranchRepository) {}

  async create(createTableDto: CreateTableDto) {
    const { branchId, number, floor } = createTableDto;

    const branch: any = await this.branchRepository.getOne(
      {
        isDeleted: false,
        _id: new mongoose.Types.ObjectId(branchId),
      },
      { lean: true },
    );

    if (!branch) {
      throw new NotFoundException(ERROR_CODES.err_branch_not_found);
    }

    const table = await this.tableRepository.getOne(
      {
        isDeleted: false,
        branchId: new mongoose.Types.ObjectId(branchId),
        number,
        floor,
      },
      { lean: true },
    );

    if (table) {
      throw new ConflictException(ERROR_CODES.err_table_already_exists);
    }

    const newTable: any = {
      ...createTableDto,
      branchId: new mongoose.Types.ObjectId(branchId),
      name: createTableDto.nameArabic,
      description: createTableDto?.descriptionArabic,
      location: createTableDto.location,

      translation: {
        _lang: 'en',
        name: createTableDto.nameEnglish,
        description: createTableDto?.descriptionEnglish,
        location: createTableDto?.locationEnglish,
      },

      images:
        createTableDto?.images &&
        createTableDto?.images?.map((image) => ({
          url: image?.url,
          title: image?.titleArabic,
          description: image?.descriptionArabic,
          translation: [
            {
              _lang: 'en',
              title: image?.titleEnglish,
              description: image?.descriptionEnglish,
            },
          ],
        })),
      // workingHours: createTableDto?.workingHours,
    };

    return this.tableRepository.create(newTable);
  }

  async updateOne(tableId: string, branchId: string, updateTableDto: UpdateTableDto) {
    const { number, floor } = updateTableDto;

    const branch: any = await this.branchRepository.getOne(
      {
        isDeleted: false,
        _id: new mongoose.Types.ObjectId(branchId),
      },
      { lean: true },
    );

    if (!branch) {
      throw new NotFoundException(ERROR_CODES.err_branch_not_found);
    }

    if (number && floor) {
      const table = await this.tableRepository.getOne(
        {
          isDeleted: false,
          branchId: new mongoose.Types.ObjectId(branchId),
          number,
          floor,
        },
        { lean: true },
      );

      if (table && table?._id.toString() != tableId) {
        throw new ConflictException(ERROR_CODES.err_table_already_exists);
      }
    }

    const updatedTable: any = {
      ...updateTableDto,
      name: updateTableDto?.nameArabic,
      description: updateTableDto?.descriptionArabic,
      location: updateTableDto?.location,

      translation:
        updateTableDto?.nameEnglish || updateTableDto?.locationEnglish
          ? {
              _lang: 'en',
              name: updateTableDto?.nameEnglish,
              description: updateTableDto?.descriptionEnglish || undefined,
              location: updateTableDto?.locationEnglish || undefined,
            }
          : undefined,

      images:
        updateTableDto?.images &&
        updateTableDto?.images?.map((image) => ({
          url: image?.url,
          title: image?.titleArabic,
          description: image?.descriptionArabic,
          translation: [
            {
              _lang: 'en',
              title: image?.titleEnglish,
              description: image?.descriptionEnglish,
            },
          ],
        })),
      // workingHours: updateTableDto?.workingHours ? updateTableDto?.workingHours : undefined,
    };

    return this.tableRepository.updateOne(
      { _id: new mongoose.Types.ObjectId(tableId) },
      { ...updatedTable },
      { new: true, lean: true },
    );
  }

  async findOne(id: string, branchId: string) {
    const table = await this.tableRepository.getOne(
      { isDeleted: false, _id: new mongoose.Types.ObjectId(id), branchId: new mongoose.Types.ObjectId(branchId) },
      { lean: true },
    );

    if (!table) {
      throw new NotFoundException(ERROR_CODES.err_table_not_found);
    }

    return table;
  }

  async remove(id: string, branchId: string) {
    const table = await this.tableRepository.updateOne(
      {
        isDeleted: false,
        _id: new mongoose.Types.ObjectId(id),
        branchId: new mongoose.Types.ObjectId(branchId),
      },
      { isDeleted: true },
      { lean: true, new: true },
    );

    if (!table) {
      throw new NotFoundException(ERROR_CODES.err_table_not_found);
    }

    return { success: true };
  }

  // findAll(getTablesDto: GetTablesDto) {
  //   const { limit, order, page, sortBy, branchId } = getTablesDto;

  //   return this.tableRepository.getAll(
  //     { isDeleted: false, branchId: new mongoose.Types.ObjectId(branchId) },
  //     { limit, page, paginate: true, sort: { [sortBy]: order } },
  //   );
  // }

  async findAll(query: GetTablesDto) {
    const { limit, page, branchId, ...rest } = query;
    const generatedMatch = generateFilters(rest);

    const response = await this.tableRepository.aggregate([
      {
        $match: {
          branchId: new mongoose.Types.ObjectId(branchId),
        },
      },
      {
        $lookup: {
          from: 'branches',
          let: { branchId: '$branchId' },
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
        $addFields: {
          reservationsDays: '$branch.reservationsDays',
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
          number: 1,
          floor: 1,
          capacity: 1,
          vip: 1,
          extraPrice: 1,
          name: 1,
          description: 1,
          type: 1,
          status: 1,
          branchId: 1,
          location: 1,
          translation: 1,
          images: 1,
          isDeleted: 1,
          reservationsDays: 1,
          branch: 1,
          reservations: 1,
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
    ]);

    return response;
  }

  async findAllAvailable(query: GetAvailableTablesDto) {
    const { limit, page, branchId, day, ...rest } = query;
    const generatedMatch = generateFilters(rest);

    const generatedMatchReservations = {};

    if (generatedMatch['dateTime']) {
      generatedMatchReservations['dateTime'] = generatedMatch['dateTime'];
      delete generatedMatch['dateTime'];
    }

    const response = await this.tableRepository.aggregate([
      {
        $match: {
          branchId: new mongoose.Types.ObjectId(branchId),
        },
      },
      {
        $lookup: {
          from: 'branches',
          let: { branchId: '$branchId' },
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
          from: 'reservations',
          let: { branchId: '$branchId', tableId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$branch', '$$branchId'] },
                    { $eq: ['$day', day] },
                    { $in: ['$$tableId', '$tablesIds'] },
                    {
                      $in: [
                        '$status',
                        [
                          RESERVATION_STATUS.RESERVATION_PENDING_STATUS,
                          RESERVATION_STATUS.RESERVATION_ACCEPTED_STATUS,
                          RESERVATION_STATUS.RESERVATION_ATTENDED_STATUS,
                          RESERVATION_STATUS.RESERVATION_WAITING_STATUS,
                        ],
                      ],
                    },
                  ],
                },
              },
            },
            {
              $match: {
                ...generatedMatchReservations,
              },
            },
          ],
          as: 'reservations',
        },
      },
      {
        $addFields: {
          reservationsDays: '$branch.reservationsDays',
        },
      },
      {
        $project: {
          _id: 1,
          number: 1,
          floor: 1,
          capacity: 1,
          vip: 1,
          extraPrice: 1,
          name: 1,
          description: 1,
          type: 1,
          status: 1,
          branchId: 1,
          location: 1,
          translation: 1,
          images: 1,
          isDeleted: 1,
          // reservationsDays: 1,
          reservationsDays: {
            $filter: {
              input: '$reservationsDays',
              as: 'currentDay',
              cond: { $in: ['$$currentDay.day', [day]] },
            },
          },
          branch: 1,
          reservations: 1,
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
    ]);

    const tables = response?.tables?.map((table) => {
      const reservationsDays = table?.reservationsDays?.map((ele) => {
        const workingHours = ele?.workingHours?.filter((ele2) => {
          return table?.reservations?.every((ele3) => {
            return ele2?.startAt != ele3?.timeFrom && ele2?.endAt != ele3?.timeTo;
          });
        });
        return { ...ele, workingHours };
      });
      return { ...table, reservationsDays };
    });

    return { ...response, tables };
  }
}
