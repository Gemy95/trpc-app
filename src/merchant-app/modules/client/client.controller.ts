import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ERROR_CODES } from '../../../libs/utils/src';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public-routes.decorator';
import { ClientService } from './client.service';
import { ChangePasswordClientDto } from './dto/change-password-client';
import { BodyConfirmClientDto, ParamsConfirmClientDto } from './dto/confirm-client';
import { CreateAddressDto } from './dto/create-address.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { LoginClientDto } from './dto/login-client';
import { RequestForgetPasswordClientDto } from './dto/request-forget-password-client';
import { ResendOtpClientDto } from './dto/resend-otp-client.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { VerifyChangeMobileClientDto } from './dto/verify-change-mobile.dto';
import { VerifyForgetPasswordClientDto } from './dto/verify-forget-password-client';

@Controller()
@ApiTags(swaggerResources.Client)
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Public()
  @Post('auth/clients')
  @ApiResponse({ description: 'This for registration client', status: 201 })
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  @Public()
  @Post('auth/clients/verify-mobile/')
  @ApiResponse({
    description: 'verify client mobile',
    status: 200,
  })
  verifyMobile(@Body() verifyChangeMobileClientDto: VerifyChangeMobileClientDto) {
    return this.clientService.verifyMobile(verifyChangeMobileClientDto);
  }

  @Public()
  @Post('auth/clients/verify-email/:email')
  @ApiResponse({
    description: 'verify email',
    status: 200,
  })
  verifyEmail(
    @Body() bodyConfirmClientDto: BodyConfirmClientDto,
    @Param() paramsConfirmClientDto: ParamsConfirmClientDto,
  ) {
    return this.clientService.verifyEmail({
      ...bodyConfirmClientDto,
      ...paramsConfirmClientDto,
    });
  }

  @Public()
  @Post('auth/clients/login')
  @ApiResponse({
    description: 'login',
    status: 200,
  })
  login(@Body() loginClientDto: LoginClientDto) {
    return this.clientService.login(loginClientDto);
  }

  @Public()
  @Post('auth/clients/request-forget-password')
  @ApiResponse({
    description: 'forget password',
    status: 204,
  })
  requestForgetPassword(@Body() requestForgetPasswordClientDto: RequestForgetPasswordClientDto) {
    return this.clientService.requestForgetPassword(requestForgetPasswordClientDto);
  }

  @Public()
  @Post('auth/clients/verify-forget-password')
  @ApiResponse({
    description: 'Application',
    status: 200,
  })
  verifyForgetPassword(@Body() verifyForgetPasswordClientDto: VerifyForgetPasswordClientDto) {
    return this.clientService.verifyForgetPassword(verifyForgetPasswordClientDto);
  }

  @Public()
  @Post('auth/clients/change-password')
  @ApiResponse({
    description: 'Application',
    status: 200,
  })
  changePassword(@Body() changePasswordClientDto: ChangePasswordClientDto) {
    return this.clientService.changePassword(changePasswordClientDto);
  }

  @ApiBearerAuth()
  @Patch('auth/clients/:id')
  updateClient(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto, @CurrentUser() user: any) {
    const { _id } = user;
    if (_id.toString() !== id.toString()) {
      throw new ForbiddenException(ERROR_CODES.err_access_denied);
    }

    return this.clientService.update(updateClientDto, user);
  }

  @ApiBearerAuth()
  @Post('/clients/add-address')
  @ApiResponse({
    description: 'add address',
    status: 201,
  })
  clientAddAddress(@CurrentUser() user: any, @Body() createAddressDto: CreateAddressDto) {
    return this.clientService.addAddress(user, createAddressDto);
  }

  @ApiBearerAuth()
  @Get('/clients/list-address')
  @ApiResponse({
    description: 'get addresses',
    status: 200,
  })
  clientListAddresses(@CurrentUser() user: any) {
    return this.clientService.listAddresses(user);
  }

  @ApiBearerAuth()
  @ApiResponse({
    description: 'update addresses',
    status: 200,
  })
  @Patch('/clients/update-address/:addressId')
  clientupdateAddress(
    @CurrentUser() user: any,
    @Param('addressId') addressId: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.clientService.updateAddress(user, addressId, updateAddressDto);
  }

  @ApiBearerAuth()
  @ApiResponse({
    description: 'delete addresses',
    status: 204,
  })
  @Delete('/clients/remove-address/:addressId')
  clientRemoveAddress(@CurrentUser() user: any, @Param('addressId') addressId: string) {
    return this.clientService.removeAddress(user, addressId);
  }

  @Public()
  @Post('auth/clients/resend-otp')
  @ApiResponse({
    description: 'client can resend otp after registration',
    status: 200,
  })
  resendOtpOwner(@Body() resendOtpClientDto: ResendOtpClientDto) {
    return this.clientService.resendOtpClient(resendOtpClientDto);
  }
}
