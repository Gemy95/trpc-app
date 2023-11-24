import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Permissions, Public } from '../common/decorators';
import { ContentService } from './content.service';
import { ContentType } from '../models';
import { CreateContentDto, QueryContentDto, UpdateContentDto } from './dtos/content.dto';
import { UseGuards } from '@nestjs/common';
import ContentPermissions from '../common/permissions/content.permissions';
import { PermissionsGuard } from '../common/guards/permission.guard';

@Resolver('/')
export class ContentResolver {
  constructor(private readonly contentService: ContentService) {}

  @Query('content')
  async findAll(@Args('contentType') contentType?: QueryContentDto) {
    const res = await this.contentService.find(contentType);
    return res;
  }

  @Mutation('createContent')
  @Permissions(ContentPermissions.ALL_PERMISSION.value, ContentPermissions.CREATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  create(@Args('content') contentDto: CreateContentDto) {
    return this.contentService.create(contentDto);
  }

  @Mutation('updateContent')
  @Permissions(ContentPermissions.ALL_PERMISSION.value, ContentPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  update(@Args('_id') _id: string, @Args('content') updateContentDto: UpdateContentDto) {
    return this.contentService.update(_id, updateContentDto);
  }

  @Mutation('removeContent')
  @Permissions(ContentPermissions.ALL_PERMISSION.value, ContentPermissions.DELETE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  remove(@Args('_id') _id: string) {
    return this.contentService.remove(_id);
  }
}
