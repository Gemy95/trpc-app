import { Test, TestingModule } from '@nestjs/testing';
import { CouponService } from '../coupon.service';
import { CouponResolver } from '../coupon.resolver';
import { couponStub, createStub, findAllStub, findOneStub, updateOneStub, removeStub } from './stubs/coupon.stub';
import { CreateCouponDto } from '../dto/create-coupon.dto';
import { UpdateCouponDto } from '../dto/update-coupon.dto';
import { FindAllCouponsDto } from '../dto/findAll-Coupon.dto';

jest.mock('../coupon.service.ts');

describe('CouponResolver', () => {
  let couponResolver: CouponResolver;
  let couponService: CouponService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CouponResolver, CouponService],
    }).compile();

    couponResolver = module.get<CouponResolver>(CouponResolver);
    couponService = module.get<CouponService>(CouponService);
    jest.clearAllMocks();
  });

  describe('Create', () => {
    describe('Once Create is called', () => {
      let createCouponDto: CreateCouponDto;
      let coupon;

      beforeEach(async () => {
        coupon = await couponResolver.create(createCouponDto);
      });

      it('Should call couponService', () => {
        expect(couponService.create).toHaveBeenCalledWith(createCouponDto);
      });

      it('Should return created coupon', () => {
        expect(coupon).toEqual(createStub());
      });
    });
  });

  describe('findAll', () => {
    describe('Once findAll is called', () => {
      let coupons;
      let query: FindAllCouponsDto;
      beforeEach(async () => {
        coupons = await couponResolver.findAll(couponStub().merchantId.toString(), query);
      });

      it('Should call couponService', () => {
        expect(couponService.getAll).toBeCalledWith(couponStub().merchantId.toString(), query);
      });

      it('Should return coupons details', () => {
        expect(coupons).toEqual(findAllStub());
      });
    });
  });

  describe('findOne', () => {
    describe('Once findOne is called', () => {
      let coupon;
      beforeEach(async () => {
        coupon = await couponResolver.getOne(couponStub().merchantId.toString(), couponStub()._id);
      });

      it('Should call couponService', () => {
        expect(couponService.getOne).toBeCalledWith(couponStub().merchantId.toString(), couponStub()._id);
      });

      it('Should return coupon details', () => {
        expect(coupon).toEqual(findOneStub());
      });
    });
  });

  describe('updateOne', () => {
    describe('Once updateOne is called', () => {
      let coupon;
      let updateCouponDto: UpdateCouponDto;
      beforeEach(async () => {
        coupon = await couponResolver.update(couponStub().merchantId.toString(), couponStub()._id, updateCouponDto);
      });

      it('Should call couponService', () => {
        expect(couponService.updateOne).toBeCalledWith(
          couponStub().merchantId.toString(),
          couponStub()._id,
          updateCouponDto,
        );
      });

      it('Should return updated coupon', () => {
        expect(coupon).toEqual(updateOneStub());
      });
    });
  });

  describe('remove', () => {
    describe('Once remove is called', () => {
      let coupon;

      beforeEach(async () => {
        coupon = await couponResolver.deleteOne(couponStub().merchantId.toString(), couponStub()._id);
      });

      it('Should call couponService', () => {
        expect(couponService.deleteOne).toBeCalledWith(couponStub().merchantId.toString(), couponStub()._id);
      });

      it('Should delete coupon', () => {
        expect(coupon).toEqual(removeStub());
      });
    });
  });
});

// nx test --test-file coupon.resolver.spec.ts
