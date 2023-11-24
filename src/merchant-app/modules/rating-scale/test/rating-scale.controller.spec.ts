import { Test, TestingModule } from '@nestjs/testing';
import { GetAllDto } from '../../common/dto/get-all.dto';
import { CreateRatingScaleDto } from '../dto/create-rating-scale.dto';
import { UpdateRatingScaleDto } from '../dto/update-rating-scale.dto';
import { RatingScaleController } from '../rating-scale.controller';
import { RatingScaleService } from '../rating-scale.service';
import { createStub, findAllStub, findOneStub, updateStub } from '../test/stubs/rating-scale.stub';

jest.mock('../rating-scale.service.ts');

describe('RatingScaleController', () => {
  let ratingScaleController: RatingScaleController;
  let ratingScaleService: RatingScaleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RatingScaleController],
      providers: [RatingScaleService],
    }).compile();

    ratingScaleController = module.get<RatingScaleController>(RatingScaleController);
    ratingScaleService = module.get<RatingScaleService>(RatingScaleService);
    jest.clearAllMocks();
  });

  describe('Create', () => {
    describe('Once Create is called', () => {
      let createRatingScaleDto: CreateRatingScaleDto;
      let ratingScale;

      beforeEach(async () => {
        ratingScale = await ratingScaleController.create(createRatingScaleDto);
      });

      it('Should call ratingScaleService', () => {
        expect(ratingScaleService.create).toHaveBeenCalledWith(createRatingScaleDto);
      });

      it('Should return created ratingScale', () => {
        expect(ratingScale).toEqual(createStub());
      });
    });
  });

  describe('findAll', () => {
    describe('Once findAll is called', () => {
      let ratingScale;
      let params: GetAllDto;

      beforeEach(async () => {
        ratingScale = await ratingScaleController.findAll(params);
      });

      it('Should call ratingScaleService', () => {
        expect(ratingScaleService.findAll).toBeCalledWith(params);
      });

      it('Should return ratingScale details', () => {
        expect(ratingScale).toEqual(findAllStub());
      });
    });
  });

  describe('findOne', () => {
    describe('Once findOne is called', () => {
      let ratingScale;

      beforeEach(async () => {
        ratingScale = await ratingScaleController.findOne('123');
      });

      it('Should call ratingScaleService', () => {
        expect(ratingScaleService.findOne).toBeCalledWith('123');
      });

      it('Should return ratingScale details', () => {
        expect(ratingScale).toEqual(findOneStub());
      });
    });
  });

  describe('update', () => {
    describe('Once update is called', () => {
      let ratingScale;
      let updateRatingScaleDto: UpdateRatingScaleDto;

      beforeEach(async () => {
        ratingScale = await ratingScaleController.update('123', updateRatingScaleDto);
      });

      it('Should call ratingScaleService', () => {
        expect(ratingScaleService.update).toBeCalledWith('123', updateRatingScaleDto);
      });

      it('Should return ratingScale details', () => {
        expect(ratingScale).toEqual(updateStub());
      });
    });
  });
});

// sudo nx test --test-file rating-scale.controller.spec.ts
