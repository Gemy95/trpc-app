import { Test, TestingModule } from '@nestjs/testing';
import { CreateOnBoardingDto, QueryBoardingDto, RemoveBoardingStepsDto } from '../dtos/onboarding.dto';
import { DeviceTypeEnum } from '../enums/device-type.enum';
import { UserTypeEnum } from '../enums/user-type.enum';
import { OnBoardingController } from '../onboarding.controller';
import { OnBoardingService } from '../onboarding.service';
import { createManyStub, deleteStub, getStub, onboardingStub, updateManyStub } from './stub/onboarding.stub';

jest.mock('../onboarding.service.ts');

describe('OnBoardingController', () => {
  let onBoardingController: OnBoardingController;
  let onBoardingService: OnBoardingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OnBoardingController],
      providers: [OnBoardingService],
    }).compile();

    onBoardingController = module.get<OnBoardingController>(OnBoardingController);
    onBoardingService = module.get<OnBoardingService>(OnBoardingService);
    jest.clearAllMocks();
  });

  describe('Create', () => {
    describe('Once Create is called', () => {
      let createOnBoardingDto: CreateOnBoardingDto;
      let onboarding;

      beforeEach(async () => {
        onboarding = await onBoardingController.create(createOnBoardingDto);
      });

      it('Should call onBoardingService', () => {
        expect(onBoardingService.create).toHaveBeenCalledWith(createOnBoardingDto);
      });

      it('Should return created onboarding', () => {
        expect(onboarding).toEqual(createManyStub());
      });
    });
  });

  describe('get', () => {
    describe('Once get is called', () => {
      let onboarding;
      let queryBoardingDto: QueryBoardingDto;

      beforeEach(async () => {
        onboarding = await onBoardingController.get(queryBoardingDto);
      });

      it('Should call onBoardingService', () => {
        expect(onBoardingService.get).toBeCalledWith(queryBoardingDto);
      });

      it('Should return onboarding details', () => {
        expect(onboarding).toEqual(getStub());
      });
    });
  });

  describe('update', () => {
    describe('Once update is called', () => {
      let onboarding;
      let createOnBoardingDto: CreateOnBoardingDto;

      beforeEach(async () => {
        onboarding = await onBoardingController.update('623214d0604b6b2ab12758e5', createOnBoardingDto);
      });

      it('Should call onBoardingService', () => {
        expect(onBoardingService.update).toBeCalledWith('623214d0604b6b2ab12758e5', createOnBoardingDto);
      });

      it('Should return onboarding details', () => {
        expect(onboarding).toEqual(updateManyStub());
      });
    });
  });

  describe('delete', () => {
    describe('Once delete is called', () => {
      let onboarding;
      let removeSteps: RemoveBoardingStepsDto;

      beforeEach(async () => {
        onboarding = await onBoardingController.delete(deleteStub()._id, removeSteps);
      });

      it('Should call onBoardingService', () => {
        expect(onBoardingService.remove).toBeCalledWith(onboardingStub()._id, removeSteps);
      });

      it('Should return onboarding details', () => {
        expect(onboarding).toEqual(deleteStub());
      });
    });
  });
});
// sudo npm run test -- onboarding.controller.spec.ts
