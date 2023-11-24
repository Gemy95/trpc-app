import { Injectable } from '@nestjs/common';

import { TrpcService } from '../../trpc/trpc.service';
import { MarketPlaceTagService } from './marketplace-tag.service';
import { GetAllClientTagDto } from './zod/get-all-client-tag.dto';

@Injectable()
export class MarketPlaceTagRouter {
  constructor(
    private readonly marketPlaceTagService: MarketPlaceTagService,
    private readonly trpcService: TrpcService,
  ) {}

  getAllTags = this.trpcService.publicProcedure.input(GetAllClientTagDto).query((opts) => {
    let { ctx, input } = opts;
    const parsedInput = GetAllClientTagDto.parse(input);
    let { categoriesIds, ...inputRest } = parsedInput;
    return this.marketPlaceTagService.getAll(inputRest, categoriesIds);
  });

  routers = this.trpcService.router({
    getAllTags: this.getAllTags,
  });
}
