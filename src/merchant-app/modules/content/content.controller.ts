import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { ContentService } from './content.service';
import { CreateContentDto, QueryContentDto, UpdateContentDto } from './dtos/content.dto';
import { ContentType } from '../models';
import { Permissions } from '../common/decorators';
import { UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '../common/guards/permission.guard';
import ContentPermissions from '../common/permissions/content.permissions';

@ApiTags(swaggerResources.Content)
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Public()
  @ApiQuery({ name: 'content_type', enum: ContentType, required: false })
  @Get('/')
  // findAll(@Query() query: TransactionQueryDto) {
  find(@Query() contentType?: QueryContentDto) {
    return this.contentService.find(contentType);
  }

  @ApiBearerAuth()
  @Permissions(ContentPermissions.ALL_PERMISSION.value, ContentPermissions.CREATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Post('create')
  @ApiResponse({
    description: 'This for create content',
    status: 201,
  })
  create(@Body() createContentDto: CreateContentDto) {
    return this.contentService.create(createContentDto);
  }

  @ApiBearerAuth()
  @Permissions(ContentPermissions.ALL_PERMISSION.value, ContentPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Patch('update')
  @ApiResponse({
    description: 'This for update content',
    status: 201,
  })
  updateOne(@Param('_id') _id: string, @Body() updateContentDto: UpdateContentDto) {
    return this.contentService.update(_id, updateContentDto);
  }

  @ApiBearerAuth()
  @Permissions(ContentPermissions.ALL_PERMISSION.value, ContentPermissions.DELETE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Delete('delete/:id')
  @ApiResponse({ description: 'Application', status: 200 })
  deleteOne(@Param('id') id: string) {
    return this.contentService.remove(id);
  }
}
