import { Test, TestingModule } from '@nestjs/testing';
import { CreateRatingDto } from '../dto/create-rating.dto';
import { DashboardRatingQuery } from '../dto/dashboard-rating-query.dto';
import { RatingController } from '../rating.controller';
import { RatingService } from '../rating.service';
import {
  booleanStub,
  dashboardRatingStub,
  getLatestOrderStub,
  ratingsStubValue,
  ratingStub,
} from './stubs/rating.stub';

jest.mock('../rating.service.ts');

describe('RatingController', () => {
  let ratingController: RatingController;
  let ratingService: RatingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RatingController],
      providers: [RatingService],
    }).compile();

    ratingController = module.get<RatingController>(RatingController);
    ratingService = module.get<RatingService>(RatingService);
    jest.clearAllMocks();
  });

  describe('getLatestOrder', () => {
    describe('Once getLatestOrder is called', () => {
      let response: { success: boolean; rated?: boolean };

      beforeEach(async () => {
        response = await ratingController.getLatestOrder(ratingStub().client);
      });

      it('Should call ratingService', () => {
        expect(ratingService.getLatestOrder).toBeCalledWith(ratingStub().client);
      });

      it('Should return boolean', () => {
        expect(response).toEqual(getLatestOrderStub());
      });
    });
  });

  describe('dashboardRating', () => {
    describe('Once dashboardRating is called', () => {
      let rating;
      let query: DashboardRatingQuery;

      beforeEach(async () => {
        rating = await ratingController.dashboardRating(ratingStub().merchant, query);
      });

      it('Should call ratingService', () => {
        expect(ratingService.dashboardRating).toBeCalledWith(ratingStub().merchant, query);
      });

      it('Should return ratings', () => {
        expect(rating).toEqual(dashboardRatingStub());
      });
    });
  });

  describe('getBranchOrdersRating', () => {
    describe('Once getBranchOrdersRating is called', () => {
      let rating;

      beforeEach(async () => {
        rating = await ratingController.getBranchOrdersRating(ratingStub().branch);
      });

      it('Should call ratingService', () => {
        expect(ratingService.getBranchOrdersRating).toBeCalledWith(ratingStub().branch);
      });

      it('Should return ratings', () => {
        expect(rating).toEqual(ratingsStubValue());
      });
    });
  });

  describe('hideComment', () => {
    describe('Once hideComment is called', () => {
      let response: { success: boolean };

      beforeEach(async () => {
        response = await ratingController.hideComment(ratingStub().client, ratingStub().merchant, ratingStub()._id, {
          is_public: true,
        });
      });

      it('Should call ratingService', () => {
        expect(ratingService.hideComment).toBeCalledWith(ratingStub().client, ratingStub().merchant, ratingStub()._id, {
          is_public: true,
        });
      });

      it('Should return boolean', () => {
        expect(response).toEqual(booleanStub());
      });
    });
  });

  describe('rateOrder', () => {
    describe('Once rateOrder is called', () => {
      let createRatingDto: CreateRatingDto;
      let rating;

      beforeEach(async () => {
        createRatingDto = {
          rating: ratingStub().rating,
          extraNote: ratingStub().extraNote,
          comment: ratingStub().comment,
        };
        rating = await ratingController.rateOrder(ratingStub().client, ratingStub().order, createRatingDto);
      });

      it('Should call ratingService', () => {
        expect(ratingService.rateOrder).toHaveBeenCalledWith(ratingStub().client, ratingStub().order, createRatingDto);
      });

      it('Should return success boolean', () => {
        expect(rating).toEqual(booleanStub());
      });
    });
  });
});
