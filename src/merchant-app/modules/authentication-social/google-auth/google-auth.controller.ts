import { Controller, Get, Request, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { swaggerResources } from '../../../../libs/database/src/lib/common/constants/swagger-resource.constants';
import { Public } from '../../auth/shared/decorator/public.decorator';
import { GoogleAuthGuard } from './google-auth.guard';
import { GoogleAuthService } from './google-auth.service';

@ApiTags(swaggerResources.GoogleAuth)
@Controller('google-auth')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Public()
  @Get()
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Request() req) {}

  @Public()
  @Get('google-redirect')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Request() req, @Res() res) {
    return this.googleAuthService.googleLogin(req, res);
  }
}
