import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Permissions, Public } from '../common/decorators';
import shoppexEmployeePermissions from '../common/permissions/shoppex-employee.permissions';
import { CurrentUser } from '../auth/shared/decorator/user.graphql.decorator';
import { RefreshTokenAuthGuard } from '../auth/shared/guards/refresh.token.guard';
import { PermissionsGuard } from '../common/guards/permission.guard';
import { ChangePasswordShoppexEmployeeDto } from './dto/change-password-shoppex-employee';
import { CreateShoppexEmployeeDto } from './dto/create-shoppex-employee.dto';
import { getShoppexEmployeesDto } from './dto/get-shoppex-employee.dto';
import { LoginShoppexEmployeeDto } from './dto/login-shoppex-employee';
import { RequestForgetPasswordShoppexEmployeeDto } from './dto/request-forget-password-shoppex-employee';
import { UpdateShoppexEmployeeDto } from './dto/update-shoppex-employee.dto';
import { VerifyForgetPasswordShoppexEmployeeDto } from './dto/verify-forget-password-shoppex-employee';
import { ShoppexEmployeeService } from './shoppex-employee.service';
import { AttachmentsService } from '../attachments/attachments.service';

@Resolver('')
export class ShoppexEmployeeResolver {
  constructor(
    private readonly shoppexEmployeeService: ShoppexEmployeeService,
    private attachmentsService: AttachmentsService,
  ) {}

  @Mutation('createShoppexEmployee')
  create(
    @CurrentUser() user: any,
    @Args('createShoppexEmployeeDto') createShoppexEmployeeDto: CreateShoppexEmployeeDto,
  ) {
    return this.shoppexEmployeeService.create(user, createShoppexEmployeeDto);
  }

  @Query('getShoppexEmployees')
  @Permissions(shoppexEmployeePermissions.ALL_PERMISSION.value, shoppexEmployeePermissions.CREATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  getShoppexEmployees(@Args('shoppexEmployeeQueryInput') shoppexEmployeeQueryInput: getShoppexEmployeesDto) {
    return this.shoppexEmployeeService.getAll(shoppexEmployeeQueryInput);
  }
  @Query('getShoppexEmployeeById')
  @Permissions(shoppexEmployeePermissions.ALL_PERMISSION.value, shoppexEmployeePermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  getShoppexEmployeeById(@Args('_id') _id: string) {
    return this.shoppexEmployeeService.findOne(_id);
  }

  @Mutation('shoppexEmployeeLogin')
  login(@Args('shoppexEmployeeLoginInput') loginShoppexEmployeeDto: LoginShoppexEmployeeDto) {
    return this.shoppexEmployeeService.login(loginShoppexEmployeeDto);
  }

  @Mutation('requestForgotShoppexEmployeePassword')
  requestForgotPassword(
    @Args('requestForgotPasswordInput') requestForgotPasswordInput: RequestForgetPasswordShoppexEmployeeDto,
  ) {
    return this.shoppexEmployeeService.requestForgetPassword(requestForgotPasswordInput);
  }

  @Permissions(shoppexEmployeePermissions.ALL_PERMISSION.value, shoppexEmployeePermissions.CREATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Mutation('shoppexEmployeeVerifyForgetPassword')
  verifyForgetPassword(
    @Args('verifyForgetPasswordShoppexEmployeeDto')
    verifyForgetPasswordShoppexEmployeeDto: VerifyForgetPasswordShoppexEmployeeDto,
  ) {
    return this.shoppexEmployeeService.verifyForgetPassword(verifyForgetPasswordShoppexEmployeeDto);
  }

  @Permissions(shoppexEmployeePermissions.ALL_PERMISSION.value, shoppexEmployeePermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Mutation('shoppexEmployeeChangePassword')
  changePassword(
    @Args('changePasswordShoppexEmployeeDto') changePasswordShoppexEmployeeDto: ChangePasswordShoppexEmployeeDto,
  ) {
    return this.shoppexEmployeeService.changePassword(changePasswordShoppexEmployeeDto);
  }

  @Permissions(shoppexEmployeePermissions.ALL_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Mutation('shoppexEmployeeUpdate')
  update(@Args('id') id: string, @Args('updateEmployeeDto') updateEmployeeDto: UpdateShoppexEmployeeDto) {
    return this.shoppexEmployeeService.update(id, updateEmployeeDto);
  }

  @Permissions(shoppexEmployeePermissions.ALL_PERMISSION.value, shoppexEmployeePermissions.DELETE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Mutation('shoppexEmployeeDelete')
  delete(@Args('id') id: string) {
    return this.shoppexEmployeeService.delete(id);
  }

  @Public()
  @UseGuards(RefreshTokenAuthGuard)
  @Mutation('shoppexEmployeeRefreshToken')
  shoppexEmployeeRefreshToken(@CurrentUser() user: any) {
    return this.shoppexEmployeeService.shoppexEmployeeRefreshToken(user);
  }

  @Public()
  @Query('shoppexEmployeeImagesAttachment')
  async listShoppexEmployeeImages() {
    return this.attachmentsService.listOperationImages();
  }
}
