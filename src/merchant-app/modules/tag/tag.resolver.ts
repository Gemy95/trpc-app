import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Permissions, Public } from '../common/decorators';
import tagPermissions from '../common/permissions/tag.permissions';
import { PermissionsGuard } from '../common/guards/permission.guard';
import { TagDto, UpdateTagDto } from './input/tag.dto';
import { TagQueryDto } from './input/tagQuery.dto';
import { TagService } from './tag.service';

@Resolver('/')
export class TagResolver {
  constructor(private readonly tagsService: TagService) {}

  @Public()
  @Query('tags')
  findAll(@Args() params: TagQueryDto) {
    return this.tagsService.find(params);
  }

  @Public()
  @Query('tag')
  findOne(@Args('categoryId') categoryId: string, @Args('tagId') tagId: string) {
    return this.tagsService.getOne(categoryId, tagId);
  }

  @Permissions(tagPermissions.ALL_PERMISSION.value, tagPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Mutation('createTag')
  create(@Args('categoryId') categoryId: string, @Args('tag') tagDto: TagDto) {
    return this.tagsService.create(categoryId, tagDto);
  }

  @Permissions(tagPermissions.ALL_PERMISSION.value, tagPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Mutation('updateTag')
  update(
    @Args('categoryId') categoryId: string,
    @Args('tagId') tagId: string,
    @Args('tag') updateTageDto: UpdateTagDto,
  ) {
    return this.tagsService.updateOne(categoryId, tagId, updateTageDto);
  }

  @Permissions(tagPermissions.ALL_PERMISSION.value, tagPermissions.DELETE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Mutation('removeTag')
  deleteOne(@Args('categoryId') categoryId: string, @Args('tagId') tagId: string) {
    return this.tagsService.deleteOne(categoryId, tagId);
  }
}
