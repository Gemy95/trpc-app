import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Favorite, FavoriteRepository, FavoriteSchema } from '../models';
import { MarketplaceFavoriteController } from './marketplace-favorite.controller';
import { MarketplaceFavoriteResolver } from './marketplace-favorite.resolver';
import { MarketplaceFavoriteService } from './marketplace-favorite.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Favorite.name, schema: FavoriteSchema }])],
  controllers: [MarketplaceFavoriteController],
  providers: [MarketplaceFavoriteService, FavoriteRepository, MarketplaceFavoriteResolver],
  exports: [FavoriteRepository],
})
export class FavoriteModule {}
