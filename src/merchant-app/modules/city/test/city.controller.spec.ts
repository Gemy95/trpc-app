import { Test, TestingModule } from '@nestjs/testing';
import { CityController } from '../city.controller';
import { CityService } from '../city.service';
import { AvailabilityQueryDto } from '../dto/check-availability-query.dto';
import { CityDto } from '../dto/city.dto';
import { CityQueryDto } from '../dto/cityQuery.dto';
import {
  allByCountryIdStub,
  allStub,
  checkAvailabilityStub,
  cityStub,
  createStub,
  deleteOneStub,
  getOneStub,
  updateOneStub,
} from './stubs/city.stub';

jest.mock('../city.service.ts');

describe('CityController', () => {
  let cityController: CityController;
  let cityService: CityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CityController],
      providers: [CityService],
    }).compile();

    cityController = module.get<CityController>(CityController);
    cityService = module.get<CityService>(CityService);
    jest.clearAllMocks();
  });

  describe('Create', () => {
    describe('Once Create is called', () => {
      let createCityDto: any;
      let city;

      beforeEach(async () => {
        createCityDto = {
          name: cityStub().name,
          country: cityStub().country,
          client_status: cityStub().client_status,
          stores_status: cityStub().stores_status,
          translation: cityStub().translation,
          longitudeDelta: cityStub().longitudeDelta,
          latitudeDelta: cityStub().latitudeDelta,
        };
        city = await cityController.create(cityStub().country, createCityDto);
      });

      it('Should call cityService', () => {
        expect(cityService.create).toHaveBeenCalledWith(createCityDto);
      });

      it('Should return created city', () => {
        expect(city).toEqual(createStub());
      });
    });
  });

  describe('all', () => {
    describe('Once get all is called', () => {
      let cities;
      let query: CityQueryDto;
      beforeEach(async () => {
        cities = await cityController.all(query);
      });

      it('Should call cityService', () => {
        expect(cityService.getAll).toBeCalledWith(query);
      });

      it('Should return city details', () => {
        expect(cities).toEqual(allStub());
      });
    });
  });

  describe('checkAvailability', () => {
    describe('Once check Availability is called', () => {
      let city;
      let query: AvailabilityQueryDto;
      beforeEach(async () => {
        city = await cityController.checkAvailability(query);
      });

      it('Should call cityService', () => {
        expect(cityService.shoppexAvailability).toBeCalledWith(query);
      });

      it('Should return city details', () => {
        expect(city).toEqual(checkAvailabilityStub());
      });
    });
  });

  describe('allByCountry', () => {
    describe('Once all By Country Id is called', () => {
      let cities;
      let params: CityQueryDto;
      beforeEach(async () => {
        cities = await cityController.allByCountry(cityStub().country, params);
      });

      it('Should call cityService', () => {
        expect(cityService.getAllByCountryId).toBeCalledWith(cityStub().country, params);
      });

      it('Should return city details', () => {
        expect(cities).toEqual(allByCountryIdStub());
      });
    });
  });

  describe('getOne', () => {
    describe('Once get One is called', () => {
      let city;

      beforeEach(async () => {
        city = await cityController.getOne(cityStub().country, cityStub()._id);
      });

      it('Should call cityService', () => {
        expect(cityService.getOne).toBeCalledWith(cityStub().country, cityStub()._id);
      });

      it('Should return city details', () => {
        expect(city).toEqual(getOneStub());
      });
    });
  });

  describe('updateOne', () => {
    describe('Once update One is called', () => {
      let city;
      let updateDto: any;

      beforeEach(async () => {
        updateDto = {
          name: cityStub().name,
          country: cityStub().country,
          client_status: cityStub().client_status,
          stores_status: cityStub().stores_status,
          translation: cityStub().translation,
          longitudeDelta: cityStub().longitudeDelta,
          latitudeDelta: cityStub().latitudeDelta,
        };
        city = await cityController.update(cityStub().country, cityStub()._id, updateDto);
      });

      it('Should call cityService', () => {
        expect(cityService.updateOne).toBeCalledWith(cityStub().country, cityStub()._id, updateDto);
      });

      it('Should return city details', () => {
        expect(city).toEqual(updateOneStub());
      });
    });
  });

  describe('deleteOne', () => {
    describe('Once delete One is called', () => {
      let city;

      beforeEach(async () => {
        city = await cityController.deleteOne(cityStub().country, cityStub()._id);
      });

      it('Should call cityService', () => {
        expect(cityService.deleteOne).toBeCalledWith(cityStub().country, cityStub()._id);
      });

      it('Should return city details', () => {
        expect(city).toEqual(deleteOneStub());
      });
    });
  });
});
// sudo npm run test -- city.controller.spec.ts
