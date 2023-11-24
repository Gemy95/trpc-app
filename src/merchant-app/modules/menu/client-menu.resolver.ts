import { Args, Context, GraphQLExecutionContext, Query, Resolver } from '@nestjs/graphql';

import { Public } from '../common/decorators';
import { ClientMenuService } from './client-menu.service';
import { MenuQueryDto } from './dto/menu-query.dto';

import { UseInterceptors } from '@nestjs/common';
import { ValidateMongoId } from '../common/pipes/validate-mongo-id.pipe';
import { CacheTTL, CacheInterceptor } from '@nestjs/cache-manager';

@Public()
@Resolver('')
export class ClientMenuResolver {
  constructor(private readonly clientMenuService: ClientMenuService) {}

  @CacheTTL(20)
  @UseInterceptors(CacheInterceptor)
  @Query('clientsMenu')
  getMenuByBranchId(
    @Args('merchantId', ValidateMongoId) merchantId: string,
    @Args('params') params: MenuQueryDto,
    @Context() context: GraphQLExecutionContext,
  ) {
    return this.clientMenuService.marketplaceMenu(
      merchantId,
      params,
      context?.['req']?.['header']?.('accept-language'),
    );
  }
}
