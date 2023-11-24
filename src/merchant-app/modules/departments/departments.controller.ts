import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PermissionsGuard } from '../common/guards';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import departmentPermissions from '../common/permissions/department.permissions';
import { Permissions } from '../common/decorators';
import { GetAllDto } from '../common/dto/get-all.dto';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { GetAllDepartmentsDto } from './dto/get-all-department.dto';
import { ValidateMongoId } from '../common/pipes/validate-mongo-id.pipe';

@Controller('departments')
@ApiTags(swaggerResources.Department)
export class DepartmentsController {
  constructor(private readonly departmentService: DepartmentsService) {}

  @Post()
  @Permissions(departmentPermissions.ALL_PERMISSION.value, departmentPermissions.CREATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @ApiBearerAuth()
  @ApiResponse({ description: 'Application', status: 200 })
  async create(@Body() body: CreateDepartmentDto) {
    return this.departmentService.create(body);
  }

  @Get()
  @Permissions(departmentPermissions.ALL_PERMISSION.value, departmentPermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @ApiBearerAuth()
  @ApiResponse({ description: 'Application', status: 200 })
  async find(@Query() query: GetAllDepartmentsDto) {
    return this.departmentService.find(query);
  }

  @Get(':id')
  @Permissions(departmentPermissions.ALL_PERMISSION.value, departmentPermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @ApiBearerAuth()
  @ApiResponse({ description: 'Application', status: 200 })
  async findById(@Param('id', ValidateMongoId) id: string) {
    return this.departmentService.findById(id);
  }

  @Patch(':id')
  @Permissions(departmentPermissions.ALL_PERMISSION.value, departmentPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @ApiBearerAuth()
  @ApiResponse({ description: 'Application', status: 200 })
  async update(@Param('id', ValidateMongoId) id: string, @Body() body: UpdateDepartmentDto) {
    return this.departmentService.update(id, body);
  }

  @Delete(':id')
  @Permissions(departmentPermissions.ALL_PERMISSION.value, departmentPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @ApiBearerAuth()
  @ApiResponse({ description: 'Application', status: 200 })
  async remove(@Param('id', ValidateMongoId) id: string) {
    return this.departmentService.removeDepartment(id);
  }
}
