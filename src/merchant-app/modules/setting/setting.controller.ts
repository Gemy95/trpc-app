import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { CreateVerificationTypeSettingDto } from './dtos/create-verification-type-setting.dto';
import { UpdateDistanceDto } from './dtos/update-distance.dto';
import { SettingService } from './setting.service';
import { CreateBranchDistanceSettingDto } from './dtos/create-branch-distance-setting.dto';

@ApiTags(swaggerResources.Setting)
@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @ApiBearerAuth()
  @Post('distance')
  @ApiResponse({
    description: 'This for create setting',
    status: 201,
  })
  createDistance(@Body() createDistanceDto: CreateBranchDistanceSettingDto) {
    return this.settingService.createBranchDistanceSetting(createDistanceDto);
  }

  @ApiBearerAuth()
  @Post('verification-type')
  @ApiResponse({
    description: 'This for create setting',
    status: 201,
  })
  createVerificationType(@Body() createVerificationTypeDto: CreateVerificationTypeSettingDto) {
    return this.settingService.createVerificationTypeSetting(createVerificationTypeDto);
  }

  @ApiBearerAuth()
  @Patch('update')
  @ApiResponse({
    description: 'This for update setting',
    status: 201,
  })
  update(@Body() updateDistanceDto: UpdateDistanceDto) {
    return this.settingService.update(updateDistanceDto);
  }

  @Delete(':id')
  @ApiResponse({ description: 'Application', status: 203 })
  deleteOne(@Param('id') id: string) {
    return this.settingService.deleteOne(id);
  }
}
