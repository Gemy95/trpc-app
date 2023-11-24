import { Test, TestingModule } from '@nestjs/testing';
import { GetAllDto } from '../../common/dto/get-all.dto';
import { CreateMerchantEmployeeDto } from '../dto/create-merchant-employee.dto';
import { RequestChangeEmailMerchantEmployeeDto } from '../dto/request-change-email-merchant-employee';
import { RequestChangeMobileMerchantEmployeeDto } from '../dto/request-change-mobile-merchant-employee';
import { UpdateMerchantEmployeeByItselfDto } from '../dto/update-merchant-employee-by-itself';
import { UpdateMerchantEmployeeDto } from '../dto/update-merchant-employee.dto';
import { VerifyChangeEmailMerchantEmployeeDto } from '../dto/verify-change-email-merchant-employee';
import { VerifyChangeMobileMerchantEmployeeDto } from '../dto/verify-change-mobile-merchant-employee';
import { MerchantEmployeeController } from '../merchant-employee.controller';
import { MerchantEmployeeService } from '../merchant-employee.service';
import {
  createStub,
  findOneStub,
  getMerchantEmployeesByMerchantIdStub,
  merchantEmployeeStub,
  removeStub,
  requestChangeEmailStub,
  requestChangeMobileStub,
  updateMerchantEmployeesByItselfStub,
  updateStub,
  verifyChangeEmailStub,
  verifyChangeMobileStub,
} from '../test/stubs/merchant-employee.stub';

jest.mock('../merchant-employee.service.ts');

