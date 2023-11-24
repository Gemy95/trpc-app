import { Test, TestingModule } from '@nestjs/testing';
import { ChangePasswordOwnerDto } from '../dto/change-password-owner';
import { BodyConfirmOwnerDto, ParamsConfirmOwnerDto } from '../dto/confirm-owner';
import { CreateOwnerDto } from '../dto/create-owner.dto';
import { LoginOwnerDto } from '../dto/login-owner';
import { RequestChangeEmailOwnerDto } from '../dto/request-change-email-owner';
import { RequestChangeMobileOwnerDto } from '../dto/request-change-mobile-owner';
import { RequestForgetPasswordOwnerDto } from '../dto/request-forget-password-owner';
import { UpdateOwnerByItselfDto } from '../dto/update-owner-by-itself';
import { VerifyChangeEmailOwnerDto } from '../dto/verify-change-email-owner';
import { VerifyChangeMobileOwnerDto } from '../dto/verify-change-mobile-owner';
import { VerifyForgetPasswordOwnerDto } from '../dto/verify-forget-password-owner';
import { VerifyMobileOwnerDto } from '../dto/verify-mobile-owner';
import { OwnerController } from '../owner.controller';
import { OwnerService } from '../owner.service';
import {
  changePasswordStub,
  createOwnerStub,
  findOwnerOrMerchantEmployeeByIdStub,
  getOwnerByIdStub,
  loginStub,
  ownerStub,
  requestChangeEmailStub,
  requestChangeMobileStub,
  requestForgetPasswordStub,
  updateOwnerByItselfStub,
  verifyChangeEmailStub,
  verifyChangeMobileStub,
  verifyEmailStub,
  verifyForgetPasswordStub,
  verifyMobileStub,
} from './stubs/owner.stub';

jest.mock('../owner.service.ts');

