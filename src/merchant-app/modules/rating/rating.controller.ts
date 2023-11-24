import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { CurrentUser, Public } from '../common/decorators';
import { CreateRatingDto } from './dto/create-rating.dto';
import { DashboardRatingQuery } from './dto/dashboard-rating-query.dto';
import { HideCommentRatingDto } from './dto/hide-commend.dto';
import { RatingService } from './rating.service';
import RatingPermissions from '../common/permissions/rating.permissions';
import { Permissions } from '../common/decorators';
import { PermissionsGuard } from '../common/guards';
import { UseGuards } from '@nestjs/common';

@Controller()
@ApiTags(swaggerResources.Rating)
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @ApiBearerAuth()
  @Permissions(RatingPermissions.ALL_PERMISSION.value, RatingPermissions.CREATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Post('marketplace/orders/ratings/:order')
  rateOrder(@CurrentUser() user: any, @Param('order') order: string, @Body() createRatingDto: CreateRatingDto) {
    return this.ratingService.rateOrder(user, order, createRatingDto);
  }

  @ApiBearerAuth()
  @Get('marketplace/orders/ratings/latest-order-status')
  getLatestOrder(@CurrentUser() user: any) {
    return this.ratingService.getLatestOrder(user);
  }

  @Public()
  @Get('marketplace/:merchant/rating')
  getMerchantOrdersRating(@Param('merchant') merchant: string) {
    return this.ratingService.marketPlaceRating(merchant);
  }

  @ApiBearerAuth()
  @Get('marketplace/:branch/orders/rating-info')
  getBranchOrdersRating(@Param('branch') branch: string) {
    return this.ratingService.getBranchOrdersRating(branch);
  }

  @ApiBearerAuth()
  @Permissions(RatingPermissions.ALL_PERMISSION.value, RatingPermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Get('dashboard/:merchant/rating')
  dashboardRating(@Param('merchant') merchant: string, @Query() query: DashboardRatingQuery) {
    return this.ratingService.dashboardRating(merchant, query);
  }

  @ApiBearerAuth()
  @Permissions(RatingPermissions.ALL_PERMISSION.value, RatingPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Patch('dashboard/:merchant/hide-comment/:rate')
  hideComment(
    @CurrentUser() user: any,
    @Param('merchant') merchant: string,
    @Param('rate') rate: string,
    @Body() body: HideCommentRatingDto,
  ) {
    return this.ratingService.hideComment(user, merchant, rate, body);
  }
}
