import { TestingModule, Test } from '@nestjs/testing';
import { SettingController } from '../setting.controller';
import { SettingService } from '../setting.service';
import { UpdateDistanceDto } from '../dtos/update-distance.dto';
import { createStub, deleteOneStub, distanceStub, updateStub } from './stubs/setting.stub';
import { CreateBranchDistanceSettingDto } from '../dtos/create-branch-distance-setting.dto';

jest.mock('../setting.service.ts');

describe('SettingController', () => {
  let settingController: SettingController;
  let settingService: SettingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettingController],
      providers: [SettingService],
    }).compile();

    settingController = module.get<SettingController>(SettingController);
    settingService = module.get<SettingService>(SettingService);
    jest.clearAllMocks();
  });

  describe('Create', () => {
    describe('Once Create is called', () => {
      let createDistanceDto: CreateBranchDistanceSettingDto;
      let setting;

      beforeEach(async () => {
        setting = await settingController.createDistance(createDistanceDto);
      });

      it('Should call settingService', () => {
        expect(settingService.createBranchDistanceSetting).toHaveBeenCalledWith(createDistanceDto);
      });

      it('Should return created setting', () => {
        expect(setting).toEqual(createStub());
      });
    });
  });

  describe('update', () => {
    describe('Once update is called', () => {
      let setting;
      let updateDistanceDto: UpdateDistanceDto;

      beforeEach(async () => {
        setting = await settingController.update(updateDistanceDto);
      });

      it('Should call settingService', () => {
        expect(settingService.update).toBeCalledWith(updateDistanceDto);
      });

      it('Should return setting details', () => {
        expect(setting).toEqual(updateStub());
      });
    });
  });

  describe('deleteOne', () => {
    describe('Once delete One is called', () => {
      let setting;

      beforeEach(async () => {
        setting = await settingController.deleteOne(distanceStub()._id);
      });

      it('Should call settingService', () => {
        expect(settingService.deleteOne).toBeCalledWith(distanceStub()._id);
      });

      it('Should return setting details', () => {
        expect(setting).toEqual(deleteOneStub());
      });
    });
  });
});
// sudo npm run test -- setting.controller.spec.ts
