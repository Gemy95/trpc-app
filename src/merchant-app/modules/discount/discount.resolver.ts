import { BaseQuery } from '../common/dto/BaseQuery.dto';
import { Discount } from '../models';
import { Permissions } from '../common/decorators';
import discountPermissions from '../common/permissions/discount.permissions';
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PermissionsGuard } from '../common/guards';
import { UseGuards } from '@nestjs/common';
import { ValidateMongoId } from '../common/pipes/validate-mongo-id.pipe';

@Resolver('')
@UseGuards(PermissionsGuard)
export class DiscountResolver {
  constructor(private readonly discountService: DiscountService) {}

  @Permissions(discountPermissions.ALL_PERMISSION.value, discountPermissions.CREATE_PERMISSION.value)
  @Mutation('createDiscount')
  create(@Args('createDiscountDto') createDiscountDto: CreateDiscountDto) {
    return this.discountService.create(createDiscountDto);
  }

  @Permissions(discountPermissions.ALL_PERMISSION.value, discountPermissions.READ_PERMISSION.value)
  @Query('findAllDiscounts')
  findAll() {
    return this.discountService.findAll();
  }

  @Permissions(discountPermissions.ALL_PERMISSION.value, discountPermissions.READ_PERMISSION.value)
  @Query('findAllDiscountByMerchantId')
  findAllByMerchantId(@Args('merchantId', ValidateMongoId) merchantId: string, @Args('query') query: BaseQuery) {
    return this.discountService.findAllByMerchantId(merchantId, query);
  }

  @Permissions(discountPermissions.ALL_PERMISSION.value, discountPermissions.READ_PERMISSION.value)
  @Query('findOneDiscount')
  findOne(@Args('id') id: string): Promise<Discount> {
    return this.discountService.findOne(id);
  }

  @Permissions(discountPermissions.ALL_PERMISSION.value, discountPermissions.UPDATE_PERMISSION.value)
  @Mutation('updateDiscount')
  update(@Args('id') id: string, @Args('updateDiscountDto') updateDiscountDto: UpdateDiscountDto): Promise<Discount> {
    return this.discountService.update(id, updateDiscountDto);
  }

  @Permissions(discountPermissions.ALL_PERMISSION.value, discountPermissions.UPDATE_PERMISSION.value)
  @Mutation('removeDiscount')
  remove(@Args('id') id: string): Promise<Discount> {
    return this.discountService.remove(id);
  }
}
