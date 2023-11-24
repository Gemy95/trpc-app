import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductGroupService } from './product-group.service';
import { CreateProductGroupDto } from './dto/create-product-group.dto';
import productGroupPermissions from '../common/permissions/product-group.permissions';
import { Permissions } from '../common/decorators';
import { PermissionsGuard } from '../common/guards';
import { GetAllProductGroupDto } from './dto/get-product-group.dto';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { UpdateProductGroupDto } from './dto/update-product-group.dto';
import { ValidateMongoId } from '../common/pipes/validate-mongo-id.pipe';

@Controller('merchants/:merchantId/product-groups')
@ApiTags(swaggerResources.ProductGroup)
@ApiBearerAuth()
export class ProductGroupController {
  constructor(private readonly productGroupService: ProductGroupService) {}

  @Post()
  @ApiResponse({ status: 201 })
  @Permissions(productGroupPermissions.ALL_PERMISSION.value, productGroupPermissions.CREATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  create(
    @Param('merchantId', ValidateMongoId) merchantId: string,
    @Body() createProductGroupDto: CreateProductGroupDto,
  ) {
    return this.productGroupService.create(merchantId, createProductGroupDto);
  }

  @Get()
  @ApiResponse({ status: 200 })
  @Permissions(productGroupPermissions.ALL_PERMISSION.value, productGroupPermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  findAll(
    @Param('merchantId', ValidateMongoId) merchantId: string,
    @Query() getAllProductGroupsDto: GetAllProductGroupDto,
  ) {
    return this.productGroupService.findAll(merchantId, getAllProductGroupsDto);
  }

  @Get(':productGroupId')
  findOne(
    @Param('merchantId', ValidateMongoId) merchantId: string,
    @Param('productGroupId', ValidateMongoId) productGroupId: string,
  ) {
    return this.productGroupService.findOne(merchantId, productGroupId);
  }

  @Patch(':productGroupId')
  update(
    @Param('merchantId', ValidateMongoId) merchantId: string,
    @Param('productGroupId', ValidateMongoId) productGroupId: string,
    @Body() updateProductGroupDto: UpdateProductGroupDto,
  ) {
    return this.productGroupService.update(merchantId, productGroupId, updateProductGroupDto);
  }
  @Delete(':productGroupId')
  remove(
    @Param('merchantId', ValidateMongoId) merchantId: string,
    @Param('productGroupId', ValidateMongoId) productGroupId: string,
  ) {
    return this.productGroupService.remove(merchantId, productGroupId);
  }
}
