import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { MarketplaceSettingService } from './marketplace-setting.service';
import { Public } from '../common/decorators';

@ApiTags(swaggerResources.MarketplaceDistance)
@Controller('marketplace/distance')
export class MarketplaceSettingController {
  constructor(private readonly marketplaceSettingService: MarketplaceSettingService) {}

  @Public()
  @Get('')
  @ApiQuery({
    name: 'modelName',
    required: true,
  })
  @ApiResponse({ description: 'Fetch distance info for marketplace', status: 200 })
  async getOneByModelName(@Query('modelName') modelName: string) {
    const data = await this.marketplaceSettingService.getOneByModelName(modelName);
    return data;
  }
}
