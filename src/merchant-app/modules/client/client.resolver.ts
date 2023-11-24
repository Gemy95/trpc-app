import { ForbiddenException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { ERROR_CODES } from '../../../libs/utils/src';
import { CurrentUser } from '../auth/shared/decorator/user.graphql.decorator';
import { RefreshTokenAuthGuard } from '../auth/shared/guards/refresh.token.guard';
import { Public } from '../common/decorators/public-routes.decorator';
import { ValidateMongoId } from '../common/pipes/validate-mongo-id.pipe';
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

@Resolver()
export class ClientResolver {
  constructor(private readonly clientService: ClientService) {}

  @Public()
  @Mutation('createClient')
  create(@Args('createClientDto') createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  @Public()
  @Mutation('clientVerifyMobile')
  verifyMobile(@Args('verifyChangeMobileClientDto') verifyChangeMobileClientDto: VerifyChangeMobileClientDto) {
    return this.clientService.verifyMobile(verifyChangeMobileClientDto);
  }

  @Public()
  @Mutation('clientVerifyEmail')
  verifyEmail(
    @Args('bodyConfirmClientDto') bodyConfirmClientDto: BodyConfirmClientDto,
    @Args('paramsConfirmClientDto') paramsConfirmClientDto: ParamsConfirmClientDto,
  ) {
    return this.clientService.verifyEmail({
      ...bodyConfirmClientDto,
      ...paramsConfirmClientDto,
    });
  }

  @Public()
  @Mutation('clientLogin')
  login(@Args('loginClientDto') loginClientDto: LoginClientDto) {
    return this.clientService.login(loginClientDto);
  }

  @Public()
  @Mutation('clientRequestForgetPassword')
  requestForgetPassword(
    @Args('requestForgetPasswordClientDto') requestForgetPasswordClientDto: RequestForgetPasswordClientDto,
  ) {
    return this.clientService.requestForgetPassword(requestForgetPasswordClientDto);
  }

  @Public()
  @Mutation('clientVerifyForgetPassword')
  verifyForgetPassword(
    @Args('verifyForgetPasswordClientDto') verifyForgetPasswordClientDto: VerifyForgetPasswordClientDto,
  ) {
    return this.clientService.verifyForgetPassword(verifyForgetPasswordClientDto);
  }

  @Public()
  @Mutation('clientChangePassword')
  changePassword(@Args('changePasswordClientDto') changePasswordClientDto: ChangePasswordClientDto) {
    return this.clientService.changePassword(changePasswordClientDto);
  }

  @Mutation('clientUpdate')
  updateClient(
    @Args('id') id: string,
    @Args('updateClientDto') updateClientDto: UpdateClientDto,
    @CurrentUser() user: any,
  ) {
    const { _id } = user;
    if (_id.toString() !== id.toString()) {
      throw new ForbiddenException(ERROR_CODES.err_access_denied);
    }

    return this.clientService.update(updateClientDto, user);
  }

  @Mutation('clientAddAddress')
  clientAddAddress(@CurrentUser() user: any, @Args('createAddressDto') createAddressDto: CreateAddressDto) {
    return this.clientService.addAddress(user, createAddressDto);
  }

  @Query('clientListAddress')
  clientListAddresses(@CurrentUser() user: any) {
    return this.clientService.listAddresses(user);
  }

  @Mutation('clientUpdateAddress')
  clientupdateAddress(
    @CurrentUser() user: any,
    @Args('addressId') addressId: string,
    @Args('updateAddressDto') updateAddressDto: UpdateAddressDto,
  ) {
    return this.clientService.updateAddress(user, addressId, updateAddressDto);
  }

  @Mutation('clientRemoveAddress')
  clientRemoveAddress(@CurrentUser() user: any, @Args('addressId') addressId: string) {
    return this.clientService.removeAddress(user, addressId);
  }

  @Public()
  @Mutation('clientResendOtp')
  resendOtpOwner(@Args('resendOtpClientDto') resendOtpClientDto: ResendOtpClientDto) {
    return this.clientService.resendOtpClient(resendOtpClientDto);
  }

  @Public()
  @UseGuards(RefreshTokenAuthGuard)
  @Mutation('clientRefreshToken')
  clientRefreshToken(@CurrentUser() user: any) {
    return this.clientService.clientRefreshToken(user);
  }

  // @Query('dashboardFindAllClientsByBranchId')
  // dashboardFindAllClientsByBranchId(@Args('branchId', ValidateMongoId) branchId: string) {
  //   return this.clientService.dashboardFindAllClientsByBranchId(branchId);
  // }
}
