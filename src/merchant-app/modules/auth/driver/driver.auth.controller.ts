import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Public } from '../shared/decorator/public.decorator';
import { CurrentUser } from '../shared/decorator/user.decorator';
import { RefreshTokenAuthGuard } from '../shared/guards/refresh.token.guard';
import { DriverAuthService } from './driver.auth.service';

@Controller('auth/driver')
export class DriverAuthController {
  constructor(private readonly driverAuthService: DriverAuthService) {}

  @Public()
  @Get('/login')
  sign(): any {
    return this.driverAuthService.generateTokens({
      name: 'ali',
      mobile: '01017431767',
    });
  }

  // @Post('/checkToken')
  // checkToken(): { message: string } {
  //   return { message: 'success' };
  // }

  // @Public()
  // @Get('/public')
  // checkPublic(): { message: string } {
  //   return { message: 'success' };
  // }

  // @Public()
  // @UseGuards(RefreshTokenAuthGuard)
  // @Post('refresh')
  // refreshTokens(@CurrentUser() user: any) {
  //   return this.driverAuthService.refreshTokens(user);
  // }
}
