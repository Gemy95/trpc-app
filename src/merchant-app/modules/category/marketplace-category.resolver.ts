import { Args, Query, Resolver } from '@nestjs/graphql';
import { Public } from '../common/decorators';
import { GetAllClientCategoryDto } from './dto/get-all-client-category.dto';
import { MarketPlaceCategoryService } from './marketplace-category.service';

@Resolver('')
export class MarketPlaceCategoryResolver {
  constructor(private readonly marketPlaceCategoryService: MarketPlaceCategoryService) {}

  @Public()
  @Query('marketplaceFindAllCategories')
  all(@Args('query') query: GetAllClientCategoryDto) {
    return this.marketPlaceCategoryService.getAll(query);
  }
}
