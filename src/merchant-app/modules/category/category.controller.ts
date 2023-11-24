import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CategoryDto } from './dto/category.dto';
import { CategoryService } from './category.service';
import { CategoryQueryDto } from './dto/categoryQuery.dto';
import { Public, Permissions } from '../common/decorators';
import categoriesPermissions from '../common/permissions/category.permissions';
import { PermissionsGuard } from '../common/guards';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { UpdateCategoryDto } from './dto/update-category.dto';
@Controller('categories')
@ApiTags(swaggerResources.Category)
@ApiBearerAuth()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Permissions(categoriesPermissions.ALL_PERMISSION.value, categoriesPermissions.CREATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @ApiResponse({ description: 'Application', status: 200 })
  //@UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  create(/*@UploadedFiles() files,*/ @Body() createDto: CategoryDto) {
    return this.categoryService.create(createDto);
  }

  @Public()
  @Get()
  @ApiResponse({ description: 'Application', status: 200 })
  all(@Query() params: CategoryQueryDto) {
    return this.categoryService.getAll(params);
  }

  @Public()
  @Get(':id')
  @ApiResponse({ description: 'Application', status: 200 })
  getOne(@Param('id') id: string) {
    return this.categoryService.getOne(id);
  }

  @Patch(':id')
  @Permissions(categoriesPermissions.ALL_PERMISSION.value, categoriesPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @ApiResponse({ description: 'Application', status: 200 })
  //@UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  update(
    //@UploadedFiles() files,
    @Param('id') id: string,
    @Body() categoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateOne(id, categoryDto /*, files?.image*/);
  }

  @Delete(':id')
  @Permissions(categoriesPermissions.ALL_PERMISSION.value, categoriesPermissions.DELETE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @ApiResponse({ description: 'Application', status: 200 })
  deleteOne(@Param('id') id: string) {
    return this.categoryService.deleteOne(id);
  }
}
