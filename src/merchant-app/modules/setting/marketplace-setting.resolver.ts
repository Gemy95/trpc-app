import { MarketplaceSettingService } from './marketplace-setting.service';
import { Public } from '../common/decorators';
import { Args, Query, Resolver } from '@nestjs/graphql';

@Resolver('')
export class MarketplaceSettingResolver {
  constructor(private readonly marketplaceSettingService: MarketplaceSettingService) {}

  @Public()
  @Query('marketplaceDistanceGetOneByModelName')
  async getOneByModelName(@Args('modelName') modelName: string) {
    const data = await this.marketplaceSettingService.getOneByModelName(modelName);
    return data;
  }
}
