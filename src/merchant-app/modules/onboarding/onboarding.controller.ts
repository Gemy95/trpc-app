import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public, Permissions } from '../common/decorators';
import {
  CreateOnBoardingDto,
  QueryBoardingDto,
  RemoveBoardingStepsDto,
  UpdateOnBoardingDto,
} from './dtos/onboarding.dto';
import { DeviceTypeEnum } from './enums/device-type.enum';
import { UserTypeEnum } from './enums/user-type.enum';
import { OnBoardingService } from './onboarding.service';
import { PermissionsGuard } from '../common/guards';
import onboardingPermissions from '../common/permissions/onboarding.permissions';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { ForTypeEnum } from '../models';

@Controller('onboarding')
@ApiTags(swaggerResources.OnBoarding)
export class OnBoardingController {
  constructor(private onBoardingService: OnBoardingService) {}

  @Post()
  @ApiBearerAuth()
  @ApiResponse({ description: 'Application', status: 201 })
  @Permissions(onboardingPermissions.ALL_PERMISSION.value, onboardingPermissions.CREATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  async create(@Body() body: CreateOnBoardingDto) {
    return this.onBoardingService.create(body);
  }

  @Public()
  @ApiResponse({ description: 'Application', status: 200 })
  @ApiQuery({ name: 'for_type', enum: ForTypeEnum, required: false })
  @Get('/')
  async get(@Query() queryBoardingDto?: QueryBoardingDto) {
    return this.onBoardingService.get(queryBoardingDto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiResponse({ description: 'Application', status: 203 })
  @Permissions(onboardingPermissions.ALL_PERMISSION.value, onboardingPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  async update(@Param('id') id: string, @Body() body: UpdateOnBoardingDto) {
    return this.onBoardingService.update(id, body);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiResponse({ description: 'Application', status: 204 })
  @Permissions(onboardingPermissions.ALL_PERMISSION.value, onboardingPermissions.DELETE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  async delete(@Param('id') id: string, @Body() data?: RemoveBoardingStepsDto) {
    return this.onBoardingService.remove(id, data);
  }
}
