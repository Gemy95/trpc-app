import { Controller, Get, Request, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

import { swaggerResources } from '../../../../libs/database/src/lib/common/constants/swagger-resource.constants';
import { Public } from '../../auth/shared/decorator/public.decorator';
import { FacebookAuthGuard } from './facebook-auth.guard';
import { FacebookAuthService } from './facebook-auth.service';

@ApiTags(swaggerResources.FacebookAuth)
@Controller('facebook-auth')
export class FacebookAuthController {
  constructor(private readonly facebookAuthService: FacebookAuthService) {}

  @Public()
  @Get()
  // @UseGuards(FacebookAuthGuard)
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth(@Request() req) {}

  @Public()
  @Get('facebook-redirect')
  // @UseGuards(FacebookAuthGuard)
  @UseGuards(AuthGuard('facebook'))
  facebookAuthRedirect(@Request() req, @Res() res) {
    return this.facebookAuthService.facebookLogin(req, res);
  }
}
