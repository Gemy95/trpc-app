import { Controller, Post, Body, Patch } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public-routes.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-auth.dto';
import { ChangePasswordDto } from './dto/change-password';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { swaggerResources } from '../common/constants/swagger-resource.constants';

@ApiTags(swaggerResources.Authentication)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiResponse({ description: 'login', status: 200 })
  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Patch('/change-password')
  @ApiResponse({ description: 'change password' })
  changePassword(@Body() changePasswordDto: ChangePasswordDto, @CurrentUser() user: any) {
    return this.authService.changePassword(changePasswordDto, user);
  }
}
