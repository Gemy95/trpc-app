import { ProductGroupService } from './product-group.service';
import { CreateProductGroupDto } from './dto/create-product-group.dto';
import productGroupPermissions from '../common/permissions/product-group.permissions';
import { Permissions } from '../common/decorators';
import { GetAllProductGroupDto, GetAllProductGroupInput } from './dto/get-product-group.dto';
import { UpdateProductGroupDto } from './dto/update-product-group.dto';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '../common/guards/permission.guard';
import { ReorderSerialNumberDto } from './dto/reorder-product-group-serial.dto';
import { ValidateMongoId } from '../common/pipes/validate-mongo-id.pipe';

@Resolver('')
export class ProductGroupResolver {
  constructor(private readonly productGroupService: ProductGroupService) {}

  @Mutation('createProductGroup')
  @Permissions(productGroupPermissions.ALL_PERMISSION.value, productGroupPermissions.CREATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  create(
    @Args('merchantId', ValidateMongoId) merchantId: string,
    @Args('createProductGroupDto') createProductGroupDto: CreateProductGroupDto,
  ) {
    return this.productGroupService.create(merchantId, createProductGroupDto);
  }

  @Query('findAllProductGroup')
  @Permissions(productGroupPermissions.ALL_PERMISSION.value, productGroupPermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  findAll(
    @Args('merchantId', ValidateMongoId) merchantId: string,
    @Args('getAllProductGroupsDto') getAllProductGroupsDto: GetAllProductGroupInput,
  ) {
    return this.productGroupService.findAll(merchantId, getAllProductGroupsDto);
  }

  @Query('findOneProductGroup')
  findOne(
    @Args('merchantId', ValidateMongoId) merchantId: string,
    @Args('productGroupId', ValidateMongoId) productGroupId: string,
  ) {
    return this.productGroupService.findOne(merchantId, productGroupId);
  }

  @Mutation('updateProductGroup')
  update(
    @Args('merchantId', ValidateMongoId) merchantId: string,
    @Args('productGroupId', ValidateMongoId) productGroupId: string,
    @Args('updateProductGroupDto') updateProductGroupDto: UpdateProductGroupDto,
  ) {
    return this.productGroupService.update(merchantId, productGroupId, updateProductGroupDto);
  }
  @Mutation('removeProductGroup')
  remove(
    @Args('merchantId', ValidateMongoId) merchantId: string,
    @Args('productGroupId', ValidateMongoId) productGroupId: string,
  ) {
    return this.productGroupService.remove(merchantId, productGroupId);
  }

  @Mutation('serialsReorderProductGroup')
  reOrderSerialNumber(@Args('reorderSerialNumber') reorderSerialNumber: ReorderSerialNumberDto) {
    return this.productGroupService.reOrderSerialNumber(reorderSerialNumber);
  }

  @Mutation('serialsReorderProductGroupOption')
  reOrderSerialNumberOptions(
    @Args('productGroupId') productGroupId: string,
    @Args('reorderSerialNumber') reorderSerialNumber: ReorderSerialNumberDto,
  ) {
    return this.productGroupService.serialsReorderProductGroupOption(productGroupId, reorderSerialNumber);
  }
}
