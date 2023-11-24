import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import moment from 'moment-timezone';
import mongoose, { Model } from 'mongoose';

import { ClientRepository, OrderRepository } from '..';
import { Coupon } from '../../../../libs/database/src/lib/models/coupon/coupon.schema';
import { ERROR_CODES } from '../../../../libs/utils/src';
import { COUPON_STATUS } from '../../common/constants/coupon.constants';
import { AMOUNT_TYPE } from '../../common/constants/order.constants';
import generateFilters from '../../common/utils/generate-filters';
import { CheckCouponDto } from '../../coupon/dto/check-coupon.dto';
import { CreateCouponDto } from '../../coupon/dto/create-coupon.dto';
import { FindAllCouponsDto } from '../../coupon/dto/findAll-Coupon.dto';
import { UpdateCouponDto } from '../../coupon/dto/update-coupon.dto';
import { Item } from '../../order/dto/create-order.dto';
import { BaseRepository } from '../BaseRepository';
import { BranchRepository } from '../branch/branch.repository';

@Injectable()
export class CouponRepository extends BaseRepository<Coupon> {
  formatDate = 'YYYY-MM-DD';
  constructor(
    @InjectModel(Coupon.name) private readonly nModel: Model<Coupon>,
    private readonly branchRepository: BranchRepository,
    private readonly orderRepository: OrderRepository,
    private readonly clientRepository: ClientRepository,
  ) {
    super(nModel);
  }

  async createOne(createCouponDto: CreateCouponDto) {
    const isCouponExists = await this.getOne(
      { code: createCouponDto.code, branchId: new mongoose.Types.ObjectId(createCouponDto.branchId) },
      { lean: true },
    );

    if (isCouponExists) {
      throw new ConflictException(ERROR_CODES.err_coupon_already_exists);
    }

    if (!createCouponDto.discount_amount && !createCouponDto.free_delivery) {
      throw new BadRequestException(ERROR_CODES.err_coupon_must_has_discount_amount_or_free_delivery);
    }

    if (
      moment(createCouponDto.expired_at).isBefore(moment(createCouponDto.valid_from).format(this.formatDate), 'day')
    ) {
      throw new BadRequestException(ERROR_CODES.err_coupon_expired_at_is_before_valid_from_date);
    }

    return this.create({
      ...createCouponDto,
      merchantId: new mongoose.Types.ObjectId(createCouponDto.merchantId),
      branchId: new mongoose.Types.ObjectId(createCouponDto.branchId),
      productsIds: createCouponDto?.productsIds?.map((ele) => {
        return new mongoose.Types.ObjectId(ele);
      }),
    });
  }

  async getAll(merchantId: string, params: FindAllCouponsDto) {
    const { limit, page, paginate, ...rest } = params;
    const generatedMatch = generateFilters(rest);

    if (generatedMatch['branches']) {
      delete Object.assign(generatedMatch, {
        'branch._id': generatedMatch['branches'],
      })['branches'];
    }

    if (generatedMatch['products']) {
      delete Object.assign(generatedMatch, {
        'products._id': generatedMatch['products'],
      })['products'];
    }

    const coupons = await this.aggregate([
      {
        $match: {
          merchantId: new mongoose.Types.ObjectId(merchantId),
        },
      },
      {
        $lookup: {
          from: 'branches',
          localField: 'branchId',
          foreignField: '_id',
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
          from: 'products',
          localField: 'productsIds',
          foreignField: '_id',
          as: 'products',
        },
      },
      {
        $match: { ...generatedMatch },
      },
      {
        $skip: page <= 0 ? 0 : limit * page,
      },
      {
        $limit: limit,
      },
    ]);
    return coupons;
  }

