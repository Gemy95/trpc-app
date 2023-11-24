import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PermissionsGuard } from '../common/guards';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import departmentPermissions from '../common/permissions/department.permissions';
import { Permissions } from '../common/decorators';
import { GetAllDepartmentsDto } from './dto/get-all-department.input';
import { UseGuards } from '@nestjs/common';
import { ValidateMongoId } from '../common/pipes/validate-mongo-id.pipe';

@Resolver('')
export class DepartmentsResolver {
  constructor(private readonly departmentService: DepartmentsService) {}

  @Mutation('createDepartment')
  @Permissions(departmentPermissions.ALL_PERMISSION.value, departmentPermissions.CREATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  async create(@Args('body') body: CreateDepartmentDto) {
    return this.departmentService.create(body);
  }

  @Query('findAllDepartments')
  @Permissions(departmentPermissions.ALL_PERMISSION.value, departmentPermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  async findAll(@Args('query') query: GetAllDepartmentsDto) {
    return this.departmentService.find(query);
  }

  @Query('findOneDepartment')
  @Permissions(departmentPermissions.ALL_PERMISSION.value, departmentPermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  async findById(@Args('id', ValidateMongoId) id: string) {
    return this.departmentService.findById(id);
  }

  @Mutation('updateOneDepartment')
  @Permissions(departmentPermissions.ALL_PERMISSION.value, departmentPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  async update(@Args('id', ValidateMongoId) id: string, @Args('body') body: UpdateDepartmentDto) {
    return this.departmentService.update(id, body);
  }

  @Mutation('removeOneDepartment')
  @Permissions(departmentPermissions.ALL_PERMISSION.value, departmentPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  async remove(@Args('id', ValidateMongoId) id: string) {
    return this.departmentService.removeDepartment(id);
  }
}
