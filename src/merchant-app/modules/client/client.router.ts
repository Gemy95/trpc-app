import { Injectable } from '@nestjs/common';

import { TrpcService } from '../../trpc/trpc.service';
import { ClientService } from './client.service';
import { ChangePasswordClientDto } from './zod/change-password-client';
import { BodyConfirmClientDto } from './zod/confirm-client';
import { CreateAddressDto } from './zod/create-address.dto';
import { CreateClientDto } from './zod/create-client.dto';
import { LoginClientDto } from './zod/login-client';
import { RequestForgetPasswordClientDto } from './zod/request-forget-password-client';
import { ResendOtpClientDto } from './zod/resend-otp-client.dto';
import { UpdateAddressDto } from './zod/update-address.dto';
import { UpdateClientDto } from './zod/update-client.dto';
import { VerifyChangeMobileClientDto } from './zod/verify-change-mobile.dto';
import { VerifyForgetPasswordClientDto } from './zod/verify-forget-password-client';

@Injectable()
export class ClientRouter {
  constructor(private readonly trpcService: TrpcService, private readonly clientService: ClientService) {}

  createClient = this.trpcService.publicProcedure.input(CreateClientDto).mutation(({ input }) => {
    const parsedInput = CreateClientDto.parse(input);
    return this.clientService.create(parsedInput);
  });

  verifyMobile = this.trpcService.publicProcedure.input(VerifyChangeMobileClientDto).mutation(({ input }) => {
    const parsedInput = VerifyChangeMobileClientDto.parse(input);
    return this.clientService.verifyMobile(parsedInput);
  });

  verifyEmail = this.trpcService.publicProcedure.input(BodyConfirmClientDto).mutation(({ input }) => {
    const parsedInput = BodyConfirmClientDto.parse(input);
    return this.clientService.verifyEmail(parsedInput);
  });

  login = this.trpcService.publicProcedure.input(LoginClientDto).mutation(({ input }) => {
    const parsedInput = LoginClientDto.parse(input);
    return this.clientService.login(parsedInput);
  });

  requestForgetPassword = this.trpcService.publicProcedure
    .input(RequestForgetPasswordClientDto)
    .mutation(({ input }) => {
      const parsedInput = RequestForgetPasswordClientDto.parse(input);
      return this.clientService.requestForgetPassword(parsedInput);
    });

  verifyForgetPassword = this.trpcService.publicProcedure.input(VerifyForgetPasswordClientDto).mutation(({ input }) => {
    const parsedInput = VerifyForgetPasswordClientDto.parse(input);
    return this.clientService.verifyForgetPassword(parsedInput);
  });

  changePassword = this.trpcService.publicProcedure.input(ChangePasswordClientDto).mutation(({ input }) => {
    const parsedInput = ChangePasswordClientDto.parse(input);
    return this.clientService.changePassword(parsedInput);
  });

  updateClient = this.trpcService.publicProcedure.input(UpdateClientDto).mutation((opts) => {
    let { ctx, input } = opts;
    const parsedInput = UpdateClientDto.parse(input);
    return this.clientService.update(parsedInput, ctx.user);
  });

  clientAddAddress = this.trpcService.publicProcedure.input(CreateAddressDto).mutation((opts) => {
    let { ctx, input } = opts;
    const parsedInput = CreateAddressDto.parse(input);
    return this.clientService.addAddress(ctx.user, parsedInput);
  });

  clientListAddresses = this.trpcService.protectedProcedure.query((opts) => {
    let { ctx } = opts;
    return this.clientService.listAddresses(ctx.user);
  });

  clientUpdateAddress = this.trpcService.publicProcedure.input(UpdateAddressDto).mutation((opts) => {
    const { ctx, input } = opts;
    const { addressId, ...data } = input;
    const parsedInput = UpdateAddressDto.parse(data);
    return this.clientService.updateAddress(ctx.user, addressId, parsedInput);
  });

  clientRemoveAddress = this.trpcService.publicProcedure.input(String).mutation((opts) => {
    let { ctx, input } = opts;
    return this.clientService.removeAddress(ctx.user, input);
  });

  resendOtpClient = this.trpcService.publicProcedure.input(ResendOtpClientDto).mutation(({ input }) => {
    const parsedInput = ResendOtpClientDto.parse(input);
    return this.clientService.resendOtpClient(parsedInput);
  });

  routers = this.trpcService.router({
    createClient: this.createClient,
    verifyMobile: this.verifyMobile,
    verifyEmail: this.verifyEmail,
    login: this.login,
    requestForgetPassword: this.requestForgetPassword,
    verifyForgetPassword: this.verifyForgetPassword,
    changePassword: this.changePassword,
    updateClient: this.updateClient,
    clientAddAddress: this.clientAddAddress,
    clientListAddresses: this.clientListAddresses,
    clientUpdateAddress: this.clientUpdateAddress,
    clientRemoveAddress: this.clientRemoveAddress,
    resendOtpClient: this.resendOtpClient,
  });
}
