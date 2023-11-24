import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Permissions, Public } from '../common/decorators';
import categoryPermissions from '../common/permissions/category.permissions';
import { PermissionsGuard } from '../common/guards/permission.guard';
// import countryPermissions from '../common/permissions/country.permissions';
import { CategoryService } from './category.service';
import { CategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { CategoryQueryParamsDto } from './dto/categoryQuery.dto';

@Resolver('/')
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Public()
  @Query('categories')
  findAll(@Args() params: CategoryQueryParamsDto) {
    return this.categoryService.getAll(params);
  }

  @Public()
  @Query('category')
  findOne(@Args('categoryId') categoryId: string) {
    return this.categoryService.getOne(categoryId);
  }

  @Permissions(categoryPermissions.ALL_PERMISSION.value, categoryPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Mutation('createCategory')
  create(@Args('category') categoryDto: CategoryDto) {
    return this.categoryService.create(categoryDto);
  }

  @Permissions(categoryPermissions.ALL_PERMISSION.value, categoryPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Mutation('updateCategory')
  update(@Args('id') id: string, @Args('category') categoryDto: UpdateCategoryDto) {
    return this.categoryService.updateOne(id, categoryDto);
  }

  @Permissions(categoryPermissions.ALL_PERMISSION.value, categoryPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Mutation('removeCategory')
  remove(@Args('id') id: string) {
    return this.categoryService.deleteOne(id);
  }
}
