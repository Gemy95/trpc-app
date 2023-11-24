import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/shared/decorator/user.graphql.decorator';
import { Permissions } from '../common/decorators';
import { PermissionsGuard } from '../common/guards/permission.guard';
import productPermissions from '../common/permissions/product.permissions';
import { ValidateMongoId } from '../common/pipes/validate-mongo-id.pipe';
import { CreateProductDto } from './dto/create-product.dto';
import { GetAllProductDto } from './dto/get-all-product.input';
import { ReorderSerialNumberDto } from './dto/reorder-product-serial.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@Resolver('')
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Mutation('createProduct')
  @Permissions(productPermissions.ALL_PERMISSION.value, productPermissions.CREATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  create(
    @CurrentUser() user: any,
    @Args('createDto') createDto: CreateProductDto,
    @Args('merchantId', ValidateMongoId) merchantId: string,
  ) {
    return this.productService.create(user, createDto, merchantId);
  }

  @Query('findOneProduct')
  @Permissions(productPermissions.ALL_PERMISSION.value, productPermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  findOne(
    @Args('merchantId', ValidateMongoId) merchantId: string,
    @Args('productId', ValidateMongoId) productId: string,
  ) {
    return this.productService.findOne(productId, merchantId);
  }

  @Mutation('updateOneProduct')
  @Permissions(productPermissions.ALL_PERMISSION.value, productPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  updateOne(
    @Args('merchantId', ValidateMongoId) merchantId: string,
    @Args('productId', ValidateMongoId) productId: string,
    @Args('updateProductDto') updateProductDto: UpdateProductDto,
  ) {
    return this.productService.updateOne(productId, updateProductDto, merchantId);
  }

  @Query('findAllProducts')
  @Permissions(productPermissions.ALL_PERMISSION.value, productPermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  findAll(
    @Args('getAllProductsDto') getAllProductsDto: GetAllProductDto,
    @Args('merchantId', ValidateMongoId) merchantId: string,
    @CurrentUser() user: any,
  ) {
    return this.productService.findAll(getAllProductsDto, merchantId, user);
  }

  @Mutation('removeProduct')
  @Permissions(productPermissions.ALL_PERMISSION.value, productPermissions.DELETE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  remove(
    @Args('merchantId', ValidateMongoId) merchantId: string,
    @Args('productId', ValidateMongoId) productId: string,
  ) {
    return this.productService.remove(productId, merchantId);
  }

  @Mutation('serialsReorderProduct')
  @Permissions(productPermissions.ALL_PERMISSION.value, productPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  reOrderSerialNumber(@Args('reorderSerialNumber') reorderSerialNumber: ReorderSerialNumberDto) {
    return this.productService.reOrderSerialNumber(reorderSerialNumber);
  }

  @Mutation('serialsReorderProductGroupsOrders')
  @Permissions(productPermissions.ALL_PERMISSION.value, productPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  serialsReorderProductGroupsOrders(
    @Args('productId') productId: string,
    @Args('reorderSerialNumber') reorderSerialNumber: ReorderSerialNumberDto,
  ) {
    return this.productService.serialsReorderProductGroupsOrders(productId, reorderSerialNumber);
  }
}