describe('MerchantEmployeeController', () => {
  let merchantEmployeeController: MerchantEmployeeController;
  let merchantEmployeeService: MerchantEmployeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MerchantEmployeeController],
      providers: [MerchantEmployeeService],
    }).compile();

    merchantEmployeeController = module.get<MerchantEmployeeController>(MerchantEmployeeController);
    merchantEmployeeService = module.get<MerchantEmployeeService>(MerchantEmployeeService);
    jest.clearAllMocks();
  });

  describe('Create', () => {
    describe('Once Create is called', () => {
      let createMerchantEmployeeDto: CreateMerchantEmployeeDto;
      let merchantEmployee;

      beforeEach(async () => {
        merchantEmployee = await merchantEmployeeController.create({}, createMerchantEmployeeDto);
      });

      it('Should call merchantEmployeeService', () => {
        expect(merchantEmployeeService.create).toHaveBeenCalledWith({}, createMerchantEmployeeDto);
      });

      it('Should return created merchantEmployee', () => {
        expect(merchantEmployee).toEqual(createStub());
      });
    });
  });

  describe('getMerchantEmployeesByMerchantId', () => {
    describe('Once getMerchantEmployeesByMerchantId is called', () => {
      let merchantEmployee;
      let params: GetAllDto;

      beforeEach(async () => {
        merchantEmployee = await merchantEmployeeController.getMerchantEmployeesByMerchantId(
          merchantEmployeeStub()._id,
          params,
        );
      });

      it('Should call merchantEmployeeService', () => {
        expect(merchantEmployeeService.getMerchantEmployeesByMerchantId).toBeCalledWith(
          merchantEmployeeStub()._id,
          params,
        );
      });

      it('Should return merchantEmployee details', () => {
        expect(merchantEmployee).toEqual(getMerchantEmployeesByMerchantIdStub());
      });
    });
  });

  describe('findOne', () => {
    describe('Once findOne is called', () => {
      let merchantEmployee;

      beforeEach(async () => {
        merchantEmployee = await merchantEmployeeController.findOne(merchantEmployeeStub()._id);
      });

      it('Should call merchantEmployeeService', () => {
        expect(merchantEmployeeService.findOne).toBeCalledWith(merchantEmployeeStub()._id);
      });

      it('Should return merchantEmployee details', () => {
        expect(merchantEmployee).toEqual(findOneStub());
      });
    });
  });

  describe('update', () => {
    describe('Once update is called', () => {
      let merchantEmployee;
      let updateMerchantEmployeeDto: UpdateMerchantEmployeeDto;

      beforeEach(async () => {
        merchantEmployee = await merchantEmployeeController.update(
          merchantEmployeeStub()._id,
          updateMerchantEmployeeDto,
        );
      });

      it('Should call merchantEmployeeService', () => {
        expect(merchantEmployeeService.update).toBeCalledWith(merchantEmployeeStub()._id, updateMerchantEmployeeDto);
      });

      it('Should return merchantEmployee details', () => {
        expect(merchantEmployee).toEqual(updateStub());
      });
    });
  });

  describe('remove', () => {
    describe('Once remove is called', () => {
      let merchantEmployee;

      beforeEach(async () => {
        merchantEmployee = await merchantEmployeeController.remove(merchantEmployeeStub()._id);
      });

      it('Should call merchantEmployeeService', () => {
        expect(merchantEmployeeService.remove).toBeCalledWith(merchantEmployeeStub()._id);
      });

      it('Should return merchantEmployee details', () => {
        expect(merchantEmployee).toEqual(removeStub());
      });
    });
  });

  describe('updateMerchantEmployeeByItself', () => {
    describe('Once updateMerchantEmployeeByItself is called', () => {
      let merchantEmployee;
      let updateMerchantEmployeeByItselfDto: UpdateMerchantEmployeeByItselfDto;

      beforeEach(async () => {
        merchantEmployee = await merchantEmployeeController.updateMerchantEmployeesByItself(
          {},
          updateMerchantEmployeeByItselfDto,
        );
      });

      it('Should call merchantEmployeeService', () => {
        expect(merchantEmployeeService.updateMerchantEmployeeByItself).toBeCalledWith(
          {},
          updateMerchantEmployeeByItselfDto,
        );
      });

      it('Should return merchantEmployee details', () => {
        expect(merchantEmployee).toEqual(updateMerchantEmployeesByItselfStub());
      });
    });
  });

  describe('requestChangeEmail', () => {
    describe('Once requestChangeEmail is called', () => {
      let merchantEmployee;
      let requestChangeEmailMerchantEmployeeDto: RequestChangeEmailMerchantEmployeeDto;

      beforeEach(async () => {
        merchantEmployee = await merchantEmployeeController.requestChangeEmail(
          requestChangeEmailMerchantEmployeeDto,
          {},
        );
      });

      it('Should call merchantEmployeeService', () => {
        expect(merchantEmployeeService.requestChangeEmail).toBeCalledWith(requestChangeEmailMerchantEmployeeDto, {});
      });

      it('Should return merchantEmployee details', () => {
        expect(merchantEmployee).toEqual(requestChangeEmailStub());
      });
    });
  });

  describe('verifyChangeEmail', () => {
    describe('Once verifyChangeEmail is called', () => {
      let merchantEmployee;
      let verifyChangeEmailMerchantEmployeeDto: VerifyChangeEmailMerchantEmployeeDto;

      beforeEach(async () => {
        merchantEmployee = await merchantEmployeeController.verifyChangeEmail(verifyChangeEmailMerchantEmployeeDto, {});
      });

      it('Should call merchantEmployeeService', () => {
        expect(merchantEmployeeService.verifyChangeEmail).toBeCalledWith(verifyChangeEmailMerchantEmployeeDto, {});
      });

      it('Should return merchantEmployee details', () => {
        expect(merchantEmployee).toEqual(verifyChangeEmailStub());
      });
    });
  });

  describe('requestChangeMobile', () => {
    describe('Once requestChangeMobile is called', () => {
      let merchantEmployee;
      let requestChangeMobileMerchantEmployeeDto: RequestChangeMobileMerchantEmployeeDto;

      beforeEach(async () => {
        merchantEmployee = await merchantEmployeeController.requestChangeMobile(
          requestChangeMobileMerchantEmployeeDto,
          {},
        );
      });

      it('Should call merchantEmployeeService', () => {
        expect(merchantEmployeeService.requestChangeMobile).toBeCalledWith(requestChangeMobileMerchantEmployeeDto, {});
      });

      it('Should return merchantEmployee details', () => {
        expect(merchantEmployee).toEqual(requestChangeMobileStub());
      });
    });
  });

  describe('verifyChangeMobile', () => {
    describe('Once verifyChangeMobile is called', () => {
      let merchantEmployee;
      let verifyChangeMobileMerchantEmployeeDto: VerifyChangeMobileMerchantEmployeeDto;

      beforeEach(async () => {
        merchantEmployee = await merchantEmployeeController.verifyChangeMobile(
          verifyChangeMobileMerchantEmployeeDto,
          {},
        );
      });

      it('Should call merchantEmployeeService', () => {
        expect(merchantEmployeeService.verifyChangeMobile).toBeCalledWith(verifyChangeMobileMerchantEmployeeDto, {});
      });

      it('Should return merchantEmployee details', () => {
        expect(merchantEmployee).toEqual(verifyChangeMobileStub());
      });
    });
  });
});

// sudo nx test --test-file merchant-employee.controller.spec.ts
