import { Injectable } from '@nestjs/common';

import { TrpcService } from '../../trpc/trpc.service';
import { MarketplaceProductService } from './marketplace.product.service';
import { MarketplaceGetAllProductDto } from './zod/marketplace-get-all-product.dto';

@Injectable()
export class MarketplaceProductRouter {
  constructor(private readonly productService: MarketplaceProductService, private readonly trpcService: TrpcService) {}

  findOneProduct = this.trpcService.protectedProcedure.input(String).query((opts) => {
    let { ctx, input } = opts;
    return this.productService.findOne(input, ctx.user);
  });

  findAllProducts = this.trpcService.protectedProcedure.input(MarketplaceGetAllProductDto).query((opts) => {
    let { ctx, input } = opts;
    const parsedInput = MarketplaceGetAllProductDto.parse(input);
    return this.productService.findAll(parsedInput);
  });

  routers = this.trpcService.router({
    findOneProduct: this.findOneProduct,
    findAllProducts: this.findAllProducts,
  });
}
