import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/shared/decorator/user.graphql.decorator';
import { ValidateMongoId } from '../common/pipes/validate-mongo-id.pipe';
import { ProductApproveOrReject } from './dto/product-approve-or-reject.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRequestsService } from './product-requests.service';

@Resolver('')
export class ProductRequestsResolver {
  constructor(private readonly productRequestsService: ProductRequestsService) {}

  @Query('findOneProductRequest')
  // @UseGuards(PermissionsGuard)
  // @Permissions(productPermissions.ALL_PERMISSION.value, productPermissions.READ_PERMISSION.value)
  findOne(@Args('productId') productId: string, @CurrentUser() user: any) {
    return this.productRequestsService.findOne(productId, user);
  }

  @Mutation('createProductRequest')
  // @UseGuards(PermissionsGuard)
  // @Permissions(
  //     productPermissions.ALL_PERMISSION.value,
  //     productPermissions.UPDATE_PERMISSION.value,
  // )
  create(
    @CurrentUser() user: any,
    @Args('productId', ValidateMongoId) productId: string,
    @Args('merchantId', ValidateMongoId) merchantId: string,
    @Args('updateProductDto') updateProductDto: UpdateProductDto,
  ) {
    return this.productRequestsService.create(user, productId, merchantId, updateProductDto);
  }

  @Mutation('updateProductRequest')
  // @UseGuards(PermissionsGuard)
  // @Permissions(
  //     productPermissions.ALL_PERMISSION.value,
  //     productPermissions.UPDATE_PERMISSION.value,
  // )
  update(
    @Args('productId') productId: string,
    @Args('requestId') requestId: string,
    @Args('updateProductDto') updateProductDto: UpdateProductDto,
    @CurrentUser() user: any,
  ) {
    return this.productRequestsService.update(user, requestId, productId, updateProductDto);
  }

  @Mutation('approveOrRejectProductRequest')
  // @UseGuards(PermissionsGuard)
  // @Permissions(
  //     productPermissions.ALL_PERMISSION.value,
  //     productPermissions.UPDATE_PERMISSION.value,
  // )
  approveOrReject(
    @CurrentUser() user: any,
    @Args('productId', ValidateMongoId) productId: string,
    @Args('merchantId', ValidateMongoId) merchantId: string,
    @Args('productApproveOrReject') productApproveOrReject: ProductApproveOrReject,
  ) {
    return this.productRequestsService.approveOrReject(user, productId, merchantId, productApproveOrReject);
  }

  @Mutation('cancelProductRequest')
  // @UseGuards(PermissionsGuard)
  // @Permissions(
  //     productPermissions.ALL_PERMISSION.value,
  //     productPermissions.UPDATE_PERMISSION.value,
  // )
  remove(@Args('requestId') requestId: string) {
    return this.productRequestsService.remove(requestId);
  }
}
