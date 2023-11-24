import { Injectable } from '@nestjs/common';

import { TrpcService } from '../../trpc/trpc.service';
import { ClientService } from './client.service';
import { RequestChangeEmailClientDto } from './dto/request-change-email.dto';
import { RequestChangeEmailClientVerifyDto } from './dto/request-change-verify.dto';

@Injectable()
export class ClientChangeEmailRouter {
  constructor(private readonly trpcService: TrpcService, private readonly clientService: ClientService) {}

  requestChangeEmail = this.trpcService.publicProcedure.input(RequestChangeEmailClientDto).mutation(({ input }) => {
    let user = {};
    return this.clientService.requestChangeEmail(input.RequestChangeEmailClientDto, user);
  });

  requestChangeEmailVerify = this.trpcService.publicProcedure
    .input(RequestChangeEmailClientVerifyDto)
    .mutation(({ input }) => {
      let user = {};
      return this.clientService.requestChangeEmailVerify(input.RequestChangeEmailClientVerifyDto, user);
    });

  ClientChangeEmailRouters = this.trpcService.router({
    requestChangeEmail: this.requestChangeEmail,
    requestChangeEmailVerify: this.requestChangeEmailVerify,
  });
}
