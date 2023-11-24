import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentRepository } from '../models/content/content.repository';
import { Content, ContentSchema } from '../models';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { ContentResolver } from './content.resolver';
//import { MarketplaceContentResolver } from './marketplace-content.resolver';

@Module({
  imports: [MongooseModule.forFeature([{ name: Content.name, schema: ContentSchema }])],
  controllers: [ContentController],
  providers: [ContentService, ContentRepository, ContentResolver /*MarketplaceContentResolver*/],
})
export class ContentModule {}
