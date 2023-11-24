import { CreateProductCategoryDto } from './dto/product-category.dto';
import { ProductCategoryService } from './product-category.service';
import { ProductCategoryQueryDto } from './dto/product-category-query.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { ReorderSerialNumberDto } from './dto/reorder-category-serial.dto';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ValidateMongoId } from '../common/pipes/validate-mongo-id.pipe';

@Resolver('merchants/:merchantId/product-categories')
export class ProductCategoryResolver {
  constructor(private readonly productCategoryService: ProductCategoryService) {}

  @Mutation('createProductCategory')
  create(
    @Args('merchantId', ValidateMongoId) merchantId: string,
    @Args('createProductCategoryDto') createProductCategoryDto: CreateProductCategoryDto,
  ) {
    return this.productCategoryService.create(merchantId, createProductCategoryDto);
  }

  @Query('findAllProductCategory')
  all(@Args('merchantId', ValidateMongoId) merchantId: string, @Args('params') params: ProductCategoryQueryDto) {
    return this.productCategoryService.getAll(merchantId, params);
  }

  @Query('findOneProductCategory')
  getOne(@Args('merchantId', ValidateMongoId) merchantId: string, @Args('id') id: string) {
    return this.productCategoryService.getOne(merchantId, id);
  }

  @Mutation('updatProductCategory')
  update(
    @Args('merchantId', ValidateMongoId) merchantId: string,
    @Args('id', ValidateMongoId) id: string,
    @Args('updateProductCategoryDto') updateProductCategoryDto: UpdateProductCategoryDto,
  ) {
    return this.productCategoryService.updateOne(merchantId, id, updateProductCategoryDto);
  }

  @Mutation('removeProductCategory')
  remove(@Args('merchantId', ValidateMongoId) merchantId: string, @Args('id', ValidateMongoId) id: string) {
    return this.productCategoryService.remove(merchantId, id);
  }

  @Mutation('serialsReorderProductCategory')
  reOrderSerialNumber(@Args('reorderSerialNumber') reorderSerialNumber: ReorderSerialNumberDto) {
    return this.productCategoryService.reOrderSerialNumber(reorderSerialNumber);
  }
}
