import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RefreshTokenAuthGuard } from '../auth/shared/guards/refresh.token.guard';
import { CurrentUser } from '../auth/shared/decorator/user.graphql.decorator';
import { Public } from '../common/decorators/public-routes.decorator';
import { ChangePasswordOwnerDto } from './dto/change-password-owner';
import { BodyConfirmOwnerDto, ParamsConfirmOwnerDto } from './dto/confirm-owner';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { LoginOwnerDto } from './dto/login-owner';
import { RequestChangeEmailOwnerDto } from './dto/request-change-email-owner';
import { RequestChangeMobileOwnerDto } from './dto/request-change-mobile-owner';
import { RequestForgetPasswordOwnerDto } from './dto/request-forget-password-owner';
import { ResendOtpOwnerDto } from './dto/resend-otp-owner.dto';
import { UpdateOwnerByItselfDto } from './dto/update-owner-by-itself';
import { VerifyChangeEmailOwnerDto } from './dto/verify-change-email-owner';
import { VerifyChangeMobileOwnerDto } from './dto/verify-change-mobile-owner';
import { VerifyForgetPasswordOwnerDto } from './dto/verify-forget-password-owner';
import { VerifyMobileOwnerDto } from './dto/verify-mobile-owner';
import { OwnerService } from './owner.service';

@Resolver('')
export class OwnerResolver {
  constructor(private readonly ownerService: OwnerService) {}

  @Public()
  @Mutation('createOwner')
  create(@Args('createOwnerDto') createOwnerDto: CreateOwnerDto) {
    return this.ownerService.create(createOwnerDto);
  }

  @Public()
  @Mutation('ownersOrMerchantEmployeesVerifyMobile')
  verifyMobile(@Args('verifyMobileOwnerDto') verifyMobileOwnerDto: VerifyMobileOwnerDto) {
    return this.ownerService.verifyMobile({
      ...verifyMobileOwnerDto,
    });
  }

  @Public()
  @Mutation('ownersOrMerchantEmployeesVerifyEmail')
  verifyEmail(
    @Args('bodyConfirmOwnerDto') bodyConfirmOwnerDto: BodyConfirmOwnerDto,
    @Args('paramsConfirmOwnerDto') paramsConfirmOwnerDto: ParamsConfirmOwnerDto,
  ) {
    return this.ownerService.verifyEmail({
      ...bodyConfirmOwnerDto,
      ...paramsConfirmOwnerDto,
    });
  }

  @Public()
  @Mutation('ownersOrMerchantemployeesLogin')
  login(@Args('loginOwnerDto') loginOwnerDto: LoginOwnerDto) {
    return this.ownerService.login(loginOwnerDto);
  }

  @Public()
  @Mutation('ownersOrMerchantEmployeesRequestForgetPassword')
  requestForgetPassword(
    @Args('requestForgetPasswordOwnerDto') requestForgetPasswordOwnerDto: RequestForgetPasswordOwnerDto,
  ) {
    return this.ownerService.requestForgetPassword(requestForgetPasswordOwnerDto);
  }

  @Public()
  @Mutation('ownersOrMerchantEmployeesVerifyForgetPassword')
  verifyForgetPassword(
    @Args('verifyForgetPasswordOwnerDto') verifyForgetPasswordOwnerDto: VerifyForgetPasswordOwnerDto,
  ) {
    return this.ownerService.verifyForgetPassword(verifyForgetPasswordOwnerDto);
  }

  @Public()
  @Mutation('ownersOrMerchantEmployeesChangePassword')
  changePassword(@Args('changePasswordOwnerDto') changePasswordOwnerDto: ChangePasswordOwnerDto) {
    return this.ownerService.changePassword(changePasswordOwnerDto);
  }

  @Query('findOneOwner')
  findOne(@Args('ownerId') ownerId: string) {
    return this.ownerService.getOwnerById(ownerId);
  }

