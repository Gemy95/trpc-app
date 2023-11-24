import { forwardRef, Module } from '@nestjs/common';
import { MenuTemplateProductGroupService } from './menu-template-product-group.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuTemplateProductGroupResolver } from './menu-template-product-group.resolver';

import {
  MenuTemplateProductGroup,
  MenuTemplateProductGroupRepository,
  MenuTemplateProductGroupSchema,
} from '../models';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MenuTemplateProductGroup.name, schema: MenuTemplateProductGroupSchema }]),
  ],
  providers: [MenuTemplateProductGroupService, MenuTemplateProductGroupRepository, MenuTemplateProductGroupResolver],
  exports: [MenuTemplateProductGroupService, MenuTemplateProductGroupRepository],
})
export class MenuTemplateProductGroupModule {}
