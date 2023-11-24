import { Test, TestingModule } from '@nestjs/testing';
import { BranchController } from '../branch.controller';
import { BranchService } from '../branch.service';
import {
  createStub,
  branchStub,
  findAllStub,
  findOneStub,
  reApplyStub,
  removeStub,
  freezingStub,
  onlineOrOfflineStub,
  updateByShoppexEmployeeStub,
  updateBranchStatusByOwnerOrMerchantEmployeeStub,
} from '../test/stubs/branch.stub';
import { CreateBranchDto } from '../dto/create-branch.dto';
import { BaseQuery } from '../../common/dto/BaseQuery.dto';
import { ChangeStatusDto } from '../dto/change-status.dto';
import { UpdateBranchStatusByMerchantEmployeeOrOwnerDto } from '../dto/update-branch-status-by-merchant-employee-or-owner.dto';
import { UpdateBranchDto } from '../dto/update-branch.dto';
import { FindAllBranchDto } from '../dto/find-all-filter.dto';
import { UpdateBranchByShoppexEmployeeDto } from '../dto/update-branch-by-shoppex-employee.dto';

jest.mock('../branch.service.ts');

describe('BranchController', () => {
  let branchController: BranchController;
  let branchService: BranchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BranchController],
      providers: [BranchService],
    }).compile();

    branchController = module.get<BranchController>(BranchController);
    branchService = module.get<BranchService>(BranchService);
    jest.clearAllMocks();
  });

  describe('Create', () => {
    describe('Once Create is called', () => {
      let createBranchDto: CreateBranchDto;
      let branch;

      beforeEach(async () => {
        branch = await branchController.create({ _id: 'aaa' }, branchStub().merchantId.toString(), createBranchDto);
      });

      it('Should call branchService', () => {
        expect(branchService.create).toHaveBeenCalledWith(
          { _id: 'aaa' },
          branchStub().merchantId.toString(),
          createBranchDto,
        );
      });

      it('Should return created branch', () => {
        expect(branch).toEqual(createStub());
      });
    });
  });

  describe('findAll', () => {
    describe('Once findAll is called', () => {
      let branches;
      let query: FindAllBranchDto;
      beforeEach(async () => {
        branches = await branchController.findAll({}, branchStub().merchantId.toString(), query);
      });

      it('Should call branchService', () => {
        expect(branchService.findAll).toBeCalledWith(branchStub().merchantId.toString(), query, {});
      });

      it('Should return branch details', () => {
        expect(branches).toEqual(findAllStub());
      });
    });
  });

  describe('findOne', () => {
    describe('Once findOne is called', () => {
      let branch;
      beforeEach(async () => {
        branch = await branchController.findOne(branchStub()._id, branchStub().merchantId.toString());
      });

      it('Should call branchService', () => {
        expect(branchService.getBranchDetails).toBeCalledWith(branchStub()._id, branchStub().merchantId.toString());
      });

      it('Should return branch details', () => {
        expect(branch).toEqual(findOneStub());
      });
    });
  });

  describe('remove', () => {
    describe('Once remove is called', () => {
      let branch;

      beforeEach(async () => {
        branch = await branchController.remove(branchStub()._id, branchStub().merchantId.toString());
      });

      it('Should call branchService', () => {
        expect(branchService.remove).toBeCalledWith(branchStub()._id, branchStub().merchantId.toString());
      });

      it('Should return branch details', () => {
        expect(branch).toEqual(removeStub());
      });
    });
  });

  describe('reApply', () => {
    describe('Once reApply is called', () => {
      let branch;

      beforeEach(async () => {
        branch = await branchController.reApply(branchStub()._id, branchStub().merchantId.toString());
      });

      it('Should call branchService', () => {
        expect(branchService.reApply).toBeCalledWith(branchStub()._id, branchStub().merchantId.toString());
      });

      it('Should return branch details', () => {
        expect(branch).toEqual(reApplyStub());
      });
    });
  });

  describe('freezing', () => {
    describe('Once freezing is called', () => {
      let branch;

      beforeEach(async () => {
        branch = await branchController.freezing(branchStub()._id, branchStub().merchantId.toString());
      });

      it('Should call branchService', () => {
        expect(branchService.freezing).toBeCalledWith(branchStub()._id, branchStub().merchantId.toString());
      });

      it('Should return branch details', () => {
        expect(branch).toEqual(freezingStub());
      });
    });
  });

  describe('onlineOrOffline', () => {
    describe('Once onlineOrOffline is called', () => {
      let branch;
      let changeStatusDto: ChangeStatusDto;

      beforeEach(async () => {
        branch = await branchController.onlineOrOffline(
          branchStub()._id,
          branchStub().merchantId.toString(),
          changeStatusDto,
        );
      });

      it('Should call branchService', () => {
        expect(branchService.onlineOrOffline).toBeCalledWith(
          branchStub().merchantId.toString(),
          branchStub()._id,
          changeStatusDto,
        );
      });

      it('Should return branch details', () => {
        expect(branch).toEqual(onlineOrOfflineStub());
      });
    });
  });

  describe('updateBranchStatusByOwnerOrMerchantEmployee', () => {
    describe('Once updateBranchStatusByOwnerOrMerchantEmployee is called', () => {
      let branch;
      let updateBranchStatusByMerchantEmployeeOrOwnerDto: UpdateBranchStatusByMerchantEmployeeOrOwnerDto;

      beforeEach(async () => {
        branch = await branchController.updateBranchStatusByOwnerOrMerchantEmployee(
          { _id: 'aaa' },
          branchStub().merchantId.toString(),
          branchStub()._id,
          updateBranchStatusByMerchantEmployeeOrOwnerDto,
        );
      });

      it('Should call branchService', () => {
        expect(branchService.updateBranchStatusByOwnerOrMerchantEmployee).toBeCalledWith(
          { _id: 'aaa' },
          branchStub().merchantId.toString(),
          branchStub()._id,
          updateBranchStatusByMerchantEmployeeOrOwnerDto,
        );
      });

      it('Should return branch details', () => {
        expect(branch).toEqual(updateBranchStatusByOwnerOrMerchantEmployeeStub());
      });
    });
  });

  describe('updateByShoppexEmployee', () => {
    describe('Once updateByShoppexEmployee is called', () => {
      let branch;
      let updateBranchDto: UpdateBranchByShoppexEmployeeDto;

      beforeEach(async () => {
        branch = await branchController.updateByShoppexEmployee(branchStub()._id, updateBranchDto);
      });

      it('Should call branchService', () => {
        expect(branchService.updateByShoppexEmployee).toBeCalledWith(branchStub()._id, updateBranchDto);
      });

      it('Should return branch details', () => {
        expect(branch).toEqual(updateByShoppexEmployeeStub());
      });
    });
  });
});

// sudo nx test --test-file branch.controller.spec.ts
