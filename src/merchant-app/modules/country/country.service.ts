import { Injectable, NotFoundException } from '@nestjs/common';

import { ERROR_CODES } from '../../../libs/utils/src';
import generateFilters from '../common/utils/generate-filters';
import { CountryDocument, CountryRepository } from '../models';
import { CountryDto } from './dto/country.dto';
import { CountryQueryDto } from './dto/countryQuery.dto';

@Injectable()
export class CountryService {
  constructor(private readonly countryRepository: CountryRepository) {}

  async create(creteDto: CountryDto): Promise<CountryDocument> {
    return this.countryRepository.create(creteDto);
  }

  getAll(params: CountryQueryDto) {
    const { limit, page, paginate, sort, search, ...rest } = params;
    const generatedMatch = generateFilters(rest);
    const generatedSearch = generateFilters({ search });

    return this.countryRepository.getAll(
      { ...generatedMatch, ...generatedSearch },
      { limit, page, paginate, sort, lean: true },
    );
  }

  async getOne(id: string) {
    const country = await this.countryRepository.getById(id, {});

    if (!country) {
      throw new NotFoundException(ERROR_CODES.err_country_not_found);
    }

    return country;
  }

  async updateOne(id: string, updateDto: CountryDto) {
    const country = await this.countryRepository.getById(id, {});
    if (!country) {
      throw new NotFoundException(ERROR_CODES.err_country_not_found);
    }
    return this.countryRepository.updateById(id, updateDto, { lean: true, new: true }, {});
  }

  async deleteOne(id: string) {
    const country = await this.countryRepository.getById(id, {});
    if (!country) {
      throw new NotFoundException(ERROR_CODES.err_country_not_found);
    }
    await this.countryRepository.deleteById(id);
    return { message: 'Country Deleted Successfully' };
  }
}
