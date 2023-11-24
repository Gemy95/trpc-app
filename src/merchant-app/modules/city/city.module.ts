import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CityController } from './city.controller';
import { CityService } from './city.service';
import { City, CitySchema, CityRepository } from '../models';
import { CountryModule } from '../country/country.module';
import { CityResolver } from './city.resolver';

@Module({
  imports: [MongooseModule.forFeature([{ name: City.name, schema: CitySchema }]), CountryModule],
  controllers: [CityController],
  providers: [CityService, CityRepository, CityResolver],
  exports: [CityService],
})
export class CityModule {}
