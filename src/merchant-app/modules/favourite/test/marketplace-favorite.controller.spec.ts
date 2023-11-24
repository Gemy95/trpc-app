import { TestingModule, Test } from '@nestjs/testing';
import { CreateFavoriteDto } from '../dtos/create-favorite.dto';
import { FavoriteQueryDto } from '../dtos/get-all-favorite.dto';
import { MarketplaceFavoriteController } from '../marketplace-favorite.controller';
import { MarketplaceFavoriteService } from '../marketplace-favorite.service';
import { clientStub, createStub, deleteOneStub, favoriteStub, findAllStub } from './stubs/marketplace-favourite.stub';

jest.mock('../marketplace-favorite.service.ts');

describe('MarketplaceFavoriteController', () => {
  let marketplaceFavoriteController: MarketplaceFavoriteController;
  let marketplaceFavoriteService: MarketplaceFavoriteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarketplaceFavoriteController],
      providers: [MarketplaceFavoriteService],
    }).compile();

    marketplaceFavoriteController = module.get<MarketplaceFavoriteController>(MarketplaceFavoriteController);
    marketplaceFavoriteService = module.get<MarketplaceFavoriteService>(MarketplaceFavoriteService);
    jest.clearAllMocks();
  });

  describe('Create', () => {
    describe('Once Create is called', () => {
      let createFavoriteDto: CreateFavoriteDto;
      let favorite;

      beforeEach(async () => {
        favorite = await marketplaceFavoriteController.create(clientStub()._id, createFavoriteDto);
      });

      it('Should call marketplaceFavoriteService', () => {
        expect(marketplaceFavoriteService.create).toHaveBeenCalledWith(clientStub()._id, createFavoriteDto);
      });

      it('Should return created favorite', () => {
        expect(favorite).toEqual(createStub());
      });
    });
  });

  describe('findAll', () => {
    describe('Once findAll is called', () => {
      let favorites;
      let query: FavoriteQueryDto;

      beforeEach(async () => {
        favorites = await marketplaceFavoriteController.findAll({}, query);
      });

      it('Should call marketplaceFavoriteService', () => {
        expect(marketplaceFavoriteService.findAll).toBeCalledWith({}, query);
      });

      it('Should return favorite details', () => {
        expect(favorites).toEqual(findAllStub());
      });
    });
  });

  describe('deleteOne', () => {
    describe('Once delete One is called', () => {
      let favorite;

      beforeEach(async () => {
        favorite = await marketplaceFavoriteController.deleteOne({}, favoriteStub().merchantId.toString());
      });

      it('Should call marketplaceFavoriteService', () => {
        expect(marketplaceFavoriteService.deleteOne).toBeCalledWith({}, favoriteStub().merchantId.toString());
      });

      it('Should return favorite details', () => {
        expect(favorite).toEqual(deleteOneStub());
      });
    });
  });
});

// sudo nx test --test-file marketplace-favorite.controller.spec.ts
