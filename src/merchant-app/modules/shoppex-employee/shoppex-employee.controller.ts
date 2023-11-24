import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PermissionsGuard } from '../common/guards';
import shoppexEmployeePermissions from '../common/permissions/shoppex-employee.permissions';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { CurrentUser, Permissions, Public } from '../common/decorators';
import { ChangePasswordShoppexEmployeeDto } from './dto/change-password-shoppex-employee';
import { CreateShoppexEmployeeDto } from './dto/create-shoppex-employee.dto';
import { LoginShoppexEmployeeDto } from './dto/login-shoppex-employee';
import { RequestForgetPasswordShoppexEmployeeDto } from './dto/request-forget-password-shoppex-employee';
import { UpdateShoppexEmployeeDto } from './dto/update-shoppex-employee.dto';
import { VerifyForgetPasswordShoppexEmployeeDto } from './dto/verify-forget-password-shoppex-employee';
import { ShoppexEmployeeService } from './shoppex-employee.service';
import { getShoppexEmployeesDto } from './dto/get-shoppex-employee.dto';

@Controller('auth/shoppex-employees')
@ApiTags(swaggerResources.ShoppexEmployee)
export class ShoppexEmployeeController {
  constructor(private readonly shoppexEmployeeService: ShoppexEmployeeService) {}

  @Permissions(shoppexEmployeePermissions.ALL_PERMISSION.value, shoppexEmployeePermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @ApiBearerAuth()
  @Get()
  @ApiResponse({
    description: 'This for Getting All shoppex employee',
    status: 201,
  })
  getAll(@Query() query: getShoppexEmployeesDto) {
    return this.shoppexEmployeeService.getAll(query);
  }

  @ApiBearerAuth()
  @Permissions(shoppexEmployeePermissions.ALL_PERMISSION.value, shoppexEmployeePermissions.CREATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Post()
  @ApiResponse({
    description: 'This for registration shoppex employee',
    status: 201,
  })
  create(@CurrentUser() user: any, @Body() createShoppexEmployeeDto: CreateShoppexEmployeeDto) {
    return this.shoppexEmployeeService.create(user, createShoppexEmployeeDto);
  }

  @Public()
  @Post('/login')
  @ApiResponse({
    description: 'login',
    status: 200,
  })
  login(@Body() loginShoppexEmployeeDto: LoginShoppexEmployeeDto) {
    return this.shoppexEmployeeService.login(loginShoppexEmployeeDto);
  }

  @Public()
  @Post('/request-forget-password')
  @ApiResponse({
    description: 'forget password',
    status: 204,
  })
  requestForgetPassword(
    @Body()
    requestForgetPasswordShoppexEmployeeDto: RequestForgetPasswordShoppexEmployeeDto,
  ) {
    return this.shoppexEmployeeService.requestForgetPassword(requestForgetPasswordShoppexEmployeeDto);
  }

  @ApiBearerAuth()
  @Permissions(shoppexEmployeePermissions.ALL_PERMISSION.value, shoppexEmployeePermissions.CREATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Post('/verify-forget-password')
  @ApiResponse({
    description: 'Application',
    status: 200,
  })
  verifyForgetPassword(
    @Body()
    verifyForgetPasswordShoppexEmployeeDto: VerifyForgetPasswordShoppexEmployeeDto,
  ) {
    return this.shoppexEmployeeService.verifyForgetPassword(verifyForgetPasswordShoppexEmployeeDto);
  }

  @Permissions(shoppexEmployeePermissions.ALL_PERMISSION.value, shoppexEmployeePermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Post('/change-password')
  @ApiResponse({
    description: 'Application',
    status: 200,
  })
  changePassword(@Body() changePasswordShoppexEmployeeDto: ChangePasswordShoppexEmployeeDto) {
    return this.shoppexEmployeeService.changePassword(changePasswordShoppexEmployeeDto);
  }

  @ApiBearerAuth()
  @Permissions(shoppexEmployeePermissions.ALL_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Patch(':id')
  @ApiResponse({
    description: 'Application',
    status: 204,
  })
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateShoppexEmployeeDto) {
    return this.shoppexEmployeeService.update(id, updateEmployeeDto);
  }

  @ApiBearerAuth()
  @Permissions(shoppexEmployeePermissions.ALL_PERMISSION.value, shoppexEmployeePermissions.DELETE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Delete(':id')
  @ApiResponse({
    description: 'Application',
    status: 204,
  })
  delete(@Param('id') id: string) {
    return this.shoppexEmployeeService.delete(id);
  }

  @ApiBearerAuth()
  @Permissions(shoppexEmployeePermissions.ALL_PERMISSION.value, shoppexEmployeePermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Get(':id')
  @ApiResponse({
    description: 'Application',
    status: 204,
  })
  findOne(@Param('id') id: string) {
    return this.shoppexEmployeeService.findOne(id);
  }
}