describe('OwnerController', () => {
  let ownerController: OwnerController;
  let ownerService: OwnerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OwnerController],
      providers: [OwnerService],
    }).compile();

    ownerController = module.get<OwnerController>(OwnerController);
    ownerService = module.get<OwnerService>(OwnerService);
    jest.clearAllMocks();
  });

  describe('Create', () => {
    describe('Once Create is called', () => {
      let createOwnerDto: CreateOwnerDto;
      let owner;

      beforeEach(async () => {
        createOwnerDto = {
          name: ownerStub().name,
          cityId: ownerStub().cityId,
          countryCode: ownerStub().countryCode,
          countryId: ownerStub().countryId,
          dateOfBirth: ownerStub().dateOfBirth,
          email: ownerStub().email,
          mobile: ownerStub().mobile,
          password: ownerStub().password,
          uuid: ownerStub().uuid,
        };
        owner = await ownerController.create(createOwnerDto);
      });

      it('Should call ownerService', () => {
        expect(ownerService.create).toHaveBeenCalledWith(createOwnerDto);
      });

      it('Should return created owner', () => {
        expect(owner).toEqual(createOwnerStub());
      });
    });
  });

  describe('verifyMobile', () => {
    describe('Once verifyMobile is called', () => {
      let owner;
      let verifyMobileDto: VerifyMobileOwnerDto;

      beforeEach(async () => {
        verifyMobileDto = {
          otp: '123456',
          mobile: '01066778800',
          countryCode: '+20',
        };
        owner = await ownerController.verifyMobile(verifyMobileDto);
      });

      it('Should call ownerService', () => {
        expect(ownerService.verifyMobile).toBeCalledWith(verifyMobileDto);
      });

      it('Should return owner details', () => {
        expect(owner).toEqual(verifyMobileStub());
      });
    });
  });

  describe('verifyEmail', () => {
    describe('Once verifyEmail is called', () => {
      let confirmOwnerDto: BodyConfirmOwnerDto & ParamsConfirmOwnerDto;
      let owner;

      beforeEach(async () => {
        confirmOwnerDto = {
          email: ownerStub().email,
          otp: '12345',
        };
        owner = await ownerController.verifyEmail({ otp: confirmOwnerDto.otp }, { email: confirmOwnerDto.email });
      });

      it('Should call ownerService', () => {
        expect(ownerService.verifyEmail).toBeCalledWith(confirmOwnerDto);
      });

      it('Should return owner details', () => {
        expect(owner).toEqual(verifyEmailStub());
      });
    });
  });

  describe('login', () => {
    describe('Once login is called', () => {
      let loginDto: LoginOwnerDto;
      let owner;

      beforeEach(async () => {
        loginDto = {
          countryCode: '+02',
          mobile: '01017431767',
          password: 'Asd12345$',
        };
        owner = await ownerController.login(loginDto);
      });

      it('Should call ownerService', () => {
        expect(ownerService.login).toBeCalledWith(loginDto);
      });

      it('Should return owner login details', () => {
        expect(owner).toEqual(loginStub());
      });
    });
  });

  describe('request-forget-password', () => {
    describe('Once request forget password is called', () => {
      let requestForgetPasswordOwnerDto: RequestForgetPasswordOwnerDto;
      let owner;

      beforeEach(async () => {
        requestForgetPasswordOwnerDto = {
          email: 'ali.gamal95880@gmail.com',
        };
        owner = await ownerController.requestForgetPassword(requestForgetPasswordOwnerDto);
      });

      it('Should call ownerService', () => {
        expect(ownerService.requestForgetPassword).toBeCalledWith(requestForgetPasswordOwnerDto);
      });

      it('Should return request forget owner password', () => {
        expect(owner).toEqual(requestForgetPasswordStub());
      });
    });
  });

  describe('verify-forget-password', () => {
    describe('Once verify forget password is called', () => {
      let verifyForgetPasswordOwnerDto: VerifyForgetPasswordOwnerDto;
      let owner;

      beforeEach(async () => {
        verifyForgetPasswordOwnerDto = {
          email: 'ali.gamal95880@gmail.com',
          otp: '12345',
        };
        owner = await ownerController.verifyForgetPassword(verifyForgetPasswordOwnerDto);
      });

      it('Should call ownerService', () => {
        expect(ownerService.verifyForgetPassword).toBeCalledWith(verifyForgetPasswordOwnerDto);
      });

      it('Should return verify forget owner password', () => {
        expect(owner).toEqual(verifyForgetPasswordStub());
      });
    });
  });

  describe('change-password', () => {
    describe('Once change password is called', () => {
      let changePasswordOwnerDto: ChangePasswordOwnerDto;
      let owner;

      beforeEach(async () => {
        changePasswordOwnerDto = {
          email: 'ali.gamal95880@gmail.com',
          otp: '12345',
          password: 'Asd12345$',
        };
        owner = await ownerController.changePassword(changePasswordOwnerDto);
      });

      it('Should call ownerService', () => {
        expect(ownerService.changePassword).toBeCalledWith(changePasswordOwnerDto);
      });

      it('Should return change owner password', () => {
        expect(owner).toEqual(changePasswordStub());
      });
    });
  });

  describe('getOwnerById', () => {
    describe('Once get owner by id is called', () => {
      let owner;

      beforeEach(async () => {
        owner = await ownerController.findOne('62e4355e60d7424bfe733133');
      });

      it('Should call ownerService', () => {
        expect(ownerService.getOwnerById).toBeCalledWith('62e4355e60d7424bfe733133');
      });

      it('Should return owner details by id', () => {
        expect(owner).toEqual(getOwnerByIdStub());
      });
    });
  });

  describe('updateOwnerByItself', () => {
    describe('Once update owner by itself is called', () => {
      let updateOwnerByItselfDto: UpdateOwnerByItselfDto;
      let owner;

      beforeEach(async () => {
        owner = await ownerController.updateOwnerByItself(updateOwnerByItselfDto, ownerStub);
      });

      it('Should call ownerService', () => {
        expect(ownerService.updateOwnerByItself).toBeCalledWith(updateOwnerByItselfDto, ownerStub);
      });

      it('Should return updated owner details', () => {
        expect(owner).toEqual(updateOwnerByItselfStub());
      });
    });
  });

  describe('request-change-email', () => {
    describe('Once request change email is called', () => {
      let requestChangeEmailOwnerDto: RequestChangeEmailOwnerDto;
      let owner;

      beforeEach(async () => {
        requestChangeEmailOwnerDto = {
          email: 'ali.gamal95880@gmail.com',
        };
        owner = await ownerController.requestChangeEmail(requestChangeEmailOwnerDto, ownerStub);
      });

      it('Should call ownerService', () => {
        expect(ownerService.requestChangeEmail).toBeCalledWith(requestChangeEmailOwnerDto, ownerStub);
      });

      it('Should return request change email owner', () => {
        expect(owner).toEqual(requestChangeEmailStub());
      });
    });
  });

  describe('verify-change-email', () => {
    describe('Once verify change email is called', () => {
      let verifyChangeEmailOwnerDto: VerifyChangeEmailOwnerDto;
      let owner;

      beforeEach(async () => {
        verifyChangeEmailOwnerDto = {
          email: 'ali.gamal95880@gmail.com',
          otp: '12345',
        };
        owner = await ownerController.verifyChangeEmail(verifyChangeEmailOwnerDto, ownerStub);
      });

      it('Should call ownerService', () => {
        expect(ownerService.verifyChangeEmail).toBeCalledWith(verifyChangeEmailOwnerDto, ownerStub);
      });

      it('Should return verify change email owner', () => {
        expect(owner).toEqual(verifyChangeEmailStub());
      });
    });
  });

  describe('request-change-mobile', () => {
    describe('Once request change email is called', () => {
      let requestChangeMobileOwnerDto: RequestChangeMobileOwnerDto;
      let owner;

      beforeEach(async () => {
        requestChangeMobileOwnerDto = {
          countryCode: '+02',
          mobile: '01017431767',
        };
        owner = await ownerController.requestChangeMobile(requestChangeMobileOwnerDto, ownerStub);
      });

      it('Should call ownerService', () => {
        expect(ownerService.requestChangeMobile).toBeCalledWith(requestChangeMobileOwnerDto, ownerStub);
      });

      it('Should return request change mobile owner', () => {
        expect(owner).toEqual(requestChangeMobileStub());
      });
    });
  });

  describe('verify-change-mobile', () => {
    describe('Once verify change mobile is called', () => {
      let verifyChangeMobileOwnerDto: VerifyChangeMobileOwnerDto;
      let owner;

      beforeEach(async () => {
        verifyChangeMobileOwnerDto = {
          countryCode: '+02',
          mobile: '01017431767',
          otp: '12345',
        };
        owner = await ownerController.verifyChangeMobile(verifyChangeMobileOwnerDto, ownerStub);
      });

      it('Should call ownerService', () => {
        expect(ownerService.verifyChangeMobile).toBeCalledWith(verifyChangeMobileOwnerDto, ownerStub);
      });

      it('Should return verify change mobile owner', () => {
        expect(owner).toEqual(verifyChangeMobileStub());
      });
    });
  });

  describe('findOwnerOrMerchantEmployeeById', () => {
    describe('Once find owner or merchant employee by id is called', () => {
      let owner;

      beforeEach(async () => {
        owner = await ownerController.findOwnerOrMerchantEmployeeById('62e93523386fe3abd31baf3b');
      });

      it('Should call ownerService', () => {
        expect(ownerService.findOwnerOrMerchantEmployeeById).toBeCalledWith('62e93523386fe3abd31baf3b');
      });

      it('Should return owner or merchant employee by id details', () => {
        expect(owner).toEqual(findOwnerOrMerchantEmployeeByIdStub());
      });
    });
  });
});
// sudo npm run test -- owner.controller.spec.ts