  @Mutation('updateOwnerByItself')
  updateOwnerByItself(
    @Args('updateOwnerByItselfDto') updateOwnerByItselfDto: UpdateOwnerByItselfDto,
    @CurrentUser() user: any,
  ) {
    return this.ownerService.updateOwnerByItself(updateOwnerByItselfDto, user);
  }

  @Mutation('ownersOrMerchantEmployeesRequestChangEmail')
  requestChangeEmail(
    @Args('requestChangeEmailOwnerDto') requestChangeEmailOwnerDto: RequestChangeEmailOwnerDto,
    @CurrentUser() user: any,
  ) {
    return this.ownerService.requestChangeEmail(requestChangeEmailOwnerDto, user);
  }

  @Mutation('ownersOrMerchantEmployeesVerifyChangeEmail')
  verifyChangeEmail(
    @Args('verifyChangeEmailOwnerDto') verifyChangeEmailOwnerDto: VerifyChangeEmailOwnerDto,
    @CurrentUser() user: any,
  ) {
    return this.ownerService.verifyChangeEmail(verifyChangeEmailOwnerDto, user);
  }

  @Mutation('ownersOrMerchantEmployeesRequestChangeMobile')
  requestChangeMobile(
    @Args('requestChangeMobileOwnerDto') requestChangeMobileOwnerDto: RequestChangeMobileOwnerDto,
    @CurrentUser() user: any,
  ) {
    return this.ownerService.requestChangeMobile(requestChangeMobileOwnerDto, user);
  }

  @Mutation('ownersOrMerchantEmployeesVerifyChangeMobile')
  verifyChangeMobile(
    @Args('verifyChangeMobileOwnerDto') verifyChangeMobileOwnerDto: VerifyChangeMobileOwnerDto,
    @CurrentUser() user: any,
  ) {
    return this.ownerService.verifyChangeMobile(verifyChangeMobileOwnerDto, user);
  }

  @Query('ownersOrMerchantEmployees')
  async findOwnerOrMerchantEmployeeById(@Args('ownerOrMerchantEmployeeId') ownerOrMerchantEmployeeId: string) {
    return this.ownerService.findOwnerOrMerchantEmployeeById(ownerOrMerchantEmployeeId);
  }

  @Public()
  @Mutation('ownersResendOtp')
  resendOtpOwner(@Args('resendOtpOwnerDto') resendOtpOwnerDto: ResendOtpOwnerDto) {
    return this.ownerService.resendOtpOwner(resendOtpOwnerDto);
  }

  @Public()
  @UseGuards(RefreshTokenAuthGuard)
  @Mutation('ownerOrMerchantemployeeRefreshToken')
  ownerOrMerchantemployeeRefreshToken(@CurrentUser() user: any) {
    return this.ownerService.ownerOrMerchantemployeeRefreshToken(user);
  }

  @Mutation('ownersOrMerchantEmployeesDeleteAccount')
  ownersOrMerchantemployeesDeleteAccount(@CurrentUser() user: any) {
    return this.ownerService.ownersOrMerchantEmployeesDeleteAccount(user);
  }

  // @Public()
  // @Mutation('ownersOrMerchantEmployeesRequestCancelDeleteAccount')
  // ownersOrMerchantEmployeesRequestCancelDeleteAccount(
  //   @Args('requestCancelDeleteAccountOwnerDto') requestCancelDeleteAccountOwnerDto: RequestCancelDeleteAccountOwnerDto,
  // ) {
  //   return this.ownerService.ownersOrMerchantEmployeesRequestCancelDeleteAccount(requestCancelDeleteAccountOwnerDto);
  // }

  // @Public()
  // @Mutation('ownersOrMerchantEmployeesVerifyCancelDeleteAccount')
  // ownersOrMerchantEmployeesVerifyCancelDeleteAccount(
  //   @Args('verifyCancelDeleteAccountOwnerDto') verifyCancelDeleteAccountOwnerDto: VerifyCancelDeleteAccountOwnerDto,
  // ) {
  //   return this.ownerService.ownersOrMerchantEmployeesVerifyCancelDeleteAccount(verifyCancelDeleteAccountOwnerDto);
  // }
}
