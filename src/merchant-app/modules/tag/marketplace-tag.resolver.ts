import { Public } from '../common/decorators';
import { ParseQueryJSON } from '../pipes/parseQueryJson.pipe';
import { GetAllClientTagDto } from './input/get-all-client-tag.dto';
import { MarketPlaceTagService } from './marketplace-tag.service';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { FindAllClientTagDto } from './input/find-all-client.dto';

@Resolver('')
export class MarketPlaceTagResolver {
  constructor(private readonly marketPlaceTagService: MarketPlaceTagService) {}

  @Public()
  @Query('marketPlaceFindAllTags')
  all(@Args('query') query: GetAllClientTagDto, @Args('categoriesIds') categoriesIds: FindAllClientTagDto) {
    return this.marketPlaceTagService.getAll(query, categoriesIds);
  }
}
