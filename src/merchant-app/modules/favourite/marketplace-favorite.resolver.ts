import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/shared/decorator/user.graphql.decorator';
import { ValidateMongoId } from '../common/pipes/validate-mongo-id.pipe';
import { CreateFavoriteDto } from './dtos/create-favorite.dto';
import { FavoriteQueryDto } from './dtos/get-all-favorite.dto';
import { MarketplaceFavoriteService } from './marketplace-favorite.service';

@Resolver('')
export class MarketplaceFavoriteResolver {
  constructor(private readonly marketplaceFavoriteService: MarketplaceFavoriteService) {}

  @Mutation('marketplaceFavoriteLike')
  create(@CurrentUser() user: any, @Args('createFavoriteDto') createFavoriteDto: CreateFavoriteDto) {
    return this.marketplaceFavoriteService.create(user, createFavoriteDto);
  }

  @Query('marketplaceFavoriteFindAll')
  findAll(@CurrentUser() user: any, @Args('query') query: FavoriteQueryDto) {
    return this.marketplaceFavoriteService.findAll(user, query);
  }

  @Mutation('marketplaceFavoriteUnlike')
  deleteOne(@CurrentUser() user: any, @Args('merchantId', ValidateMongoId) merchantId: string) {
    return this.marketplaceFavoriteService.deleteOne(user, merchantId);
  }
}
