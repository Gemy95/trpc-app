import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateFavoriteDto } from './dtos/create-favorite.dto';
import { FavoriteQueryDto } from './dtos/get-all-favorite.dto';
import { MarketplaceFavoriteService } from './marketplace-favorite.service';

@ApiBearerAuth()
@ApiTags(swaggerResources.MarketplaceFavorite)
@Controller('/marketplace/favorites')
export class MarketplaceFavoriteController {
  constructor(private readonly marketplaceFavoriteService: MarketplaceFavoriteService) {}

  @Post('like')
  @ApiResponse({
    description: 'This for create favorite',
    status: 201,
  })
  create(@CurrentUser() user: any, @Body() createFavoriteDto: CreateFavoriteDto) {
    return this.marketplaceFavoriteService.create(user, createFavoriteDto);
  }

  @Get('')
  @ApiResponse({
    description: 'This for get favorites',
    status: 200,
  })
  findAll(@CurrentUser() user: any, @Query() query: FavoriteQueryDto) {
    return this.marketplaceFavoriteService.findAll(user, query);
  }

  @Delete('unlike/:merchantId')
  @ApiResponse({ description: 'Application', status: 203 })
  deleteOne(@CurrentUser() user: any, @Param('merchantId') merchantId: string) {
    return this.marketplaceFavoriteService.deleteOne(user, merchantId);
  }
}
