import { Injectable, NotFoundException } from '@nestjs/common';

import { ERROR_CODES } from '../../../libs/utils/src';
import generateFilters from '../common/utils/generate-filters';
import { CityDocument, CityRepository, CountryRepository } from '../models';
import { AvailabilityQueryDto } from './dto/check-availability-query.dto';
import { CityDto, UpdateCityDto } from './dto/city.dto';
import { CityQueryDto } from './dto/cityQuery.dto';

@Injectable()
export class CityService {
  constructor(private readonly cityRepository: CityRepository, private readonly countryRepository: CountryRepository) {}

  async create(createCityDto: CityDto): Promise<CityDocument> {
    const country = await this.countryRepository.getById(createCityDto.country, {});
    if (!country) {
      throw new NotFoundException(ERROR_CODES.err_country_not_found);
    }

    const data = {
      ...createCityDto,
      locationDelta: [createCityDto.longitudeDelta, createCityDto.latitudeDelta],
      location: {
        type: 'Point',
        coordinates: [createCityDto.longitude, createCityDto.latitude],
      },
    };

    const createdCity = await (await this.cityRepository.create(data)).populate('country');
    return createdCity;
  }

  getAllByCountryId(countryId: string, params: CityQueryDto) {
    const { limit, page, paginate, sort } = params;
    const query = { country: countryId };
    if (params.search) {
      query['search'] = {
        $in: params.search.split(' ').map((s) => new RegExp(s, 'i')),
      };
    }

    return this.cityRepository.getAll(query, { limit, page, paginate, sort });
  }

  async getAll(query: CityQueryDto) {
    const { limit, page, paginate, sort, search, ...rest } = query;
    const generatedMatch = generateFilters(rest);
    const generatedSearch = generateFilters({ search });

    if (generatedMatch['countries']) {
      delete Object.assign(generatedMatch, {
        'country._id': generatedMatch['countries'],
      })['countries'];
    }

    if (generatedMatch['client_status']) {
      Object.assign(generatedMatch, {
        client_status: generatedMatch['client_status'],
      });
    }

    if (generatedMatch['stores_status']) {
      Object.assign(generatedMatch, {
        stores_status: generatedMatch['stores_status'],
      });
    }

    return this.cityRepository.aggregate(
      [
        {
          $lookup: {
            from: 'countries',
            localField: 'country',
            foreignField: '_id',
            as: 'country',
          },
        },
        {
          $unwind: '$country',
        },
        {
          $match: { ...generatedMatch, ...generatedSearch },
        },
      ],
      { limit, page, paginate, sort },
    );
  }

  async getOne(countryId: string, id: string) {
    // TODO:: populated country
    const city = await (await this.cityRepository.getOne({ _id: id, country: countryId }, {})).populate('country');
    if (!city) {
      throw new NotFoundException(ERROR_CODES.err_city_not_found);
    }
    return city;
  }

  async updateOne(_countryId: string, id: string, updateDto: UpdateCityDto) {
    const city = await this.cityRepository.getOne({ _id: id }, {});
    if (!city) {
      throw new NotFoundException(ERROR_CODES.err_city_not_found);
    }

    return this.cityRepository.updateById(id, updateDto, { new: true }, {});
  }

  async deleteOne(countryId: string, id: string) {
    try {
      const city = await this.cityRepository.getOne({ _id: id, country: countryId }, {});
      if (!city) {
        throw new NotFoundException(ERROR_CODES.err_city_not_found);
      }
      const result = await this.cityRepository.deleteById(id);
      return { result, message: 'success', success: true };
    } catch (error) {
      return { message: error, success: false };
    }
  }

  public async shoppexAvailability(query: AvailabilityQueryDto) {
    const { longitude, latitude, maxDistance } = query;
    const isCityAvailable = await this.cityRepository._model.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [longitude, latitude] },
          distanceField: 'dist.calculated',
          maxDistance: maxDistance ?? 20000,
          query: {
            client_status: 'active',
          },
          includeLocs: 'dist.location',
          spherical: true,
        },
      },
      {
        $lookup: {
          from: 'branches',
          localField: '_id',
          foreignField: 'cityId',
          as: 'branches',
        },
      },
    ]);
    if (isCityAvailable.length <= 0) return { available: false };
    return { available: true };
  }
}
