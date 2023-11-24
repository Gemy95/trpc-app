import { Test } from '@nestjs/testing';
import { ClientController } from '../client.controller';
import { ClientService } from '../client.service';
import { ChangePasswordClientDto } from '../dto/change-password-client';
import { BodyConfirmClientDto, ParamsConfirmClientDto } from '../dto/confirm-client';
import { CreateAddressDto } from '../dto/create-address.dto';
import { CreateClientDto } from '../dto/create-client.dto';
import { LoginClientDto } from '../dto/login-client';
import { RequestForgetPasswordClientDto } from '../dto/request-forget-password-client';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { UpdateClientDto } from '../dto/update-client.dto';
import { VerifyChangeMobileClientDto } from '../dto/verify-change-mobile.dto';
import { VerifyForgetPasswordClientDto } from '../dto/verify-forget-password-client';
import {
  addressStub,
  changePasswordStub,
  clientAddAddressStub,
  clientListAddressesStub,
  clientRemoveAddressStub,
  clientStub,
  clientUpdateAddressStub,
  loginStub,
  requestForgetPasswordStub,
  updateClientStub,
  verifyEmailStub,
  verifyForgetPasswordStub,
  verifyMobileStub,
} from './stubs/client.stub';

jest.mock('../client.service.ts');

describe('ClientController', () => {
  let clientController: ClientController;
  let clientService: ClientService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [ClientService],
    }).compile();

    clientController = moduleRef.get<ClientController>(ClientController);
    clientService = moduleRef.get<ClientService>(ClientService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    describe('Once create is called', () => {
      let createClientDto: CreateClientDto;
      let client;

      beforeEach(async () => {
        client = await clientController.create(createClientDto);
      });

      it('Should call clientService', () => {
        expect(clientService.create).toBeCalledWith(createClientDto);
      });

      it('Should return client', () => {
        expect(client).toEqual(clientStub());
      });
    });
  });

  describe('verifyMobile', () => {
    describe('Once verify Mobile is called', () => {
      let verifyChangeMobileClientDto: VerifyChangeMobileClientDto;
      let client;

      beforeEach(async () => {
        client = await clientController.verifyMobile(verifyChangeMobileClientDto);
      });

      it('Should call clientService', () => {
        expect(clientService.verifyMobile).toBeCalledWith(verifyChangeMobileClientDto);
      });

      it('Should return client', () => {
        expect(client).toEqual(verifyMobileStub());
      });
    });
  });

  describe('verifyEmail', () => {
    describe('Once verifyEmail is called', () => {
      let bodyConfirmClientDto: BodyConfirmClientDto;
      let paramsConfirmClientDto: ParamsConfirmClientDto;
      let client;

      beforeEach(async () => {
        client = await clientController.verifyEmail(bodyConfirmClientDto, paramsConfirmClientDto);
      });

      it('Should call clientService', () => {
        expect(clientService.verifyEmail).toBeCalledWith({ ...bodyConfirmClientDto, ...paramsConfirmClientDto });
      });

      it('Should return client', () => {
        expect(client).toEqual(verifyEmailStub());
      });
    });
  });

  describe('login', () => {
    describe('Once login is called', () => {
      let loginClientDto: LoginClientDto;
      let client;

      beforeEach(async () => {
        client = await clientController.login(loginClientDto);
      });

      it('Should call clientService', () => {
        expect(clientService.login).toBeCalledWith(loginClientDto);
      });

      it('Should return client', () => {
        expect(client).toEqual(loginStub());
      });
    });
  });

  describe('requestForgetPassword', () => {
    describe('Once request Forget Password is called', () => {
      let requestForgetPasswordClientDto: RequestForgetPasswordClientDto;
      let client;

      beforeEach(async () => {
        client = await clientController.requestForgetPassword(requestForgetPasswordClientDto);
      });

      it('Should call clientService', () => {
        expect(clientService.requestForgetPassword).toBeCalledWith(requestForgetPasswordClientDto);
      });

      it('Should return client', () => {
        expect(client).toEqual(requestForgetPasswordStub());
      });
    });
  });

  describe('verifyForgetPassword', () => {
    describe('Once verify Forget Password is called', () => {
      let verifyForgetPasswordClientDto: VerifyForgetPasswordClientDto;
      let client;

      beforeEach(async () => {
        client = await clientController.verifyForgetPassword(verifyForgetPasswordClientDto);
      });

      it('Should call clientService', () => {
        expect(clientService.verifyForgetPassword).toBeCalledWith(verifyForgetPasswordClientDto);
      });

      it('Should return client', () => {
        expect(client).toEqual(verifyForgetPasswordStub());
      });
    });
  });

  describe('changePassword', () => {
    describe('Once change Password is called', () => {
      let changePasswordClientDto: ChangePasswordClientDto;
      let client;

      beforeEach(async () => {
        client = await clientController.changePassword(changePasswordClientDto);
      });

      it('Should call clientService', () => {
        expect(clientService.changePassword).toBeCalledWith(changePasswordClientDto);
      });

      it('Should return client', () => {
        expect(client).toEqual(changePasswordStub());
      });
    });
  });

  describe('updateClient', () => {
    describe('Once Update Client is called', () => {
      let updateClientDto: UpdateClientDto;
      let client;

      beforeEach(async () => {
        client = await clientController.updateClient(clientStub()._id, updateClientDto, clientStub());
      });

      it('Should call clientService', () => {
        expect(clientService.update).toBeCalledWith(updateClientDto, clientStub());
      });

      it('Should return client', () => {
        expect(client).toEqual(updateClientStub());
      });
    });
  });

  describe('addAddress', () => {
    describe('Once add Address is called', () => {
      let createAddressDto: CreateAddressDto;
      let client;

      beforeEach(async () => {
        client = await clientController.clientAddAddress(clientStub(), createAddressDto);
      });

      it('Should call clientService', () => {
        expect(clientService.addAddress).toBeCalledWith(clientStub(), createAddressDto);
      });

      it('Should return client', () => {
        expect(client).toEqual(clientAddAddressStub());
      });
    });
  });

  describe('listAddresses', () => {
    describe('Once list Addresses is called', () => {
      let client;

      beforeEach(async () => {
        client = await clientController.clientListAddresses(clientStub());
      });

      it('Should call clientService', () => {
        expect(clientService.listAddresses).toBeCalledWith(clientStub());
      });

      it('Should return client', () => {
        expect(client).toEqual(clientListAddressesStub());
      });
    });
  });

  describe('updateAddress', () => {
    describe('Once update Address is called', () => {
      let updateAddressDto: UpdateAddressDto;
      let client;

      beforeEach(async () => {
        client = await clientController.clientupdateAddress(clientStub(), addressStub()._id, updateAddressDto);
      });

      it('Should call clientService', () => {
        expect(clientService.updateAddress).toBeCalledWith(clientStub(), addressStub()._id, updateAddressDto);
      });

      it('Should return client', () => {
        expect(client).toEqual(clientUpdateAddressStub());
      });
    });
  });

  describe('removeAddress', () => {
    describe('Once remove Address is called', () => {
      let client;

      beforeEach(async () => {
        client = await clientController.clientRemoveAddress(clientStub(), addressStub()._id);
      });

      it('Should call clientService', () => {
        expect(clientService.removeAddress).toBeCalledWith(clientStub(), addressStub()._id);
      });

      it('Should return client', () => {
        expect(client).toEqual(clientRemoveAddressStub());
      });
    });
  });
});

// sudo nx test --test-file client.controller.spec.ts
