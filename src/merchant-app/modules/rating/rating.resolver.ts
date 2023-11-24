import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/shared/decorator/user.graphql.decorator';
import { Public } from '../common/decorators';
import { CreateRatingDto } from './dto/create-rating.dto';
import { DashboardRatingQuery } from './dto/dashboard-rating-query.input';
import { HideCommentRatingDto } from './dto/hide-commend.dto';
import { RatingService } from './rating.service';
import RatingPermissions from '../common/permissions/rating.permissions';
import { Permissions } from '../common/decorators';
import { PermissionsGuard } from '../common/guards';
import { UseGuards } from '@nestjs/common';
@Resolver('')
export class RatingResolver {
  constructor(private readonly ratingService: RatingService) {}

  @Permissions(RatingPermissions.ALL_PERMISSION.value, RatingPermissions.CREATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Mutation('marketplaceOrderRating')
  rateOrder(
    @CurrentUser() user: any,
    @Args('order') order: string,
    @Args('createRatingDto') createRatingDto: CreateRatingDto,
  ) {
    return this.ratingService.rateOrder(user, order, createRatingDto);
  }

  @Query('marketplaceOrdersRatingsLatestOrderStatus')
  getLatestOrder(@CurrentUser() user: any) {
    return this.ratingService.getLatestOrder(user);
  }

  @Public()
  @Query('marketplaceRating')
  getMerchantOrdersRating(@Args('merchant') merchant: string) {
    return this.ratingService.marketPlaceRating(merchant);
  }

  @Query('marketplaceOrdersRatingInfo')
  getBranchOrdersRating(@Args('branch') branch: string) {
    return this.ratingService.getBranchOrdersRating(branch);
  }

  @Permissions(RatingPermissions.ALL_PERMISSION.value, RatingPermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Query('dashboardRating')
  dashboardRating(@Args('merchant') merchant: string, @Args('query') query: DashboardRatingQuery) {
    return this.ratingService.dashboardRating(merchant, query);
  }

  @Permissions(RatingPermissions.ALL_PERMISSION.value, RatingPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Mutation('dashboardHideComment')
  hideComment(
    @CurrentUser() user: any,
    @Args('merchant') merchant: string,
    @Args('rate') rate: string,
    @Args('body') body: HideCommentRatingDto,
  ) {
    return this.ratingService.hideComment(user, merchant, rate, body);
  }
}
