import { Injectable } from '@nestjs/common';

import { TrpcService } from '../../trpc/trpc.service';
import { ClientMenuService } from './client-menu.service';
import { MenuQueryDto } from './zod/menu-query.dto';

@Injectable()
export class ClientMenuRouter {
  constructor(private readonly clientMenuService: ClientMenuService, private readonly trpcService: TrpcService) {}

  getMenuByBranchId = this.trpcService.publicProcedure.input(MenuQueryDto).query((opts) => {
    let { ctx, input } = opts;
    const parsedInput = MenuQueryDto.parse(input);
    const { merchantId, params } = parsedInput;
    return this.clientMenuService.marketplaceMenu(merchantId, params, null);
  });

  routers = this.trpcService.router({
    getMenuByBranchId: this.getMenuByBranchId,
  });
}
