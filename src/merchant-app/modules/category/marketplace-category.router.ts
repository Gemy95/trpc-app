import { Injectable } from '@nestjs/common';

import { TrpcService } from '../../trpc/trpc.service';
import { MarketPlaceCategoryService } from './marketplace-category.service';
import { GetAllClientCategoryDto } from './zod/get-all-client-category.dto';

@Injectable()
export class MarketPlaceCategoryRouter {
  constructor(
    private readonly marketPlaceCategoryService: MarketPlaceCategoryService,
    private readonly trpcService: TrpcService,
  ) {}

  getAllCategory = this.trpcService.publicProcedure.input(GetAllClientCategoryDto).query((opts) => {
    let { ctx, input } = opts;
    const parsedInput = GetAllClientCategoryDto.parse(input);
    return this.marketPlaceCategoryService.getAll(parsedInput);
  });

  routers = this.trpcService.router({
    getAllCategory: this.getAllCategory,
  });
}
