import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ClientService } from './client.service';
import { RequestChangeEmailClientDto } from './dto/request-change-email.dto';
import { RequestChangeEmailClientVerifyDto } from './dto/request-change-verify.dto';

@Controller('auth/clients')
@ApiTags(swaggerResources.Client)
export class ChangeEmailController {
  constructor(private readonly clientService: ClientService) {}

  @ApiBearerAuth()
  @Post('/change-email/request')
  requestChangeEmail(@Body() requestChangeEmail: RequestChangeEmailClientDto, @CurrentUser() user: any) {
    return this.clientService.requestChangeEmail(requestChangeEmail, user);
  }

  @ApiBearerAuth()
  @Post('/change-email/verify')
  @ApiResponse({
    description: 'verify change email',
    status: 200,
  })
  verifyEmail(
    @Body()
    requestChangeEmailClientVerifyDto: RequestChangeEmailClientVerifyDto,
    @CurrentUser() user: any,
  ) {
    return this.clientService.requestChangeEmailVerify(requestChangeEmailClientVerifyDto, user);
  }
}
