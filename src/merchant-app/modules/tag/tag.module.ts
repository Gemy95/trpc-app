import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { StorageService } from '../../storage.service';
import { TrpcModule } from '../../trpc/trpc.module';
import { Category, CategoryRepository, CategorySchema, Tag, TagRepository, TagSchema } from '../models';
import { MarketPlaceTagController } from './marketplace-tag.controller';
import { MarketPlaceTagResolver } from './marketplace-tag.resolver';
import { MarketPlaceTagRouter } from './marketplace-tag.router';
import { MarketPlaceTagService } from './marketplace-tag.service';
import { TagController } from './tag.controller';
import { TagResolver } from './tag.resolver';
import { TagService } from './tag.service';

@Module({
  imports: [
    forwardRef(() => TrpcModule),
    MongooseModule.forFeature([
      { name: Tag.name, schema: TagSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [TagController, MarketPlaceTagController],
  providers: [
    TagService,
    StorageService,
    TagRepository,
    CategoryRepository,
    MarketPlaceTagService,
    TagResolver,
    MarketPlaceTagResolver,
    MarketPlaceTagRouter,
  ],
  exports: [TagRepository, TagService, MarketPlaceTagRouter],
})
export class TagModule {}
