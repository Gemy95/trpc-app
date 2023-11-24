import { Module } from '@nestjs/common';
import { CountryController } from './country.controller';
import { CountryService } from './country.service';
import { Country, CountrySchema, CountryRepository } from '../models';
import { MongooseModule } from '@nestjs/mongoose';
import { CountryResolver } from './country.resolver';

@Module({
  imports: [MongooseModule.forFeature([{ name: Country.name, schema: CountrySchema }])],
  controllers: [CountryController],
  providers: [CountryService, CountryRepository, CountryResolver],
  exports: [CountryService, CountryRepository],
})
export class CountryModule {}
