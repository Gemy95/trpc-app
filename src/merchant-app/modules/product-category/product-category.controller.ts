import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProductCategoryDto } from './dto/product-category.dto';
import { ProductCategoryService } from './product-category.service';
import { ProductCategoryQueryDto } from './dto/product-category-query.dto';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { ReorderSerialNumberDto } from './dto/reorder-category-serial.dto';
import { ValidateMongoId } from '../common/pipes/validate-mongo-id.pipe';

@Controller('merchants/:merchantId/product-categories')
@ApiTags(swaggerResources.ProductCategory)
@ApiBearerAuth()
export class ProductCategoryController {
  constructor(private readonly productCategoryService: ProductCategoryService) {}

  @Post()
  @ApiResponse({
    description: 'Application',
    status: 200,
  })
  create(
    @Param('merchantId', ValidateMongoId) merchantId: string,
    @Body() createProductCategoryDto: CreateProductCategoryDto,
  ) {
    return this.productCategoryService.create(merchantId, createProductCategoryDto);
  }

  @Get()
  @ApiResponse({
    description: 'Application',
    status: 200,
  })
  @ApiQuery({
    name: 'branchs',
    required: false,
    explode: false,
  })
  all(@Param('merchantId', ValidateMongoId) merchantId: string, @Query() params: ProductCategoryQueryDto) {
    return this.productCategoryService.getAll(merchantId, params);
  }

  @Get(':id')
  @ApiResponse({
    description: 'Application',
    status: 200,
  })
  getOne(@Param('merchantId', ValidateMongoId) merchantId: string, @Param('id', ValidateMongoId) id: string) {
    return this.productCategoryService.getOne(merchantId, id);
  }

  @Patch(':id')
  @ApiResponse({
    description: 'Application',
    status: 200,
  })
  update(
    @Param('merchantId', ValidateMongoId) merchantId: string,
    @Param('id', ValidateMongoId) id: string,
    @Body() updateProductCategoryDto: UpdateProductCategoryDto,
  ) {
    return this.productCategoryService.updateOne(merchantId, id, updateProductCategoryDto);
  }

  @Delete(':id')
  @ApiResponse({
    description: 'Application',
    status: 200,
  })
  remove(@Param('merchantId', ValidateMongoId) merchantId: string, @Param('id', ValidateMongoId) id: string) {
    return this.productCategoryService.remove(merchantId, id);
  }

  @Patch('serials/reorder')
  @ApiResponse({ description: 'Application', status: 201 })
  reOrderSerialNumber(@Body() reorderSerialNumber: ReorderSerialNumberDto) {
    return this.productCategoryService.reOrderSerialNumber(reorderSerialNumber);
  }
}
