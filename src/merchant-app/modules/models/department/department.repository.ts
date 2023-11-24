import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { DepartmentDocument } from '../../../../libs/database/src/lib/models/department/department.schema';
import { GetAllDepartmentsDto } from '../../departments/dto/get-all-department.dto';
import { ACTIVE, EMPLOYEE_STATUS, IN_ACTIVE } from '../../shoppex-employee/interface/status.enum';
import { BaseRepository } from '../BaseRepository';

@Injectable()
export class DepartmentRepository extends BaseRepository<DepartmentDocument> {
  constructor(
    @InjectModel('Department')
    private readonly nModel: Model<DepartmentDocument>,
  ) {
    super(nModel);
  }

  public findAll(query: GetAllDepartmentsDto) {
    const { limit, page, paginate, sortBy, order } = query || {};
    const matchQuery = {};

    if (query.tags) {
      matchQuery['oneSignalTags'] = {
        $in: query.tags.map((tag) => new RegExp(tag, 'gi')),
      };
    }
    if (query.name) {
      matchQuery['$or'] = [
        { name: { $regex: new RegExp(query.name, 'gi') } },
        {
          'translation.name': {
            $regex: new RegExp(query.name, 'gi'),
          },
        },
      ];
    }
    return this.aggregate(
      [
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: 'departments',
            as: 'departmentEmployees',
          },
        },
        { $match: matchQuery },
        {
          $group: {
            _id: '$_id',
            name: { $first: '$name' },
            oneSignalTags: { $first: '$oneSignalTags' },
            translation: { $first: '$translation' },
            createdAt: { $first: '$createdAt' },
            updatedAt: { $first: '$updatedAt' },
            status: { $first: '$status' },
            departmentEmployees: { $first: '$departmentEmployees' },
          },
        },
        {
          $project: {
            name: 1,
            translation: 1,
            oneSignalTags: 1,
            createdAt: 1,
            updatedAt: 1,
            status: 1,
            ActiveEmployees: {
              $size: {
                $filter: {
                  input: '$departmentEmployees',
                  cond: { $eq: ['$$this.status', ACTIVE] },
                },
              },
            },

            InActiveEmployees: {
              $size: {
                $filter: {
                  input: '$departmentEmployees',
                  cond: { $eq: ['$$this.status', IN_ACTIVE] },
                },
              },
            },
          },
        },
        {
          $sort: { [sortBy]: order },
        },
      ],
      { limit, page, sort: { [sortBy]: order }, paginate },
    );
  }
}
