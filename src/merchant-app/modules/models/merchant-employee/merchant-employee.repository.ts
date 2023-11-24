import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as _ from 'lodash';
import mongoose, { Model } from 'mongoose';

import { MerchantEmployee } from '../../../../libs/database/src/lib/models/merchant-employee/merchant-employee.schema';
import { BaseRepository } from '../BaseRepository';

@Injectable()
export class MerchantEmployeeRepository extends BaseRepository<MerchantEmployee> {
  constructor(
    @InjectModel('MerchantEmployee')
    private readonly nModel: Model<MerchantEmployee>,
  ) {
    super(nModel);
  }

  async create(data, session: mongoose.ClientSession | null = null): Promise<MerchantEmployee> {
    const document = new this.nModel.prototype.constructor(data);
    const merchantEmployee = session ? await document.save({ session }) : await document.save();
    return merchantEmployee.toObject();
  }

  async updateOne(query, data): Promise<MerchantEmployee> {
    const updatedEmployee = await this.nModel
      .findOneAndUpdate(query, data, { new: true, populate: ['cityId', 'countryId', 'branchesIds'] })
      .select({ password: 0 })
      .lean();

    Object.assign(updatedEmployee, {
      branches: updatedEmployee.branchesIds,
    });

    Object.assign(updatedEmployee, {
      branchesIds: updatedEmployee['branches'].map((branch) => branch._id),
    });

    return updatedEmployee;
  }

  async merchantEmployeeLogin(countryCode: string, mobile: string) {
    const [merchant_employee] = await this._model.aggregate([
      {
        $match: {
          mobile,
          countryCode,
        },
      },
      {
        $lookup: {
          from: 'merchants',
          as: 'merchant',
          let: { merchantField: '$merchantId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$_id', '$$merchantField'] }, { $eq: ['$isDeleted', false] }],
                },
              },
            },
            {
              $lookup: {
                from: 'cities',
                as: 'city',
                let: { cityField: '$cityId' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [{ $eq: ['$_id', '$$cityField'] }],
                      },
                    },
                  },
                  {
                    $lookup: {
                      from: 'countries',
                      localField: 'country',
                      foreignField: '_id',
                      as: 'countryId',
                    },
                  },
                  {
                    $unwind: {
                      path: '$countryId',
                      preserveNullAndEmptyArrays: true,
                    },
                  },
                ],
              },
            },
            {
              $unwind: {
                path: '$city',
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'branches',
          localField: 'branchesIds',
          foreignField: '_id',
          as: 'branches',
          // let: { merchantField: '$merchant._id' },
          // pipeline: [
          //   {
          //     $match: {
          //       $expr: {
          //         $and: [{ $in: ['$merchantId', '$$merchantField'] }, { $eq: ['$isDeleted', false] }],
          //       },
          //     },
          //   },
          // ],
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
        $lookup: {
          from: 'users',
          as: 'merchantEmployees',
          let: { merchantField: '$merchantId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$merchantId', '$$merchantField'] },
                    { $eq: ['$type', 'MerchantEmployee'] },
                    { $eq: ['$isDeleted', false] },
                  ],
                },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'orders',
          as: 'orders',
          let: { branchesField: '$branches._id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $in: ['$branchId', '$$branchesField'] }],
                },
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$merchant',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $unwind: {
          path: '$country',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          countryCode: 1,
          mobile: 1,
          email: 1,
          password: 1,
          country: 1,
          city: 1,
          uuid: 1,
          mobileIsVerified: 1,
          emailIsVerified: 1,
          isPasswordReset: 1,
          type: 1,
          status: 1,
          gender: 1,
          createdAt: 1,
          updatedAt: 1,
          dateOfBirth: 1,
          role: 1,
          isDeleted: 1,
          deletedAt: 1,
          allowReadTemplate: 1,
          allowCreateTemplate: 1,
          allowUpdateTemplate: 1,
          isTwoFactorAuthenticationEnabled: 1,
          merchant: {
            _id: 1,
            name: 1,
            description: 1,
            commercialRegistrationNumber: 1,
            commercialName: 1,
            branchesNumber: 1,
            hasDeliveryService: 1,
            address: 1,
            uuid: 1,
            status: 1,
            status_tags: 1,
            visibility_status: 1,
            ownerId: 1,
            logo: 1,
            identificationImage: 1,
            commercialIdImage: 1,
            balance: 1,
            location: 1,
            locationDelta: 1,
            notes: 1,
            isDeleted: 1,
            translation: 1,
            categoriesIds: 1,
            tagsIds: 1,
            cityId: 1,
            productsPriceRange: 1,
            twitterUrl: 1,
            facebookUrl: 1,
            websiteUrl: 1,
            snapUrl: 1,
            tiktokUrl: 1,
            mobile: 1,
            approvedBy: 1,
            inReview: 1,
            createdAt: 1,
            updatedAt: 1,
            rating: 1,
            isLiked: 1,
            'bankAccount._id': 1,
            'bankAccount.bank': { $ifNull: ['$bank', {}] },
            'bankAccount.nameOfPerson': 1,
            'bankAccount.accountNumber': 1,
            'bankAccount.iban': 1,
            'bankAccount.accountType': 1,
            'bankAccount.accountImageUrl': 1,
            'bankAccount.createdAt': 1,
            'bankAccount.updatedAt': 1,
            subscriptions: 1,
            city: 1,
            lowestPriceToOrder: 1,
            minimum_delivery_price: 1,
            status_before_deleted: 1,
            deletedAt: 1,
          },
          'merchant.country': { $ifNull: ['$merchant.city.countryId', {}] },
          branches: 1,
          totalMerchantEmployeesCount: { $size: { $ifNull: ['$merchantEmployees', []] } },
          totalOrdersCount: { $size: { $ifNull: ['$orders', []] } },
        },
      },
      { $limit: 1 },
    ]);

    return merchant_employee;
  }
}
