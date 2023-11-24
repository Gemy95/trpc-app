import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Public } from '../common/decorators';
import MenuTemplatePermissions from '../common/permissions/menu-template.permissions';
import { MenuTemplateService } from './menu-template.service';
import { CreateMenuTemplateDto } from './dto/create-menu-template.dto';
import { Permissions } from '../common/decorators';
import { PermissionsGuard } from '../common/guards/permission.guard';
import { FindAllMenuTemplateDto } from './dto/findAll-menu-template.dto';
import { UpdateMenuTemplateDto } from './dto/update-menu-template.dto';

@Resolver('/')
export class MenuTemplateResolver {
  constructor(private readonly menuTemplateService: MenuTemplateService) {}

  // need update
  // @Permissions(MenuTemplatePermissions.ALL_PERMISSION.value, MenuTemplatePermissions.CREATE_PERMISSION.value)
  // @UseGuards(PermissionsGuard)
  @Mutation('shoppexEmployeeCreateMenuTemplate')
  create(@Args('createMenuTemplateDto') createMenuTemplateDto: CreateMenuTemplateDto) {
    return this.menuTemplateService.create(createMenuTemplateDto);
  }

  // @Permissions(MenuTemplatePermissions.ALL_PERMISSION.value, MenuTemplatePermissions.READ_PERMISSION.value)
  // @UseGuards(PermissionsGuard)
  @Query('findAllMenuTemplates')
  findAll(@Args('params') params: FindAllMenuTemplateDto) {
    return this.menuTemplateService.getAll(params);
  }

  // @Permissions(MenuTemplatePermissions.ALL_PERMISSION.value, MenuTemplatePermissions.READ_PERMISSION.value)
  // @UseGuards(PermissionsGuard)
  @Query('findOneMenuTemplate')
  findOne(@Args('menuTemplateId') menuTemplateId: string) {
    return this.menuTemplateService.findOne(menuTemplateId);
  }

  // @Permissions(MenuTemplatePermissions.ALL_PERMISSION.value, MenuTemplatePermissions.UPDATE_PERMISSION.value)
  // @UseGuards(PermissionsGuard)
  @Mutation('shoppexEmployeeUpdateMenuTemplate')
  update(
    @Args('menuTemplateId') menuTemplateId: string,
    @Args('updateMenuTemplateDto') updateMenuTemplateDto: UpdateMenuTemplateDto,
  ) {
    return this.menuTemplateService.updateOne(menuTemplateId, updateMenuTemplateDto);
  }

  // @Permissions(MenuTemplatePermissions.ALL_PERMISSION.value, MenuTemplatePermissions.DELETE_PERMISSION.value)
  // @UseGuards(PermissionsGuard)
  @Mutation('shoppexEmployeeDeleteMenuTemplate')
  deleteOne(@Args('menuTemplateId') menuTemplateId: string) {
    return this.menuTemplateService.deleteOne(menuTemplateId);
  }
}
