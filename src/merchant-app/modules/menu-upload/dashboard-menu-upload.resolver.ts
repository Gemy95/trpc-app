import { CurrentUser } from '../auth/shared/decorator/user.graphql.decorator';
import { MenuUploadFilterDto } from './dto/menu-upload-filter.dto';
import { Args, Context, GraphQLExecutionContext, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DashboardMenuUploadService } from './dashboard-menu-upload.service';
import { DashboardUpdateMenuUploadDto } from './dto/dashboard-update-menu-upload.dto';

@Resolver('')
export class DashboardMenuUploadResolver {
  constructor(private readonly dashboardMenuUploadService: DashboardMenuUploadService) {}

  @Query('dashboardFindOneMerchantMenuUpload')
  dashboardFindOneMerchantMenuUpload(@CurrentUser() user: any, @Args('merchantId') merchantId: string) {
    return this.dashboardMenuUploadService.dashboardFindOneMerchantMenuUpload(user, merchantId);
  }

  @Query('dashboardFindAllMerchantsMenuUpload')
  dashboardFindAllMerchantsMenuUpload(@CurrentUser() user: any, @Args('query') query: MenuUploadFilterDto) {
    return this.dashboardMenuUploadService.dashboardFindAllMerchantsMenuUpload(user, query);
  }

  @Mutation('dashboardUpdateMerchantMenuUpload')
  dashboardUpdateMerchantMenuUpload(
    @CurrentUser() user: any,
    @Args('merchantId') merchantId: string,
    @Args('dashboardUpdateMenuUploadDto') dashboardUpdateMenuUploadDto: DashboardUpdateMenuUploadDto,
  ) {
    return this.dashboardMenuUploadService.dashboardUpdateMerchantMenuUpload(
      user,
      merchantId,
      dashboardUpdateMenuUploadDto,
    );
  }
}
