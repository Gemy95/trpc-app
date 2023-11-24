import { Injectable, NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import moment from 'moment-timezone';
import mongoose, { Types } from 'mongoose';

import { ERROR_CODES } from '../../../libs/utils/src';
import {
  BRANCH_REQUEST_TYPES,
  BRANCH_STATUS,
  BRANCH_STATUS_TAGS,
  ONLINE_STATUS,
} from '../common/constants/branch.constants';
import { TRANSACTION_TYPE } from '../common/constants/transaction.constants';
import { BaseQuery } from '../common/dto/BaseQuery.dto';
import {
  Branch,
  BranchRepository,
  MenuTemplateRepository,
  MerchantRepository,
  ProductCategoryRepository,
  ProductRepository,
  TagRepository,
  Transaction,
  TransactionRepository,
} from '../models';
import { ProductService } from '../product/product.service';
import { BranchRequestsService } from '../requests/branch-requests.service';
import { MerchantGateWay } from '../socket/merchant.gateway';
import { ChangeStatusDto } from './dto/change-status.dto';
import { CreateBranchDto } from './dto/create-branch.dto';
import { FindAllBranchDto } from './dto/find-all-filter.dto';
import { UpdateBranchByShoppexEmployeeDto } from './dto/update-branch-by-shoppex-employee.dto';
import { UpdateBranchStatusByMerchantEmployeeOrOwnerDto } from './dto/update-branch-status-by-merchant-employee-or-owner.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Injectable()
export class BranchService {
  constructor(
    private readonly branchRepository: BranchRepository,
    private readonly productService: ProductService,
    private readonly merchantGateWay: MerchantGateWay,
    private readonly merchantRepository: MerchantRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly branchRequestsService: BranchRequestsService,
    private readonly menuTemplateRepository: MenuTemplateRepository,
    private readonly productRepository: ProductRepository,
    private readonly tagRepository: TagRepository,
    private readonly productCategoryRepository: ProductCategoryRepository,
  ) {}

  async create(user: any, merchantId: string, createBranchDto: CreateBranchDto) {
    const newBranch = new Branch();
    newBranch.name = createBranchDto.nameArabic;
    newBranch.mobile = createBranchDto.mobile;
    newBranch.workingHours = createBranchDto.workingHours;
    newBranch.reservationsDays = createBranchDto.reservationsDays;
    newBranch.reservationsSettings = createBranchDto?.reservationsSettings;
    newBranch.reservationsInstructions = createBranchDto.reservationsInstructions;
    newBranch.pickupInstructions = createBranchDto.pickupInstructions;
    newBranch.deliveryInstructions = createBranchDto.deliveryInstructions;
    newBranch.locationDelta = [createBranchDto.longitudeDelta, createBranchDto.latitudeDelta];
    newBranch.location = {
      type: 'Point',
      coordinates: [createBranchDto.longitude, createBranchDto.latitude],
    };
    newBranch.translation = [
      {
        _lang: 'en',
        name: createBranchDto.nameEnglish,
      },
    ];
    newBranch.merchantId = new mongoose.Types.ObjectId(merchantId);
    newBranch.ownerId = new mongoose.Types.ObjectId(user._id);
    newBranch.cityId = new mongoose.Types.ObjectId(createBranchDto.cityId);
    newBranch.branchGroup =
      createBranchDto?.branchGroup && mongoose.Types.ObjectId.isValid(createBranchDto?.branchGroup)
        ? new mongoose.Types.ObjectId(createBranchDto.branchGroup)
        : undefined;
    newBranch.self_delivery = createBranchDto?.self_delivery || false;
    // newBranch.initial_store_fee = createBranchDto?.initial_store_fee;
    newBranch.store_delivery_fee = createBranchDto?.store_delivery_fee;
    newBranch.fees_delivery_per_kilometer = createBranchDto?.fees_delivery_per_kilometer;

    if (createBranchDto?.self_delivery && !createBranchDto?.store_delivery_fee) {
      throw new BadRequestException(ERROR_CODES.err_self_delivery_must_has_store_delivery_fee);
    }

    const createdBranch = await new Promise((resolve, reject) => {
      this.branchRepository
        .create(newBranch)
        .then((data) => {
          // this.branchRequestsService.create(data._id, BRANCH_REQUEST_TYPES.DATA, createBranchDto, user._id);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
          throw new Error(error);
        });
    });

    const merchant = await this.merchantRepository.updateOne(
      { _id: new mongoose.Types.ObjectId(merchantId) },
      {
        $inc: { branchesNumber: 1 },
      },
    );

    if (createBranchDto?.products) {
      if (createBranchDto?.products === 'all') {
        await this.productService.addBranch(merchantId, createdBranch['_id'].toString());
      } else {
        await this.productService.addBranch(merchantId, createdBranch['_id'].toString(), createBranchDto.products);
      }
    }

    return createdBranch;
  }

  findAll(merchantId: string, query?: FindAllBranchDto, user?: any) {
    return this.branchRepository.findAll(merchantId, query, user);
  }

  findOne(branchId: string, merchantId: string) {
    return this.branchRepository.getOne({
      _id: branchId,
      merchantId: new Types.ObjectId(merchantId),
      isDeleted: false,
    });
  }

  remove(branchId: string, merchantId: string) {
    return this.branchRepository.updateOne(
      {
        isDeleted: false,
        _id: new Types.ObjectId(branchId),
        merchantId: new Types.ObjectId(merchantId),
      },
      { isDeleted: true },
      { new: true, lean: true },
    );
  }

  reApply(branchId: string, merchantId: string) {
    return this.branchRepository.updateOne(
      {
        isDeleted: false,
        _id: new Types.ObjectId(branchId),
        merchantId: new Types.ObjectId(merchantId),
        status: BRANCH_STATUS.REJECTED_STATUS,
      },
      {
        status: BRANCH_STATUS.PENDING_STATUS,
      },
      { new: true, lean: true },
    );
  }

  freezing(branchId: string, merchantId: string) {
    return this.branchRepository.updateOne(
      {
        isDeleted: false,
        _id: new Types.ObjectId(branchId),
        merchantId: new Types.ObjectId(merchantId),
      },
      {
        isFreezing: true,
      },
      { new: true, lean: true },
    );
  }

  public async onlineOrOffline(merchantId: string, branchId: string, changeStatusDto: ChangeStatusDto) {
    const { visibility_status, notes } = changeStatusDto;

    const updatebranch = await this.branchRepository.updateOne(
      {
        _id: new Types.ObjectId(branchId),
        merchantId: new Types.ObjectId(merchantId),
        isDeleted: false,
      },
      {
        visibility_status,
        notes,
      },
      { new: true, lean: true },
    );
    await this.merchantGateWay.emitBranchEvent(updatebranch);

    return updatebranch;
  }

  public async updateBranchStatusByOwnerOrMerchantEmployee(
    user: any,
    branchId: string,
    merchantId: string,
    updateDto: UpdateBranchStatusByMerchantEmployeeOrOwnerDto,
  ) {
    const updatebranch = await this.branchRepository.updateOne(
      {
        _id: new Types.ObjectId(branchId),
        ownerId: user._id,
        merchantId: new Types.ObjectId(merchantId),
      },
      { visibility_status: updateDto.visibility_status },
      { new: true, lean: true },
    );

    await this.merchantGateWay.emitBranchEvent(updatebranch);

    return updatebranch;
  }

  async getBranchDetails(branchId: string, merchantId: string) {
    return this.branchRepository.getBranchDetails(branchId, merchantId);
  }

  public async updateByShoppexEmployee(branchId: string, updateBranchDto: UpdateBranchByShoppexEmployeeDto) {
    const branch = await this.branchRepository.getOne({
      _id: new Types.ObjectId(branchId),
      isDeleted: false,
    });
    if (!branch) {
      throw new NotFoundException(ERROR_CODES.err_branch_not_found);
    }

    const data = {
      ...updateBranchDto,
      name: updateBranchDto?.nameArabic ? updateBranchDto.nameArabic : undefined,
      locationDelta:
        updateBranchDto?.longitudeDelta && updateBranchDto?.latitudeDelta
          ? [updateBranchDto.longitudeDelta, updateBranchDto.latitudeDelta]
          : undefined,
      location:
        updateBranchDto?.longitude && updateBranchDto?.latitude
          ? {
              type: 'Point',
              coordinates: [updateBranchDto.longitude, updateBranchDto.latitude],
            }
          : undefined,
      translation: updateBranchDto?.nameEnglish
        ? [
            {
              _lang: 'en',
              name: updateBranchDto.nameEnglish,
            },
          ]
        : undefined,
    };

    return await this.branchRepository.updateOne(
      {
        _id: new Types.ObjectId(branchId),
      },
      data,
    );
  }
  public async getOneBranch(id: string) {
    return this.branchRepository.getOne(
      {
        _id: new mongoose.Types.ObjectId(id),
      },
      { lean: true },
    );
  }

  public async isBranchOnline(id: string) {
    const isOnline = await this.branchRepository.getOne(
      {
        _id: new mongoose.Types.ObjectId(id),
        visibility_status: ONLINE_STATUS,
      },
      { lean: true },
    );
    if (isOnline) return true;
    else return false;
  }

  public async isBranchPublished(id: string) {
    const isPublished = await this.branchRepository.getOne(
      {
        _id: new mongoose.Types.ObjectId(id),
        status: BRANCH_STATUS.APPROVED_STATUS,
      },
      { lean: true },
    );
    if (isPublished) return true;
    else return false;
  }

  public async updateBranch(id: string, updateBranchDto: UpdateBranchDto) {
    const currentBranch = await this.branchRepository.getOne({ _id: new mongoose.Types.ObjectId(id) });

    const separationTimeBetweenEachReservation =
      updateBranchDto?.reservationsSettings?.separationTimeBetweenEachReservation ||
      currentBranch?.reservationsSettings?.separationTimeBetweenEachReservation ||
      0;

    const mappedReservationsDays =
      Array.isArray(updateBranchDto?.reservationsDays) && updateBranchDto?.reservationsDays?.length > 0
        ? updateBranchDto?.reservationsDays?.map((ele) => {
            const { workingHours, ...res } = ele;
            let resultWorkingHours = [];
            if (Array.isArray(workingHours) && workingHours?.length > 0) {
              workingHours?.forEach((ele2) => {
                const { startAt, endAt, ...res2 } = ele2;
                resultWorkingHours = [
                  ...new Set([...this.getHoursInRange(startAt, endAt, res2), ...resultWorkingHours]),
                ];
              });

              resultWorkingHours = this.removeDuplicates(resultWorkingHours)?.sort((a, b) =>
                a?.startAt?.localeCompare(b?.startAt),
              );
            }
            return {
              ...res,
              workingHours: resultWorkingHours,
            };
          })
        : undefined;

    // const mappedReservationsDays = updateBranchDto?.reservationsDays.
    // if (
    //   separationTimeBetweenEachReservation &&
    //   Array.isArray(mappedReservationsDays) &&
    //   mappedReservationsDays?.length > 0
    // ) {
    //   const format = 'hh:mm:ss';
    //   mappedReservationsDays = mappedReservationsDays?.map(ele => {
    //     const mappedWorkingHours = ele.workingHours.map(ele2 => {
    //       const startAt = moment(ele2.startAt, format)
    //         .add(separationTimeBetweenEachReservation, 'minutes')
    //         .format(format);
    //       const endAt = moment(ele2.endAt, format)
    //         .add(separationTimeBetweenEachReservation, 'minutes')
    //         .format(format);
    //       return { ...ele2, startAt, endAt };
    //     });
    //     return { ...ele, workingHours: mappedWorkingHours };
    //   });
    // }

    const updatedBranch = new Branch();
    updatedBranch.name = updateBranchDto?.nameArabic;
    updatedBranch.mobile = updateBranchDto?.mobile;
    updatedBranch.workingHours = updateBranchDto?.workingHours;
    updatedBranch.reservationsDays = mappedReservationsDays; //updateBranchDto?.reservationsDays;
    updatedBranch.reservationsSettings = updateBranchDto?.reservationsSettings;
    updatedBranch.reservationsInstructions = updateBranchDto?.reservationsInstructions;
    updatedBranch.pickupInstructions = updateBranchDto?.pickupInstructions;
    updatedBranch.deliveryInstructions = updateBranchDto?.deliveryInstructions;
    updatedBranch.location =
      updateBranchDto?.longitude && updateBranchDto?.latitude
        ? {
            type: 'Point',
            coordinates: [updateBranchDto?.longitude, updateBranchDto?.latitude],
          }
        : undefined;
    updatedBranch.cityId = updateBranchDto?.cityId && new mongoose.Types.ObjectId(updateBranchDto?.cityId);

    updatedBranch.translation = updateBranchDto?.nameEnglish && [
      {
        _lang: 'en',
        name: updateBranchDto?.nameEnglish,
      },
    ];

    updatedBranch.branchGroup =
      updateBranchDto?.branchGroup && new mongoose.Types.ObjectId(updateBranchDto?.branchGroup);
    updatedBranch.self_delivery = updateBranchDto?.self_delivery;
    // updatedBranch.initial_store_fee = updateBranchDto.initial_store_fee;
    updatedBranch.store_delivery_fee = updateBranchDto.store_delivery_fee;
    updatedBranch.fees_delivery_per_kilometer = updateBranchDto?.fees_delivery_per_kilometer;

    return this.branchRepository.updateOne({ _id: new mongoose.Types.ObjectId(id) }, updatedBranch, {
      new: true,
      lean: true,
    });
  }

  public publishBranch(id: string) {
    return this.branchRepository.updateOne(
      {
        _id: new Types.ObjectId(id),
      },
      {
        status: BRANCH_STATUS.APPROVED_STATUS,
        status_tags: BRANCH_STATUS_TAGS.PRODUCTION_READY_STATUS,
      },
      { new: true, lean: true },
    );
  }

  public async startBranchSubscription(id: string) {
    const branch = await this.branchRepository.getOne({
      _id: new Types.ObjectId(id),
      isDeleted: false,
    });

    if (!branch) {
      throw new NotFoundException(ERROR_CODES.err_branch_not_found);
    }

    if (branch?.start_subscription_date && moment(branch.start_subscription_date).isValid()) {
      throw new NotFoundException(ERROR_CODES.err_branch_already_has_subscription_date);
    }

    const merchant = await this.merchantRepository.getOne({
      _id: new Types.ObjectId(branch.merchantId.toString()),
      isDeleted: false,
    });

    if (!merchant) {
      throw new NotFoundException(ERROR_CODES.err_merchant_not_found);
    }

    if (!merchant.bankAccount) {
      throw new NotFoundException(ERROR_CODES.err_merchant_has_not_bank_account);
    }

    let amount = 100;

    if (merchant.subscriptions && moment(merchant.subscriptions.next_subscribe_payment_date).isValid()) {
      const currentSubscriptionsAmount = merchant.subscriptions.amount;
      const diffDates = moment.duration(moment(merchant.subscriptions.next_subscribe_payment_date).diff(moment()));

      const diffDays = Math.round(diffDates.asDays());
      if (diffDays == 0) {
        amount = 100 + currentSubscriptionsAmount;
      } else {
        amount = Math.ceil((diffDays * 100) / 30) + currentSubscriptionsAmount;
      }
    }

    await this.merchantRepository.updateOne(
      {
        _id: new Types.ObjectId(branch.merchantId.toString()),
      },
      {
        $set: {
          balance: merchant.balance > 0 && merchant.balance > amount ? merchant.balance - amount : merchant.balance,
          subscriptions: {
            amount: amount,
            started_subscribe_date: moment(),
            next_subscribe_payment_date: moment().add(30, 'days'),
          },
        },
      },
    );

    if (merchant.balance > 0 && merchant.balance > amount) {
      const createTransactionDto: Partial<Transaction> = {
        operationId: Date.now().toString().slice(5),
        amount: 0,
        operationType: TRANSACTION_TYPE.DESERVED,
        commission: amount,
      };
      await this.transactionRepository.create({ ...createTransactionDto });
    }

    return this.branchRepository.updateOne(
      {
        _id: new Types.ObjectId(id),
      },
      { $set: { start_subscription_date: moment() } },
      { new: true, lean: true },
    );
  }

  public getHoursInRange(start: string, end: string, res = {}) {
    const splittedStart = start.split(':');
    const splittedEnd = end.split(':');
    const startHour = parseInt(splittedStart[0]);
    const endHour = parseInt(splittedEnd[0]);
    const hours = [];
    for (let i = startHour; i < endHour; i++) {
      hours.push({
        startAt: `${i.toString().length == 1 ? '0' + i : i}:${splittedStart[1]}:${splittedStart[2]}`,
        endAt: `${(i + 1).toString().length == 1 ? '0' + (i + 1) : i + 1}:${splittedStart[1]}:${splittedStart[2]}`,
        ...res,
      });
    }
    return hours;
  }

  public removeDuplicates(arr) {
    return arr?.filter((obj, index) => {
      return index === arr?.findIndex((otherObj) => JSON.stringify(obj) === JSON.stringify(otherObj));
    });
  }
}