  async findOne(merchantId: string, id: string) {
    const [coupon] = await this._model.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
          merchantId: new mongoose.Types.ObjectId(merchantId),
        },
      },
    ]);

    if (!coupon) {
      throw new NotFoundException(ERROR_CODES.err_coupon_not_found);
    }
    return coupon;
  }

  async updateOne(merchantId: string, id: string, updateCouponDto: UpdateCouponDto) {
    const coupon = await this.findOne(merchantId, id);

    const couponCodeIsExists = await this.checkCodeIsExists(merchantId, coupon.branchId, coupon.code, id);

    if (
      updateCouponDto?.valid_from &&
      updateCouponDto?.expired_at &&
      moment(updateCouponDto.expired_at).isBefore(moment(updateCouponDto.valid_from).format(this.formatDate), 'day')
    ) {
      throw new BadRequestException(ERROR_CODES.err_coupon_expired_at_is_before_valid_from_date);
    }

    if (
      !(updateCouponDto?.discount_amount || coupon.discount_amount) &&
      !(updateCouponDto?.free_delivery || coupon.free_delivery)
    ) {
      throw new BadRequestException(ERROR_CODES.err_coupon_must_has_discount_amount_or_free_delivery);
    }

    return this.updateById(
      id,
      {
        ...updateCouponDto,
        // merchantId: updateCouponDto?.merchantId ? new mongoose.Types.ObjectId(updateCouponDto.merchantId) : undefined,
        // branchId: updateCouponDto?.branchId ? new mongoose.Types.ObjectId(updateCouponDto.branchId) : undefined,
        productsIds:
          Array.isArray(updateCouponDto?.productsIds) && updateCouponDto?.productsIds?.length > 0
            ? updateCouponDto?.productsIds?.map((ele) => {
                return new mongoose.Types.ObjectId(ele);
              })
            : undefined,
      },
      { lean: true, new: true },
      {},
    );
  }

  async remove(merchantId: string, id: string) {
    const coupon = await this.findOne(merchantId, id);
    if (!coupon) {
      throw new NotFoundException(ERROR_CODES.err_coupon_not_found);
    }
    await this.deleteById(id);
    return { success: true };
  }

  async findByCode(code: string) {
    const [coupon] = await this._model.aggregate([
      {
        $match: {
          code: code,
        },
      },
    ]);

    if (!coupon) {
      throw new NotFoundException(ERROR_CODES.err_coupon_not_found);
    }
    return coupon;
  }

  async checkCodeIsExists(merchantId: string, branchId: string, code: string, id: string) {
    const [coupon] = await this._model.aggregate([
      {
        $match: {
          _id: {
            $ne: new mongoose.Types.ObjectId(id),
          },
          merchantId: new mongoose.Types.ObjectId(merchantId),
          branchId: new mongoose.Types.ObjectId(branchId),
          code: code,
        },
      },
    ]);

    if (coupon) {
      throw new BadRequestException(ERROR_CODES.err_coupon_code_already_exists);
    }

    return coupon;
  }

  async checkCouponIsValid(checkCouponDto: CheckCouponDto) {
    const branch = await this.branchRepository.getOne(
      { _id: new mongoose.Types.ObjectId(checkCouponDto.branchId) },
      { lean: true },
    );

    const coupon = await this.findByCode(checkCouponDto.code);

    if (coupon.status == COUPON_STATUS.In_Active) {
      throw new BadRequestException(ERROR_CODES.err_coupon_is_not_active);
    }

    if (branch._id.toString() != coupon.branchId.toString()) {
      throw new BadRequestException(ERROR_CODES.err_coupon_branch_not_matched);
    }

    const client = await this.clientRepository.getOne({ _id: new mongoose.Types.ObjectId(checkCouponDto.clientId) });

    // if (!client) {
    //   throw new BadRequestException(ERROR_CODES.err_client_not_found);
    // }

    const isProductCoupon = coupon?.productsIds
      .map((ele) => {
        return ele.toString();
      })
      .some((ele) => {
        return checkCouponDto.items
          .map((ele2) => {
            return ele2.productId.toString();
          })
          .includes(ele);
      });

    if (!coupon?.productsIds || coupon?.productsIds.length == 0 || !isProductCoupon) {
      throw new BadRequestException(ERROR_CODES.err_coupon_is_not_match_product);
    }

    if (coupon.orderType != checkCouponDto.orderType) {
      throw new BadRequestException(ERROR_CODES.err_coupon_order_type_not_matched);
    }

    if (moment().isBefore(moment(coupon.valid_from).format(this.formatDate), 'day')) {
      throw new BadRequestException(ERROR_CODES.err_coupon_valid_from_date_greater_than_now);
    }

    if (moment().isAfter(moment(coupon.expired_at).format(this.formatDate), 'day')) {
      throw new BadRequestException(ERROR_CODES.err_coupon_is_expired);
    }

    const countCouponUsedPerClient = await this.countCouponUsePerClient(coupon._id.toString(), checkCouponDto.clientId);
    if (client && countCouponUsedPerClient >= coupon.max_use_per_client) {
      throw new BadRequestException(ERROR_CODES.err_coupon_max_use_per_client);
    }

    const countCouponUsedPerClients = await this.countCouponUsePerClients(coupon._id.toString());
    if (client && countCouponUsedPerClients >= coupon.total_max_use) {
      throw new BadRequestException(ERROR_CODES.err_coupon_max_use_per_clients);
    }

    const isNewClient = await this.isNewClientUseCoupon(checkCouponDto.clientId);
    if (client && coupon?.is_new_client && !isNewClient) {
      throw new BadRequestException(ERROR_CODES.err_coupon_must_be_for_new_client);
    }

    const clientOrdersCount = await this.clientTotalOrdersCount(checkCouponDto.clientId);
    if (
      client &&
      coupon?.client_orders_count_more_than > 0 &&
      coupon.client_orders_count_more_than >= clientOrdersCount
    ) {
      throw new BadRequestException(ERROR_CODES.err_coupon_client_orders_count_less_than_current_count);
    }

    return coupon;
  }

  async countCouponUsePerClient(couponId: string, clientId: string) {
    const count = await this.orderRepository.countCouponUsePerClient(couponId, clientId);
    return count;
  }

  async countCouponUsePerClients(couponId: string) {
    const count = await this.orderRepository.countCouponUsePerClients(couponId);
    return count;
  }

  async isNewClientUseCoupon(clientId: string) {
    const count = await this.orderRepository.isNewClientUseCoupon(clientId);
    return count == 0;
  }

  async clientTotalOrdersCount(clientId: string) {
    const count = await this.orderRepository.clientTotalOrdersCount(clientId);
    return count;
  }

  async calculateCouponDiscount(code: string, totalItemsPrice: number) {
    const coupon = await this.findByCode(code);

    const max_discount_amount = coupon.max_discount_amount;
    const lowest_cart_price = coupon.lowest_cart_price;
    const discount_amount = coupon.discount_amount;
    const discount_type = coupon.discount_type;
    const free_delivery = coupon.free_delivery;

    if (lowest_cart_price && lowest_cart_price > 0 && lowest_cart_price > totalItemsPrice) {
      throw new BadRequestException(ERROR_CODES.err_coupon_order_items_prices_less_than_lowest_cart_price);
    }

    let discountValue = 0;
    if (discount_amount) {
      discountValue =
        discount_type == AMOUNT_TYPE.PERCENTAGE
          ? totalItemsPrice * (discount_amount / 100) > max_discount_amount
            ? max_discount_amount
            : totalItemsPrice * (discount_amount / 100)
          : (totalItemsPrice < discount_amount ? totalItemsPrice : discount_amount) > max_discount_amount
          ? max_discount_amount
          : totalItemsPrice < discount_amount
          ? totalItemsPrice
          : discount_amount;
    }

    return {
      name: 'Coupon Discount',
      amount: discountValue,
      type: AMOUNT_TYPE.FIXED,
      translation: [
        {
          _lang: 'ar',
          name: 'خصم الكوبون',
        },
      ],
    };
  }
}
