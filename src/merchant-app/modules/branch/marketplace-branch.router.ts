import { Injectable } from '@nestjs/common';

import { TrpcService } from '../../trpc/trpc.service';
import { MarketplaceBranchService } from './marketplace-branch.service';
import { GetAllNearByDto } from './zod/get-all-nearby-with-filters.dto';
import { GetAllNearestDto } from './zod/get-all-nearest-with-filter.dto';
import { MerchantBranchesDto } from './zod/merchant-branches-query.dto';

@Injectable()
export class MarketplaceBranchRouter {
  constructor(
    private readonly marketPlaceBranchService: MarketplaceBranchService,
    private readonly trpcService: TrpcService,
  ) {}

  findAllBranches = this.trpcService.publicProcedure.input(MerchantBranchesDto).query((opts) => {
    const { merchantId, ...input } = opts;
    return this.marketPlaceBranchService.findAll(merchantId, input);
  });

  getNearestBranches = this.trpcService.publicProcedure.input(GetAllNearestDto).query((opts) => {
    const { input } = opts;
    return this.marketPlaceBranchService.getNearestBranches(input);
  });

  getNearByBranches = this.trpcService.publicProcedure.input(GetAllNearByDto).query((opts) => {
    const { filters, ...input } = opts;
    return this.marketPlaceBranchService.getNearByBranches(input, filters);
  });
}
