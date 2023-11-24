import { MenuService } from './menu.service';
import { CurrentUser } from '../auth/shared/decorator/user.graphql.decorator';
import { MenuFilterDto } from './dto/menu-filter.dto';
import { Args, Context, GraphQLExecutionContext, Query, Resolver } from '@nestjs/graphql';

@Resolver('')
export class MenuResolver {
  constructor(private readonly menuService: MenuService) {}

  @Query('merchantsMenu')
  getMerchantsMenu(
    @CurrentUser() user: any,
    @Args('params') params: MenuFilterDto,
    @Context() context: GraphQLExecutionContext,
  ) {
    return this.menuService.getMerchantMenu(user, params, context?.['req']?.['header']?.('accept-language'));
  }
}
