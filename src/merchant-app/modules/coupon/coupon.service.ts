import { Injectable } from '@nestjs/common';
import { CouponRepository } from '../models';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { FindAllCouponsDto } from './dto/findAll-Coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { CheckCouponDto } from './dto/check-coupon.dto';

@Injectable()
export class CouponService {
  constructor(private readonly couponRepository: CouponRepository) {}

  async create(createCouponDto: CreateCouponDto) {
    return this.couponRepository.createOne(createCouponDto);
  }

  async getAll(merchantId: string, query: FindAllCouponsDto) {
    return this.couponRepository.getAll(merchantId, query);
  }

  async getOne(merchantId: string, id: string) {
    return this.couponRepository.findOne(merchantId, id);
  }

  async updateOne(merchantId: string, id: string, updateCouponDto: UpdateCouponDto) {
    return this.couponRepository.updateOne(merchantId, id, updateCouponDto);
  }

  async deleteOne(merchantId: string, id: string) {
    return this.couponRepository.remove(merchantId, id);
  }

  async check(checkCouponDto: CheckCouponDto) {
    return this.couponRepository.checkCouponIsValid(checkCouponDto);
  }
}
