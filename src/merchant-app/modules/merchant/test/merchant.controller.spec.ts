import { Test, TestingModule } from '@nestjs/testing';
import { ONLINE_STATUS, VISIBILITY_STATUS } from '../../common/constants/merchant';
import { Merchant } from '../../models';
import { CreateMerchantDto } from '../dto/create-merchant.dto';
import { MerchantQueryDto } from '../dto/merchant-query.dto';
import { FindMerchantStatisticsDto } from '../dto/merchant-statistics.dto';
import { OnlineOrOfflineMerchantDto } from '../dto/online-or-offline.dto';
import { UpdateMerchantStatusByMerchantEmployeeOrOwnerDto } from '../dto/update-merchant-status-by-merchant-employee-or-owner.dto';
import { MerchantController } from '../merchant.controller';
import { MerchantService } from '../merchant.service';
import { createMerchantStub, merchantFindAllSub, merchantStub } from './stubs/merchant.stub';

jest.mock('../merchant.service.ts');

describe('MerchantController', () => {
  let merchantController: MerchantController;
  let merchantService: MerchantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MerchantController],
      providers: [MerchantService],
    }).compile();

    merchantController = module.get<MerchantController>(MerchantController);
    merchantService = module.get<MerchantService>(MerchantService);
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    describe('Once findOne is called', () => {
      let merchant: Merchant;

      beforeEach(async () => {
        merchant = await merchantController.findOne(merchantStub()._id);
      });

      it('Should call merchantService', () => {
        expect(merchantService.findOne).toBeCalledWith(merchantStub()._id);
      });

      it('Should return merchant', () => {
        expect(merchant).toEqual(merchantStub());
      });
    });
  });

  describe('findAll', () => {
    describe('Once findAll is called', () => {
      let query: MerchantQueryDto;
      let merchants;

      beforeEach(async () => {
        merchants = await merchantController.findAll(query);
      });

      it('Should call merchantService', () => {
        expect(merchantService.findAll).toBeCalledWith(query);
      });

      it('Should return merchant', () => {
        expect(merchants).toEqual(merchantFindAllSub());
      });
    });
  });

  describe('getMerchantDetailsById', () => {
    describe('Once getMerchantDetailsById is called', () => {
      let merchant;

      beforeEach(async () => {
        merchant = await merchantController.getMerchantDetailsById(merchantStub()._id);
      });

      it('Should call merchantService', () => {
        expect(merchantService.getMerchantDetailsById).toBeCalledWith(merchantStub()._id);
      });

      it('Should return merchant details', () => {
        expect(merchant).toEqual(merchantStub());
      });
    });
  });

  describe('getOwnerMerchantAccount', () => {
    describe('Once getOwnerMerchantAccount is called', () => {
      let merchant;

      beforeEach(async () => {
        merchant = await merchantController.getOwnerMerchantAccount(merchantStub().ownerId);
      });

      it('Should call merchantService', () => {
        expect(merchantService.getOwnerMerchantAccount).toBeCalledWith(merchantStub().ownerId);
      });

      it('Should return merchant details', () => {
        expect(merchant).toEqual(merchantStub());
      });
    });
  });

  describe('getMerchantStatisticsById', () => {
    describe('Once getMerchantStatisticsById is called', () => {
      let merchant;
      let findMerchantStatisticsDto: FindMerchantStatisticsDto;

      beforeEach(async () => {
        merchant = await merchantController.getMerchantsById(merchantStub()._id, findMerchantStatisticsDto);
      });

      it('Should call merchantService', () => {
        expect(merchantService.getMerchantStatisticsById).toBeCalledWith(merchantStub()._id, findMerchantStatisticsDto);
      });

      it('Should return merchant details', () => {
        expect(merchant).toEqual(merchantStub());
      });
    });
  });

  describe('Create', () => {
    describe('Once Create is called', () => {
      let createMerchantDto: CreateMerchantDto;
      let merchant;

      beforeEach(async () => {
        createMerchantDto = {
          nameArabic: merchantStub().name,
          nameEnglish: merchantStub().translation[0].name,
          commercialRegistrationNumber: merchantStub().commercialRegistrationNumber,
          commercialName: merchantStub().commercialName,
          categoriesIds: merchantStub().categoriesIds,
          tagsIds: merchantStub().tagsIds,
          cityId: merchantStub().cityId,
        };
        merchant = await merchantController.create(createMerchantDto, merchantStub().ownerId);
      });

      it('Should call merchantService', () => {
        expect(merchantService.create).toHaveBeenCalledWith(createMerchantDto, merchantStub().ownerId);
      });

      it('Should return created merchant', () => {
        expect(merchant).toEqual(createMerchantStub());
      });
    });
  });

  describe('onlineOffline', () => {
    describe('Once onlineOffline is called', () => {
      let onlineOrOfflineDto: OnlineOrOfflineMerchantDto;
      let merchant;

      beforeEach(async () => {
        onlineOrOfflineDto = {
          status: ONLINE_STATUS,
          merchantId: merchantStub()._id,
        };

        merchant = await merchantController.onlineOrOffline(merchantStub()._id, onlineOrOfflineDto);
      });

      it('Should call merchantService', () => {
        expect(merchantService.onlineOffline).toHaveBeenCalledWith(onlineOrOfflineDto);
      });

      it('Should return merchant details', () => {
        expect(merchant).toEqual(merchantStub());
      });
    });
  });

  describe('updateMerchantStatusByOwnerOrMerchantEmployee', () => {
    describe('Once updateMerchantStatusByOwnerOrMerchantEmployee is called', () => {
      let updateDto: UpdateMerchantStatusByMerchantEmployeeOrOwnerDto;
      let merchant;

      beforeEach(async () => {
        updateDto = {
          visibility_status: VISIBILITY_STATUS.ONLINE_STATUS,
        };

        merchant = await merchantController.updateMerchantStatusByOwnerOrMerchantEmployee(
          merchantStub()._id,
          updateDto,
          merchantStub().ownerId,
        );
      });

      it('Should call merchantService', () => {
        expect(merchantService.updateMerchantStatusByOwnerOrMerchantEmployee).toHaveBeenCalledWith(
          merchantStub()._id,
          updateDto,
          merchantStub().ownerId,
        );
      });

      it('Should return merchant details', () => {
        expect(merchant).toEqual(merchantStub());
      });
    });
  });
});
