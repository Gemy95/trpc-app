import { Injectable } from '@nestjs/common';

import { TrpcService } from '../../trpc/trpc.service';
import { ClientService } from './client.service';
import { RequestChangeMobileVerifyDto } from './dto/request-change-mobile-verify.dto';
import { RequestChangeMobileRequestClientDto } from './dto/request-change-mobile.dto';

@Injectable()
export class ClientChangeEmailRouter {
  constructor(private readonly trpcService: TrpcService, private readonly clientService: ClientService) {}

  requestChangeMobile = this.trpcService.publicProcedure
    .input(RequestChangeMobileRequestClientDto)
    .mutation(({ input }) => {
      let user = {};
      return this.clientService.requestChangeEmail(input, user);
    });

  changeMobileVerify = this.trpcService.publicProcedure.input(RequestChangeMobileVerifyDto).mutation(({ input }) => {
    let user = {};
    return this.clientService.changeMobileVerify(input, user);
  });

  ClientChangeEmailRouters = this.trpcService.router({
    requestChangeMobile: this.requestChangeMobile,
    changeMobileVerify: this.changeMobileVerify,
  });
}
