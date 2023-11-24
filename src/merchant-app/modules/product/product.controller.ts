import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { CurrentUser, Permissions } from '../common/decorators';
import { PermissionsGuard } from '../common/guards/permission.guard';
import productPermissions from '../common/permissions/product.permissions';
import { ValidateMongoId } from '../common/pipes/validate-mongo-id.pipe';
import { CreateProductDto } from './dto/create-product.dto';
import { GetAllProductDto } from './dto/get-all-product.dto';
import { ReorderSerialNumberDto } from './dto/reorder-product-serial.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@Controller('/merchants/:merchantId/products')
@ApiTags(swaggerResources.Product)
@ApiBearerAuth()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiResponse({ description: 'Application', status: 201 })
  @Permissions(productPermissions.ALL_PERMISSION.value, productPermissions.CREATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  create(@CurrentUser() user: any, @Body() createDto: CreateProductDto, @Param('merchantId') merchantId: string) {
    return this.productService.create(user, createDto, merchantId);
  }

  @Get(':productId')
  @ApiResponse({ description: 'Application', status: 201 })
  @Permissions(productPermissions.ALL_PERMISSION.value, productPermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  findOne(
    @Param('merchantId', ValidateMongoId) merchantId: string,
    @Param('productId', ValidateMongoId) productId: string,
  ) {
    return this.productService.findOne(productId, merchantId);
  }

  @Patch('/:productId')
  @ApiResponse({ description: 'Application', status: 201 })
  @Permissions(productPermissions.ALL_PERMISSION.value, productPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  updateOne(
    @Param('merchantId', ValidateMongoId) merchantId: string,
    @Param('productId', ValidateMongoId) productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.updateOne(productId, updateProductDto, merchantId);
  }

  @Get()
  @ApiResponse({ status: 200 })
  @Permissions(productPermissions.ALL_PERMISSION.value, productPermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  findAll(
    @Query() getAllProductsDto: GetAllProductDto,
    @Param('merchantId', ValidateMongoId) merchantId: string,
    @CurrentUser() user: any,
  ) {
    return this.productService.findAll(getAllProductsDto, merchantId, user);
  }

  @Delete(':productId')
  @ApiResponse({ description: 'Application', status: 203 })
  @Permissions(productPermissions.ALL_PERMISSION.value, productPermissions.DELETE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  remove(
    @Param('merchantId', ValidateMongoId) merchantId: string,
    @Param('productId', ValidateMongoId) productId: string,
  ) {
    return this.productService.remove(productId, merchantId);
  }

  @Patch('serials/reorder')
  @ApiResponse({ description: 'Application', status: 201 })
  @Permissions(productPermissions.ALL_PERMISSION.value, productPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  reOrderSerialNumber(@Body() reorderSerialNumber: ReorderSerialNumberDto) {
    return this.productService.reOrderSerialNumber(reorderSerialNumber);
  }
}
