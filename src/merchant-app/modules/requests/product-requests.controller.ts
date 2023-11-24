import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { CurrentUser } from '../common/decorators';
import { ValidateMongoId } from '../common/pipes/validate-mongo-id.pipe';
import { ProductApproveOrReject } from './dto/product-approve-or-reject.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRequestsService } from './product-requests.service';

@Controller('requests/products')
@ApiTags(swaggerResources.Requests)
@ApiBearerAuth()
export class ProductRequestsController {
  constructor(private readonly productRequestsService: ProductRequestsService) {}

  @Get(':productId')
  @ApiResponse({
    description: 'Fetch update request by product Id',
    status: 200,
  })
  // @UseGuards(PermissionsGuard)
  // @Permissions(productPermissions.ALL_PERMISSION.value, productPermissions.READ_PERMISSION.value)
  findOne(@Param('productId') productId: string, @CurrentUser() user: any) {
    return this.productRequestsService.findOne(productId, user);
  }

  @Post(':merchantId/:productId')
  @ApiResponse({
    description: 'Create update request',
    status: 200,
  })
  // @UseGuards(PermissionsGuard)
  // @Permissions(
  //     productPermissions.ALL_PERMISSION.value,
  //     productPermissions.UPDATE_PERMISSION.value,
  // )
  create(
    @CurrentUser() user: any,
    @Param('productId', ValidateMongoId) productId: string,
    @Param('merchantId', ValidateMongoId) merchantId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productRequestsService.create(user, productId, merchantId, updateProductDto);
  }

  @Patch(':productId/:requestId')
  @ApiResponse({
    description: 'Modify update requests by product and reqeust Id',
    status: 200,
  })
  // @UseGuards(PermissionsGuard)
  // @Permissions(
  //     productPermissions.ALL_PERMISSION.value,
  //     productPermissions.UPDATE_PERMISSION.value,
  // )
  update(
    @Param('productId') productId: string,
    @Param('requestId') requestId: string,
    @Body() updateProductDto: UpdateProductDto,
    @CurrentUser() user: any,
  ) {
    return this.productRequestsService.update(user, requestId, productId, updateProductDto);
  }

  @Post('approve-or-reject/:merchantId/:productId')
  @ApiResponse({
    description: 'Approve or reject update request for merchant product',
    status: 200,
  })
  // @UseGuards(PermissionsGuard)
  // @Permissions(
  //     productPermissions.ALL_PERMISSION.value,
  //     productPermissions.UPDATE_PERMISSION.value,
  // )
  approveOrReject(
    @CurrentUser() user: any,
    @Param('productId', ValidateMongoId) productId: string,
    @Param('merchantId', ValidateMongoId) merchantId: string,
    @Body() productApproveOrReject: ProductApproveOrReject,
  ) {
    return this.productRequestsService.approveOrReject(user, productId, merchantId, productApproveOrReject);
  }

  @Delete('/cancel/:requestId')
  @ApiResponse({
    description: 'Delete update request',
    status: 200,
  })
  // @UseGuards(PermissionsGuard)
  // @Permissions(
  //     productPermissions.ALL_PERMISSION.value,
  //     productPermissions.UPDATE_PERMISSION.value,
  // )
  remove(@Param('requestId') requestId: string) {
    return this.productRequestsService.remove(requestId);
  }
}
