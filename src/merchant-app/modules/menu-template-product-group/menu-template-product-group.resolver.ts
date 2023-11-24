import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Public } from '../common/decorators';
import { CreateMenuTemplateProductGroupDto } from './dto/create-menu-template-product-group.dto';
import { FindAllMenuTemplateProductGroupDto } from './dto/findAll-menu-template-product-group.dto';
import { UpdateMenuTemplateProductGroupDto } from './dto/update-menu-template-product-group.dto';
import { MenuTemplateProductGroupService } from './menu-template-product-group.service';
import MenuTemplateProductGroupPermissions from '../common/permissions/menu-template-product-group.permissions';
import { Permissions } from '../common/decorators';
import { PermissionsGuard } from '../common/guards/permission.guard';

@Resolver('/')
export class MenuTemplateProductGroupResolver {
  constructor(private readonly menuTemplateProductGroupService: MenuTemplateProductGroupService) {}

  // @Permissions(MenuTemplateProductGroupPermissions.ALL_PERMISSION.value, MenuTemplateProductGroupPermissions.CREATE_PERMISSION.value)
  // @UseGuards(PermissionsGuard)
  @Mutation('shoppexEmployeeCreateMenuTemplateProductGroup')
  create(
    @Args('createMenuTemplateProductGroupDto') createMenuTemplateProductGroupDto: CreateMenuTemplateProductGroupDto,
  ) {
    return this.menuTemplateProductGroupService.create(createMenuTemplateProductGroupDto);
  }

  // @Permissions(MenuTemplateProductGroupPermissions.ALL_PERMISSION.value, MenuTemplateProductGroupPermissions.READ_PERMISSION.value)
  // @UseGuards(PermissionsGuard)
  @Query('findAllMenuTemplateProductGroups')
  findAll(@Args('params') params: FindAllMenuTemplateProductGroupDto) {
    return this.menuTemplateProductGroupService.getAll(params);
  }

  // @Permissions(MenuTemplateProductGroupPermissions.ALL_PERMISSION.value, MenuTemplateProductGroupPermissions.READ_PERMISSION.value)
  // @UseGuards(PermissionsGuard)
  @Query('findOneMenuTemplateProductGroup')
  findOne(@Args('menuTemplateProductGroupId') menuTemplateProductGroupId: string) {
    return this.menuTemplateProductGroupService.findOne(menuTemplateProductGroupId);
  }

  // @Permissions(MenuTemplateProductGroupPermissions.ALL_PERMISSION.value, MenuTemplateProductGroupPermissions.UPDATE_PERMISSION.value)
  // @UseGuards(PermissionsGuard)
  @Mutation('shoppexEmployeeUpdateMenuTemplateProductGroup')
  update(
    @Args('menuTemplateProductGroupId') menuTemplateProductGroupId: string,
    @Args('updateMenuTemplateProductGroupDto') updateMenuTemplateProductGroupDto: UpdateMenuTemplateProductGroupDto,
  ) {
    return this.menuTemplateProductGroupService.updateOne(
      menuTemplateProductGroupId,
      updateMenuTemplateProductGroupDto,
    );
  }

  // @Permissions(MenuTemplateProductGroupPermissions.ALL_PERMISSION.value, MenuTemplateProductGroupPermissions.DELETE_PERMISSION.value)
  // @UseGuards(PermissionsGuard)
  @Mutation('shoppexEmployeeDeleteMenuTemplateProductGroup')
  deleteOne(@Args('menuTemplateProductGroupId') menuTemplateProductGroupId: string) {
    return this.menuTemplateProductGroupService.deleteOne(menuTemplateProductGroupId);
  }
}
