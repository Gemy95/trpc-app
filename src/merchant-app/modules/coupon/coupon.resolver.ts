import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { FindAllCouponsDto } from './dto/findAll-Coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import CouponPermissions from '../common/permissions/coupon.permissions';
import { Permissions } from '../common/decorators';
import { PermissionsGuard } from '../common/guards/permission.guard';
import { CheckCouponDto } from './dto/check-coupon.dto';
import { CurrentUser } from '../auth/shared/decorator/user.graphql.decorator';

@Resolver('/')
export class CouponResolver {
  constructor(private readonly couponService: CouponService) {}

  @Permissions(CouponPermissions.ALL_PERMISSION.value, CouponPermissions.CREATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Mutation('merchantCreateCoupon')
  create(@Args('createCouponDto') createCouponDto: CreateCouponDto) {
    return this.couponService.create(createCouponDto);
  }

  @Permissions(CouponPermissions.ALL_PERMISSION.value, CouponPermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Query('merchantFindAllCoupons')
  findAll(@Args('merchantId') merchantId: string, @Args('query') query: FindAllCouponsDto) {
    return this.couponService.getAll(merchantId, query);
  }

  @Permissions(CouponPermissions.ALL_PERMISSION.value, CouponPermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Query('merchantFindOneCoupon')
  getOne(@Args('merchantId') merchantId: string, @Args('couponId') couponId: string) {
    return this.couponService.getOne(merchantId, couponId);
  }

  @Permissions(CouponPermissions.ALL_PERMISSION.value, CouponPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Mutation('merchantUpdateCoupon')
  update(
    @Args('merchantId') merchantId: string,
    @Args('couponId') couponId: string,
    @Args('updateCouponDto') updateCouponDto: UpdateCouponDto,
  ) {
    return this.couponService.updateOne(merchantId, couponId, updateCouponDto);
  }

  @Permissions(CouponPermissions.ALL_PERMISSION.value, CouponPermissions.DELETE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Mutation('merchantDeleteCoupon')
  deleteOne(@Args('merchantId') merchantId: string, @Args('couponId') couponId: string) {
    return this.couponService.deleteOne(merchantId, couponId);
  }

  @Mutation('merchantCheckCoupon')
  check(@Args('checkCouponDto') checkCouponDto: CheckCouponDto, @CurrentUser() user: any) {
    return this.couponService.check(checkCouponDto);
  }
}
