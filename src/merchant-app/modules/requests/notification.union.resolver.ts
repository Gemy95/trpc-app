import { ResolveField, Resolver } from '@nestjs/graphql';

@Resolver('AllReviewsUnion')
export class AllReviewsUnionResolver {
  @ResolveField()
  __resolveType(value, context, info) {
    if (value && value?.modelName == 'Product') {
      return 'FindOneProductRequestRes';
    }
    if (value && value?.modelName == 'Merchant') {
      return 'FindOneMerchantRequestRes';
    }
    if (value && Object.keys(value).length > 0) {
      return 'DashboardOrderRes';
    }
    return null;
  }
}
