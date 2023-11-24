import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { CurrentUser } from '../common/decorators';
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
@Controller()
@ApiTags(swaggerResources.Owner)
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}

  @Public()
  @Post('auth/owners')
  @ApiResponse({
    description: 'This for registration owner',
    status: 201,
  })
  create(@Body() createOwnerDto: CreateOwnerDto) {
    return this.ownerService.create(createOwnerDto);
  }

  @Public()
  @Post('auth/owners-or-merchant-employees/verify-mobile')
  @ApiResponse({
    description: 'verify owner mobile',
    status: 200,
  })
  verifyMobile(@Body() verifyMobileOwnerDto: VerifyMobileOwnerDto) {
    return this.ownerService.verifyMobile({
      ...verifyMobileOwnerDto,
    });
  }

  @Public()
  @Post('auth/owners-or-merchant-employees/verify-email/:email')
  @ApiResponse({
    description: 'verify email',
    status: 200,
  })
  verifyEmail(@Body() bodyConfirmOwnerDto: BodyConfirmOwnerDto, @Param() paramsConfirmOwnerDto: ParamsConfirmOwnerDto) {
    return this.ownerService.verifyEmail({
      ...bodyConfirmOwnerDto,
      ...paramsConfirmOwnerDto,
    });
  }

  @Public()
  @Post('auth/owners-or-merchant-employees/login')
  @ApiResponse({
    description: 'login',
    status: 200,
  })
  login(@Body() loginOwnerDto: LoginOwnerDto) {
    return this.ownerService.login(loginOwnerDto);
  }

  @Public()
  @Post('auth/owners-or-merchant-employees/request-forget-password')
  @ApiResponse({
    description: 'forget password',
    status: 204,
  })
  requestForgetPassword(@Body() requestForgetPasswordOwnerDto: RequestForgetPasswordOwnerDto) {
    return this.ownerService.requestForgetPassword(requestForgetPasswordOwnerDto);
  }

  @Public()
  @Post('auth/owners-or-merchant-employees/verify-forget-password')
  @ApiResponse({
    description: 'Application',
    status: 200,
  })
  verifyForgetPassword(@Body() verifyForgetPasswordOwnerDto: VerifyForgetPasswordOwnerDto) {
    return this.ownerService.verifyForgetPassword(verifyForgetPasswordOwnerDto);
  }

  @Public()
  @Post('auth/owners-or-merchant-employees/change-password')
  @ApiResponse({
    description: 'Application',
    status: 200,
  })
  changePassword(@Body() changePasswordOwnerDto: ChangePasswordOwnerDto) {
    return this.ownerService.changePassword(changePasswordOwnerDto);
  }

  @ApiBearerAuth()
  @Get('owners/:ownerId')
  @ApiResponse({
    description: 'This for getting one owner by id',
    status: 200,
  })
  findOne(@Param('ownerId') ownerId: string) {
    return this.ownerService.getOwnerById(ownerId);
  }

  @ApiBearerAuth()
  @Patch('owners')
  @ApiResponse({
    description: 'This to update owner by itself ',
    status: 200,
  })
  updateOwnerByItself(@Body() updateOwnerByItselfDto: UpdateOwnerByItselfDto, @CurrentUser() user: any) {
    return this.ownerService.updateOwnerByItself(updateOwnerByItselfDto, user);
  }

  @ApiBearerAuth()
  @Post('auth/owners/request-change-email')
  @ApiResponse({
    description: 'change email',
    status: 204,
  })
  requestChangeEmail(@Body() requestChangeEmailOwnerDto: RequestChangeEmailOwnerDto, @CurrentUser() user: any) {
    return this.ownerService.requestChangeEmail(requestChangeEmailOwnerDto, user);
  }

  @ApiBearerAuth()
  @Patch('auth/owners/verify-change-email')
  @ApiResponse({
    description: 'verify owner change email',
    status: 200,
  })
  verifyChangeEmail(@Body() verifyChangeEmailOwnerDto: VerifyChangeEmailOwnerDto, @CurrentUser() user: any) {
    return this.ownerService.verifyChangeEmail(verifyChangeEmailOwnerDto, user);
  }

  @ApiBearerAuth()
  @Post('auth/owners/request-change-mobile')
  @ApiResponse({
    description: 'change mobile',
    status: 204,
  })
  requestChangeMobile(@Body() requestChangeMobileOwnerDto: RequestChangeMobileOwnerDto, @CurrentUser() user: any) {
    return this.ownerService.requestChangeMobile(requestChangeMobileOwnerDto, user);
  }

  @ApiBearerAuth()
  @Patch('auth/owners/verify-change-mobile')
  @ApiResponse({
    description: 'verify owner change mobile',
    status: 200,
  })
  verifyChangeMobile(@Body() verifyChangeMobileOwnerDto: VerifyChangeMobileOwnerDto, @CurrentUser() user: any) {
    return this.ownerService.verifyChangeMobile(verifyChangeMobileOwnerDto, user);
  }

  @ApiBearerAuth()
  @Get('owners-or-merchant-employees/:ownerOrMerchantEmployeeId')
  @ApiResponse({
    description: 'This for getting one owner or merchant employee by id',
    status: 200,
  })
  async findOwnerOrMerchantEmployeeById(@Param('ownerOrMerchantEmployeeId') ownerOrMerchantEmployeeId: string) {
    return this.ownerService.findOwnerOrMerchantEmployeeById(ownerOrMerchantEmployeeId);
  }

  @Public()
  @Post('auth/owners/resend-otp')
  @ApiResponse({
    description: 'owner can resend otp after registration',
    status: 200,
  })
  resendOtpOwner(@Body() resendOtpOwnerDto: ResendOtpOwnerDto) {
    return this.ownerService.resendOtpOwner(resendOtpOwnerDto);
  }
}
