import merchantPermissions from '../common/permissions/merchant.permissions';
import shoppexEmployeePermissions from '../common/permissions/shoppex-employee.permissions';
import { Permissions } from '../common/decorators';
import { PermissionsGuard } from '../common/guards';
import { CreateMerchantEmployeeDto } from './dto/create-merchant-employee.dto';
// import { RequestChangeEmailMerchantEmployeeDto } from './dto/request-change-email-merchant-employee';
// import { RequestChangeMobileMerchantEmployeeDto } from './dto/request-change-mobile-merchant-employee';
import { UpdateMerchantEmployeeByItselfDto } from './dto/update-merchant-employee-by-itself';
import { UpdateMerchantEmployeeDto } from './dto/update-merchant-employee.dto';
// import { VerifyChangeEmailMerchantEmployeeDto } from './dto/verify-change-email-merchant-employee';
// import { VerifyChangeMobileMerchantEmployeeDto } from './dto/verify-change-mobile-merchant-employee';
import { MerchantEmployeeService } from './merchant-employee.service';
import { GetAllDto } from '../common/dto/get-all.dto';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/shared/decorator/user.graphql.decorator';
import { FindAllMerchantEmployeeByMerchantIdDto } from './dto/find-all-merchant-employee-by-merchant-id.dto';
import { ValidateMongoId } from '../common/pipes/validate-mongo-id.pipe';
import { CreateMerchantEmployeesDto } from './dto/create-merchant-employees.dto';
import { ResetPasswordMerchantEmployeeDto } from './dto/reset-password-merchant-employee';

@Resolver('')
export class MerchantEmployeeResolver {
  constructor(private readonly merchantEmployeeService: MerchantEmployeeService) {}

  @Mutation('createMerchantEmployee')
  create(
    @CurrentUser() user: any,
    @Args('createMerchantEmployeeDto') createMerchantEmployeeDto: CreateMerchantEmployeeDto,
  ) {
    return this.merchantEmployeeService.create(user, createMerchantEmployeeDto);
  }

  @Mutation('createMerchantEmployees')
  createMerchantEmployees(
    @CurrentUser() user: any,
    @Args('createMerchantEmployeesDto') createMerchantEmployeesDto: CreateMerchantEmployeesDto,
  ) {
    return this.merchantEmployeeService.createMerchantEmployees(user, createMerchantEmployeesDto);
  }

  @Query('findAllMerchantEmployeesByMerchant')
  @Permissions(
    merchantPermissions.ALL_PERMISSION.value,
    merchantPermissions.READ_PERMISSION.value,
    shoppexEmployeePermissions.ALL_PERMISSION.value,
    shoppexEmployeePermissions.READ_PERMISSION.value,
  )
  @UseGuards(PermissionsGuard)
  getMerchantEmployeesByMerchantId(
    @Args('merchantId', ValidateMongoId) merchantId: string,
    @Args('params') params: FindAllMerchantEmployeeByMerchantIdDto,
  ) {
    return this.merchantEmployeeService.getMerchantEmployeesByMerchantId(merchantId, params);
  }

  @Query('findOneMerchantEmployee')
  @Permissions(merchantPermissions.ALL_PERMISSION.value, merchantPermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  findOne(@Args('employeeId') employeeId: string) {
    return this.merchantEmployeeService.findOne(employeeId);
  }

  @Mutation('shoppexEmployeeUpdateMerchantEmployee')
  @Permissions(merchantPermissions.ALL_PERMISSION.value, merchantPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  update(
    @Args('employeeId') employeeId: string,
    @Args('updateMerchantEmployeeDto') updateMerchantEmployeeDto: UpdateMerchantEmployeeDto,
  ) {
    return this.merchantEmployeeService.update(employeeId, updateMerchantEmployeeDto);
  }

  @Mutation('removeMerchantEmployee')
  @Permissions(merchantPermissions.ALL_PERMISSION.value, merchantPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  remove(@Args('employeeId') employeeId: string) {
    return this.merchantEmployeeService.remove(employeeId);
  }

  @Mutation('updateMerchantEmployeesByItself')
  // @Permissions()
  // @UseGuards(PermissionsGuard)
  updateMerchantEmployeesByItself(
    @Args('updateMerchantEmployeeByItselfDto') updateMerchantEmployeeByItselfDto: UpdateMerchantEmployeeByItselfDto,
    @CurrentUser() user: any,
  ) {
    return this.merchantEmployeeService.updateMerchantEmployeeByItself(updateMerchantEmployeeByItselfDto, user);
  }

  @Mutation('merchantEmployeesResetPassword')
  resetPasswordMerchantEmployee(
    @Args('resetPasswordMerchantEmployeeDto') resetPasswordMerchantEmployeeDto: ResetPasswordMerchantEmployeeDto,
    @CurrentUser() user: any,
  ) {
    return this.merchantEmployeeService.merchantEmployeesResetPassword(resetPasswordMerchantEmployeeDto, user);
  }

  // @Mutation('auth/merchant-employees/request-change-email')
  // requestChangeEmail(
  //   @Args('requestChangeEmailMerchantEmployeeDto') requestChangeEmailMerchantEmployeeDto: RequestChangeEmailMerchantEmployeeDto,
  //   @CurrentUser() user: any,
  // ) {
  //   return this.merchantEmployeeService.requestChangeEmail(requestChangeEmailMerchantEmployeeDto, user);
  // }

  // @Mutation('auth/merchant-employees/verify/change-email')
  // verifyChangeEmail(
  //   @Args('verifyChangeEmailMerchantEmployeeDto') verifyChangeEmailMerchantEmployeeDto: VerifyChangeEmailMerchantEmployeeDto,
  //   @CurrentUser() user: any,
  // ) {
  //   return this.merchantEmployeeService.verifyChangeEmail(verifyChangeEmailMerchantEmployeeDto, user);
  // }

  // @Mutation('auth/merchant-employees/request-change-mobile')
  // requestChangeMobile(
  //   @Args('requestChangeMobileMerchantEmployeeDto') requestChangeMobileMerchantEmployeeDto: RequestChangeMobileMerchantEmployeeDto,
  //   @CurrentUser() user: any,
  // ) {
  //   return this.merchantEmployeeService.requestChangeMobile(requestChangeMobileMerchantEmployeeDto, user);
  // }

  // @Mutation('auth/merchant-employees/verify/change-mobile')
  // verifyChangeMobile(
  //   @Args('verifyChangeMobileMerchantEmployeeDto') verifyChangeMobileMerchantEmployeeDto: VerifyChangeMobileMerchantEmployeeDto,
  //   @CurrentUser() user: any,
  // ) {
  //   return this.merchantEmployeeService.verifyChangeMobile(verifyChangeMobileMerchantEmployeeDto, user);
  // }
}
