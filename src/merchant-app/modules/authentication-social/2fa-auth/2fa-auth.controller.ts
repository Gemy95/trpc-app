import { BadRequestException, Body, Controller, HttpCode, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { swaggerResources } from '../../../../libs/database/src/lib/common/constants/swagger-resource.constants';
import ERROR_CODES from '../../../../libs/utils/src/lib/errors_codes';
import { AccessTokenAuthGuard } from '../../auth/shared/guards/access.token.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TFAService } from './2fa-auth.service';
import { TFADto } from './dto/2fa-auth.dto';

@ApiTags(swaggerResources.TFAAuth)
@Controller('2fa-auth')
export class TFAController {
  constructor(private readonly tFAService: TFAService) {}

  @ApiBearerAuth()
  @Post('generate')
  @UseGuards(AccessTokenAuthGuard)
  async register(@Res() response: Response, @CurrentUser() user: any) {
    const { otpAuthUrl } = await this.tFAService.generateTwoFactorAuthenticationSecret(user);
    return this.tFAService.pipeQrCodeStream(response, otpAuthUrl);
  }

  @ApiBearerAuth()
  @Post('turn-on')
  @HttpCode(200)
  @UseGuards(AccessTokenAuthGuard)
  async turnOnTwoFactorAuthentication(@CurrentUser() user: any, @Body() twoFactorAuthenticationCodeDto: TFADto) {
    const userSecret = await this.tFAService.getUserSecret(user);
    const isCodeValid = this.tFAService.isTwoFactorAuthenticationCodeValid(
      twoFactorAuthenticationCodeDto.code,
      userSecret,
    );
    if (!isCodeValid) {
      throw new BadRequestException(ERROR_CODES.err_wrong_authentication_code);
    }

    await this.tFAService.turnOnUserTwoFactorAuthentication(user);

    const response = await this.tFAService.loginWith2fa(user);

    return response;
  }
}
