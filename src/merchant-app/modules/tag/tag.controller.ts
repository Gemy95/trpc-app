import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { Permissions, Public } from '../common/decorators';
import { PermissionsGuard } from '../common/guards';
import tagPermissions from '../common/permissions/tag.permissions';
import { TagDto } from './dto/tag.dto';
import { TagQueryDto } from './dto/tagQuery.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagService } from './tag.service';

@Controller()
@ApiTags(swaggerResources.Tag)
@ApiBearerAuth()
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get('/tags')
  @Permissions(tagPermissions.ALL_PERMISSION.value, tagPermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  find(@Query() query: TagQueryDto) {
    return this.tagService.find(query);
  }

  @Post('categories/:categoryId/tags')
  @Permissions(tagPermissions.ALL_PERMISSION.value, tagPermissions.CREATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @ApiResponse({
    description: 'Application',
    status: 200,
  })
  create(@Param('categoryId') categoryId: string, @Body() createDto: TagDto) {
    return this.tagService.create(categoryId, createDto);
  }

  @Get('categories/:categoryId/tags')
  @Permissions(tagPermissions.ALL_PERMISSION.value, tagPermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Public()
  @ApiResponse({
    description: 'Application',
    status: 200,
  })
  all(@Param('categoryId') categoryId: string, @Query() params: TagQueryDto) {
    return this.tagService.getAllByCategoryId(categoryId, params);
  }

  @Get('categories/:categoryId/tags/:id')
  @Permissions(tagPermissions.ALL_PERMISSION.value, tagPermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @ApiResponse({
    description: 'Application',
    status: 200,
  })
  getOne(@Param('categoryId') categoryId: string, @Param('id') id: string) {
    return this.tagService.getOne(categoryId, id);
  }

  @Put('categories/:categoryId/tags/:id')
  @Permissions(tagPermissions.ALL_PERMISSION.value, tagPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @ApiResponse({
    description: 'Application',
    status: 200,
  })
  @ApiConsumes('multipart/form-data')
  // @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  update(
    @Param('categoryId') categoryId: string,
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
    // @UploadedFiles() files: Record<string, Express.Multer.File[]>,
  ) {
    return this.tagService.updateOne(categoryId, id, updateTagDto);
  }

  @Delete('categories/:categoryId/tags/:id')
  @Permissions(tagPermissions.ALL_PERMISSION.value, tagPermissions.DELETE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @ApiResponse({
    description: 'Application',
    status: 200,
  })
  deleteOne(@Param('categoryId') categoryId: string, @Param('id') id: string) {
    return this.tagService.deleteOne(categoryId, id);
  }
}
