import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ClientService } from './client.service';
import { RequestChangeMobileVerifyDto } from './dto/request-change-mobile-verify.dto';
import { RequestChangeMobileRequestClientDto } from './dto/request-change-mobile.dto';

@Controller('auth/clients')
@ApiTags(swaggerResources.Client)
export class ChangeMobileController {
  constructor(private readonly clientService: ClientService) {}

  @ApiBearerAuth()
  @Post('/change-mobile/request')
  requestChangeMobile(
    @Body()
    requestChangeMobileRequestClientDto: RequestChangeMobileRequestClientDto,
    @CurrentUser() user: any,
  ) {
    return this.clientService.changeMobileRequest(requestChangeMobileRequestClientDto, user);
  }

  @ApiBearerAuth()
  @Post('/change-mobile/verify')
  @ApiResponse({
    description: 'verify change mobile',
    status: 200,
  })
  verifyMobile(
    @Body()
    requestChangeMobileVerifyDto: RequestChangeMobileVerifyDto,
    @CurrentUser() user: any,
  ) {
    return this.clientService.changeMobileVerify(requestChangeMobileVerifyDto, user);
  }
}
