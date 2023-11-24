import { ResolveField, Resolver } from '@nestjs/graphql';

@Resolver('AllReviewsRequestsUnion')
export class AllReviewsRequestsUnionResolver {
  @ResolveField()
  __resolveType(value, context, info) {
    if (value && value?.modelName == 'Merchant') {
      return 'ReviewMerchantRes';
    }
    if (value && value?.modelName == 'Product') {
      return 'ReviewProductRes';
    }
    if (value && value?.modelName == 'Branch') {
      return 'ReviewBranchRes';
    }
    return null;
  }
}
