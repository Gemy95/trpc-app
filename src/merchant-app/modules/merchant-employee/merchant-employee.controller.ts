import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import merchantPermissions from '../common/permissions/merchant.permissions';
import shoppexEmployeePermissions from '../common/permissions/shoppex-employee.permissions';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { CurrentUser, Permissions } from '../common/decorators';
import { PermissionsGuard } from '../common/guards';
import { CreateMerchantEmployeeDto } from './dto/create-merchant-employee.dto';
import { RequestChangeEmailMerchantEmployeeDto } from './dto/request-change-email-merchant-employee';
import { RequestChangeMobileMerchantEmployeeDto } from './dto/request-change-mobile-merchant-employee';
import { UpdateMerchantEmployeeByItselfDto } from './dto/update-merchant-employee-by-itself';
import { UpdateMerchantEmployeeDto } from './dto/update-merchant-employee.dto';
import { VerifyChangeEmailMerchantEmployeeDto } from './dto/verify-change-email-merchant-employee';
import { VerifyChangeMobileMerchantEmployeeDto } from './dto/verify-change-mobile-merchant-employee';
import { MerchantEmployeeService } from './merchant-employee.service';
import { GetAllDto } from '../common/dto/get-all.dto';
import { ValidateMongoId } from '../common/pipes/validate-mongo-id.pipe';

@ApiBearerAuth()
@Controller()
@ApiTags(swaggerResources.Merchant)
export class MerchantEmployeeController {
  constructor(private readonly merchantEmployeeService: MerchantEmployeeService) {}

  @Post('auth/merchant-employees')
  @ApiResponse({
    description: 'This for registration merchant employee',
    status: 201,
  })
  create(@CurrentUser() user: any, @Body() createMerchantEmployeeDto: CreateMerchantEmployeeDto) {
    return this.merchantEmployeeService.create(user, createMerchantEmployeeDto);
  }

  @ApiBearerAuth()
  @Get('/merchant-employees/:merchantId')
  @ApiResponse({
    description: 'Get merchant employees by merchant ID',
    status: 200,
  })
  @Permissions(
    merchantPermissions.ALL_PERMISSION.value,
    merchantPermissions.READ_PERMISSION.value,
    shoppexEmployeePermissions.ALL_PERMISSION.value,
    shoppexEmployeePermissions.READ_PERMISSION.value,
  )
  @UseGuards(PermissionsGuard)
  getMerchantEmployeesByMerchantId(
    @Param('merchantId', ValidateMongoId) merchantId: string,
    @Query() params: GetAllDto,
  ) {
    return this.merchantEmployeeService.getMerchantEmployeesByMerchantId(merchantId, params);
  }

  @ApiBearerAuth()
  @Get('auth/merchant-employees/:employeeId')
  @ApiResponse({
    description: 'Owner can Get employee by ID',
    status: 200,
  })
  @Permissions(merchantPermissions.ALL_PERMISSION.value, merchantPermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  findOne(@Param('employeeId', ValidateMongoId) employeeId: string) {
    return this.merchantEmployeeService.findOne(employeeId);
  }

  @ApiBearerAuth()
  @Patch('auth/merchant-employees/:employeeId')
  @ApiResponse({
    description: 'Owner can Update employee by ID',
    status: 200,
  })
  @Permissions(merchantPermissions.ALL_PERMISSION.value, merchantPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  update(
    @Param('employeeId', ValidateMongoId) employeeId: string,
    @Body() updateMerchantEmployeeDto: UpdateMerchantEmployeeDto,
  ) {
    return this.merchantEmployeeService.update(employeeId, updateMerchantEmployeeDto);
  }

  @Delete('auth/merchant-employees/:employeeId')
  @ApiResponse({
    description: 'Owner can Delete Employee by Employee ID',
    status: 200,
  })
  @Permissions(merchantPermissions.ALL_PERMISSION.value, merchantPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  remove(@Param('employeeId', ValidateMongoId) employeeId: string) {
    return this.merchantEmployeeService.remove(employeeId);
  }

  @ApiBearerAuth()
  @Patch('merchant-employees')
  @ApiResponse({
    description: 'This to update merchant employee by itself ',
    status: 200,
  })
  updateMerchantEmployeesByItself(
    @Body() updateMerchantEmployeeByItselfDto: UpdateMerchantEmployeeByItselfDto,
    @CurrentUser() user: any,
  ) {
    return this.merchantEmployeeService.updateMerchantEmployeeByItself(updateMerchantEmployeeByItselfDto, user);
  }

  @ApiBearerAuth()
  @Post('auth/merchant-employees/request-change-email')
  @ApiResponse({
    description: 'change email',
    status: 204,
  })
  requestChangeEmail(
    @Body() requestChangeEmailMerchantEmployeeDto: RequestChangeEmailMerchantEmployeeDto,
    @CurrentUser() user: any,
  ) {
    return this.merchantEmployeeService.requestChangeEmail(requestChangeEmailMerchantEmployeeDto, user);
  }

  @ApiBearerAuth()
  @Patch('auth/merchant-employees/verify/change-email')
  @ApiResponse({
    description: 'verify merchant employee change email',
    status: 200,
  })
  verifyChangeEmail(
    @Body() verifyChangeEmailMerchantEmployeeDto: VerifyChangeEmailMerchantEmployeeDto,
    @CurrentUser() user: any,
  ) {
    return this.merchantEmployeeService.verifyChangeEmail(verifyChangeEmailMerchantEmployeeDto, user);
  }

  @ApiBearerAuth()
  @Post('auth/merchant-employees/request-change-mobile')
  @ApiResponse({
    description: 'change mobile',
    status: 204,
  })
  requestChangeMobile(
    @Body() requestChangeMobileMerchantEmployeeDto: RequestChangeMobileMerchantEmployeeDto,
    @CurrentUser() user: any,
  ) {
    return this.merchantEmployeeService.requestChangeMobile(requestChangeMobileMerchantEmployeeDto, user);
  }

  @ApiBearerAuth()
  @Patch('auth/merchant-employees/verify/change-mobile')
  @ApiResponse({
    description: 'verify merchant employee change mobile',
    status: 200,
  })
  verifyChangeMobile(
    @Body() verifyChangeMobileMerchantEmployeeDto: VerifyChangeMobileMerchantEmployeeDto,
    @CurrentUser() user: any,
  ) {
    return this.merchantEmployeeService.verifyChangeMobile(verifyChangeMobileMerchantEmployeeDto, user);
  }
}
