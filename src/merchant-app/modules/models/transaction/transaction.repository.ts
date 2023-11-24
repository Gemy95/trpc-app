import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { Transaction } from '../../../../libs/database/src/lib/models/transaction/transaction.schema';
import generateFilters from '../../common/utils/generate-filters';
import generatePagination from '../../common/utils/generate-pagination';
import { GetAllTransactionDto } from '../../transactions/dtos/get-all-transaction.dto';
import { TransactionQueryDto } from '../../transactions/dtos/transaction-query.dto';
import { BaseRepository } from '../BaseRepository';
import { MerchantEmployeeRepository } from '../merchant-employee/merchant-employee.repository';

@Injectable()
export class TransactionRepository extends BaseRepository<Transaction> {
  constructor(
    @InjectModel(Transaction.name)
    private readonly nModel: Model<Transaction>,
    private merchantEmployeeRepository: MerchantEmployeeRepository,
  ) {
    super(nModel);
  }

  async findAll(query: TransactionQueryDto) {
    const { limit, page, ...rest } = query;

    const generatedMatch = generateFilters(rest);
    //const generatedSearch = generateFilters({ search });

    if (generatedMatch['clientId']) {
      delete Object.assign(generatedMatch, {
        'user._id': new mongoose.Types.ObjectId(generatedMatch['clientId']),
      })['clientId'];
    }

    if (generatedMatch['orderStatus']) {
      delete Object.assign(generatedMatch, {
        'order.status': generatedMatch['orderStatus'],
      })['orderStatus'];
    }

    if (generatedMatch['orderRefId']) {
      delete Object.assign(generatedMatch, {
        'order.orderRefId': generatedMatch['orderRefId'],
      })['orderRefId'];
    }

    if (generatedMatch['branchId']) {
      delete Object.assign(generatedMatch, {
        'branch._id': new mongoose.Types.ObjectId(generatedMatch['branchId']),
      })['branchId'];
    }

    if (generatedMatch['merchantId']) {
      delete Object.assign(generatedMatch, {
        to: new mongoose.Types.ObjectId(generatedMatch['merchantId']),
      })['merchantId'];
    }

    const pagination = generatePagination(limit, page);

    const result = await this.nModel.aggregate([
      {
        $lookup: {
          from: 'users',
          let: { clientId: '$from' },
          as: 'user',
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$_id', '$$clientId'] }],
                },
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                type: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'merchants',
          let: { merchantId: '$to' },
          as: 'merchant',
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$_id', '$$merchantId'] }],
                },
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                translation: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'orders',
          let: { orderId: '$orderId' },
          as: 'order',
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$_id', '$$orderId'] }],
                },
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$order',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'branches',
          let: { branchId: '$order.branchId' },
          as: 'branch',
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$_id', '$$branchId'] }],
                },
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$merchant',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$branch',
          preserveNullAndEmptyArrays: true,
        },
      },
      // {
      //   $addFields: {
      //     userId: { $toString: '$user._id' },
      //     branchId: { $toString: '$branch._id' },
      //     orderRefId: { $toString: '$order.orderRefId' },
      //   },
      // },
      {
        $match: generatedMatch,
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          _id: 1,
          from: '$user',
          to: '$merchant',
          operationId: 1,
          amount: 1,
          tax: { $concat: [{ $toString: '$tax' }, '%'] },
          commission: 1,
          operationType: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          order: 1,
          branch: 1,
        },
      },
      ...pagination,
    ]);

    const count = await this.nModel.countDocuments({
      ...generatedMatch,
    });

    const pagesCount = Math.ceil(count / limit) || 1;

    return { transactions: result, page: page, pages: pagesCount, length: count };
  }

  async getAllTransactionsByMerchantId(query: GetAllTransactionDto, user: any) {
    const { limit, page, paginate, ...rest } = query;

    const generatedMatch = generateFilters(rest);
    //const generatedSearch = generateFilters({ search });

    const employeeMatchQuery = {};

    if (user?.type === 'MerchantEmployee') {
      const branchesIds = (await this.merchantEmployeeRepository.getOne({ _id: user?._id }))?.branchesIds || [];
      employeeMatchQuery['order.branchId'] = {
        $in: branchesIds,
      };
    }

    if (generatedMatch['clientId']) {
      delete Object.assign(generatedMatch, {
        'user._id': new mongoose.Types.ObjectId(generatedMatch['clientId']),
      })['clientId'];
    }

    if (generatedMatch['orderStatus']) {
      delete Object.assign(generatedMatch, {
        'order.status': generatedMatch['orderStatus'],
      })['orderStatus'];
    }

    if (generatedMatch['orderRefId']) {
      delete Object.assign(generatedMatch, {
        'order.orderRefId': generatedMatch['orderRefId'],
      })['orderRefId'];
    }

    if (generatedMatch['branchId']) {
      delete Object.assign(generatedMatch, {
        'branch._id': new mongoose.Types.ObjectId(generatedMatch['branchId']),
      })['branchId'];
    }

    if (generatedMatch['merchantId']) {
      delete Object.assign(generatedMatch, {
        to: new mongoose.Types.ObjectId(generatedMatch['merchantId']),
      })['merchantId'];
    }

    const result = await this.aggregate([
      // {
      //   $match: {
      //     to: new mongoose.Types.ObjectId(query.merchantId),
      //   },
      // },
      {
        $lookup: {
          from: 'users',
          let: { clientId: { $toObjectId: '$from' } },
          as: 'user',
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$_id', '$$clientId'] }],
                },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'merchants',
          let: { merchantId: { $toObjectId: '$to' } },
          as: 'merchant',
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$_id', '$$merchantId'] }],
                },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'orders',
          let: { orderId: { $toObjectId: '$orderId' } },
          as: 'order',
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$_id', '$$orderId'] }],
                },
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$order',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'branches',
          let: { branchId: { $toObjectId: '$order.branchId' } },
          as: 'branch',
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$_id', '$$branchId'] }],
                },
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$merchant',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$branch',
          preserveNullAndEmptyArrays: true,
        },
      },
      // {
      //   $addFields: {
      //     userId: { $toString: '$user._id' },
      //     branchId: { $toString: '$branch._id' },
      //     orderRefId: { $toString: '$order.orderRefId' },
      //   },
      // },
      {
        $match: {
          ...generatedMatch,
          ...employeeMatchQuery,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          _id: 1,
          from: '$user',
          to: '$merchant',
          operationId: 1,
          amount: 1,
          tax: { $concat: [{ $toString: '$tax' }, '%'] },
          commission: 1,
          operationType: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          order: 1,
          branch: 1,
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

  async getTransactionById(transactionId: string) {
    const [result] = await this.nModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(transactionId),
        },
      },
      {
        $lookup: {
          from: 'users',
          let: { clientId: { $toObjectId: '$from' } },
          as: 'user',
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$_id', '$$clientId'] }],
                },
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                type: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'merchants',
          let: { merchantId: { $toObjectId: '$to' } },
          as: 'merchant',
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$_id', '$$merchantId'] }],
                },
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                translation: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'orders',
          let: { orderId: { $toObjectId: '$orderId' } },
          as: 'order',
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$_id', '$$orderId'] }],
                },
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$order',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'branches',
          let: { branchId: { $toObjectId: '$order.branchId' } },
          as: 'branch',
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$_id', '$$branchId'] }],
                },
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$merchant',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$branch',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          from: '$user',
          to: '$merchant',
          operationId: 1,
          amount: 1,
          tax: { $concat: [{ $toString: '$tax' }, '%'] },
          commission: 1,
          operationType: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          order: 1,
          branch: 1,
        },
      },
    ]);

    return result;
  }
}
