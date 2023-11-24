import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Public } from '../common/decorators';
import MenuTemplateProductPermissions from '../common/permissions/menu-template-product.permissions';
import { CreateMenuTemplateProductDto } from './dto/create-menu-template-product.dto';
import { Permissions } from '../common/decorators';
import { PermissionsGuard } from '../common/guards/permission.guard';
import { FindAllMenuTemplateProductDto } from './dto/findAll-menu-template-product.dto';
import { UpdateMenuTemplateProductDto } from './dto/update-menu-template-product.dto';
import { MenuTemplateProductService } from './menu-template-product.service';

@Resolver('/')
export class MenuTemplateProductResolver {
  constructor(private readonly menuTemplateProductService: MenuTemplateProductService) {}

  // @Permissions(MenuTemplateProductPermissions.ALL_PERMISSION.value, MenuTemplateProductPermissions.CREATE_PERMISSION.value)
  // @UseGuards(PermissionsGuard)
  @Mutation('shoppexEmployeeCreateMenuTemplateProduct')
  create(@Args('createMenuTemplateProductDto') createMenuTemplateProductDto: CreateMenuTemplateProductDto) {
    return this.menuTemplateProductService.create(createMenuTemplateProductDto);
  }

  // @Permissions(MenuTemplateProductPermissions.ALL_PERMISSION.value, MenuTemplateProductPermissions.READ_PERMISSION.value)
  // @UseGuards(PermissionsGuard)
  @Query('findAllMenuTemplateProducts')
  findAll(@Args('params') params: FindAllMenuTemplateProductDto) {
    return this.menuTemplateProductService.getAll(params);
  }

  // @Permissions(MenuTemplateProductPermissions.ALL_PERMISSION.value, MenuTemplateProductPermissions.READ_PERMISSION.value)
  // @UseGuards(PermissionsGuard)
  @Query('findOneMenuTemplateProduct')
  findOne(@Args('menuTemplateProductId') menuTemplateProductId: string) {
    return this.menuTemplateProductService.findOne(menuTemplateProductId);
  }

  // @Permissions(MenuTemplateProductPermissions.ALL_PERMISSION.value, MenuTemplateProductPermissions.UPDATE_PERMISSION.value)
  // @UseGuards(PermissionsGuard)
  @Mutation('shoppexEmployeeUpdateMenuTemplateProduct')
  update(
    @Args('menuTemplateProductId') menuTemplateProductId: string,
    @Args('updateMenuTemplateProductDto') updateMenuTemplateProductDto: UpdateMenuTemplateProductDto,
  ) {
    return this.menuTemplateProductService.updateOne(menuTemplateProductId, updateMenuTemplateProductDto);
  }

  // @Permissions(MenuTemplateProductPermissions.ALL_PERMISSION.value, MenuTemplateProductPermissions.DELETE_PERMISSION.value)
  // @UseGuards(PermissionsGuard)
  @Mutation('shoppexEmployeeDeleteMenuTemplateProduct')
  deleteOne(@Args('menuTemplateProductId') menuTemplateProductId: string) {
    return this.menuTemplateProductService.deleteOne(menuTemplateProductId);
  }
}
