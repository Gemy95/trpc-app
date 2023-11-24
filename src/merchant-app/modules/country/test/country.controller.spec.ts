import { Test, TestingModule } from '@nestjs/testing';
import { CountryController } from '../country.controller';
import { CountryService } from '../country.service';
import { CountryDto } from '../dto/country.dto';
import { CountryQueryDto } from '../dto/countryQuery.dto';
import { createStub, deleteOneStub, getOneStub, updateOneStub } from './stubs/country.stub';
import { countryStub, getAllStub } from './stubs/country.stub';

jest.mock('../country.service.ts');

describe('CountryController', () => {
  let countryController: CountryController;
  let countryService: CountryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountryController],
      providers: [CountryService],
    }).compile();

    countryController = module.get<CountryController>(CountryController);
    countryService = module.get<CountryService>(CountryService);
    jest.clearAllMocks();
  });

  describe('Create', () => {
    describe('Once Create is called', () => {
      let createCountryDto: CountryDto;
      let country;

      beforeEach(async () => {
        country = await countryController.create(createCountryDto);
      });

      it('Should call countryService', () => {
        expect(countryService.create).toHaveBeenCalledWith(createCountryDto);
      });

      it('Should return created country', () => {
        expect(country).toEqual(createStub());
      });
    });
  });

  describe('getAll', () => {
    describe('Once get all is called', () => {
      let countries;
      let query: CountryQueryDto;
      beforeEach(async () => {
        countries = await countryController.all(query);
      });

      it('Should call countryService', () => {
        expect(countryService.getAll).toBeCalledWith(query);
      });

      it('Should return country details', () => {
        expect(countries).toEqual(getAllStub());
      });
    });
  });

  describe('getOne', () => {
    describe('Once get One is called', () => {
      let country;

      beforeEach(async () => {
        country = await countryController.getOne(countryStub()._id);
      });

      it('Should call countryService', () => {
        expect(countryService.getOne).toBeCalledWith(countryStub()._id);
      });

      it('Should return country details', () => {
        expect(country).toEqual(getOneStub());
      });
    });
  });

  describe('updateOne', () => {
    describe('Once update One is called', () => {
      let country;
      let updateDto: CountryDto;

      beforeEach(async () => {
        country = await countryController.update(countryStub()._id, updateDto);
      });

      it('Should call countryService', () => {
        expect(countryService.updateOne).toBeCalledWith(countryStub()._id, updateDto);
      });

      it('Should return country details', () => {
        expect(country).toEqual(updateOneStub());
      });
    });
  });

  describe('deleteOne', () => {
    describe('Once delete One is called', () => {
      let country;

      beforeEach(async () => {
        country = await countryController.deleteOne(countryStub()._id);
      });

      it('Should call countryService', () => {
        expect(countryService.deleteOne).toBeCalledWith(countryStub()._id);
      });

      it('Should return country details', () => {
        expect(country).toEqual(deleteOneStub());
      });
    });
  });
});
// sudo npm run test -- country.controller.spec.ts
