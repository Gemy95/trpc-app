import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BaseQuery } from '../common/dto/BaseQuery.dto';
import { Discount } from '../models';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { Permissions } from '../common/decorators';
import discountPermissions from '../common/permissions/discount.permissions';
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { ValidateMongoId } from '../common/pipes/validate-mongo-id.pipe';

@Controller('discounts/products')
@ApiBearerAuth()
@ApiTags(swaggerResources.Discount)
//@UseGuards(PermissionsGuard)
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Permissions(discountPermissions.ALL_PERMISSION.value, discountPermissions.CREATE_PERMISSION.value)
  @Post()
  create(@Body() createDiscountDto: CreateDiscountDto) {
    return this.discountService.create(createDiscountDto);
  }

  @Permissions(discountPermissions.ALL_PERMISSION.value, discountPermissions.READ_PERMISSION.value)
  @Get()
  findAll() {
    return this.discountService.findAll();
  }

  @Permissions(discountPermissions.ALL_PERMISSION.value, discountPermissions.READ_PERMISSION.value)
  @Get('/:merchantId')
  findAllByMerchantId(@Param('merchantId', ValidateMongoId) merchantId: string, @Query() query: BaseQuery) {
    return this.discountService.findAllByMerchantId(merchantId, query);
  }

  @Permissions(discountPermissions.ALL_PERMISSION.value, discountPermissions.READ_PERMISSION.value)
  @Get('/findOne/:id')
  findOne(@Param('id') id: string): Promise<Discount> {
    return this.discountService.findOne(id);
  }

  @Permissions(discountPermissions.ALL_PERMISSION.value, discountPermissions.UPDATE_PERMISSION.value)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDiscountDto: UpdateDiscountDto): Promise<Discount> {
    return this.discountService.update(id, updateDiscountDto);
  }

  @Permissions(discountPermissions.ALL_PERMISSION.value, discountPermissions.UPDATE_PERMISSION.value)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<Discount> {
    return this.discountService.remove(id);
  }
}
