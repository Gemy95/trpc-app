import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Public } from '../common/decorators';
import countryPermissions from '../common/permissions/country.permissions';
import { CountryService } from './country.service';
import { CountryDto } from './input/country.dto';
import { CountryQueryDto } from './input/countryQuery.dto';
import { Permissions } from '../common/decorators';
import { PermissionsGuard } from '../common/guards/permission.guard';

@Resolver('/')
export class CountryResolver {
  constructor(private readonly countryService: CountryService) {}

  @Permissions(countryPermissions.ALL_PERMISSION.value, countryPermissions.CREATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Mutation('createCountry')
  create(@Args('country') createDto: CountryDto) {
    return this.countryService.create(createDto);
  }

  @Public()
  @Query('countries')
  findAll(@Args() params: CountryQueryDto) {
    return this.countryService.getAll(params);
  }

  @Public()
  @Query('country')
  getOne(@Args('id') id: string) {
    return this.countryService.getOne(id);
  }

  @Permissions(countryPermissions.ALL_PERMISSION.value, countryPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Mutation('updateCountry')
  update(@Args('id') id: string, @Args('country') countryDto: CountryDto) {
    return this.countryService.updateOne(id, countryDto);
  }

  @Permissions(countryPermissions.ALL_PERMISSION.value, countryPermissions.DELETE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Mutation('deleteCountry')
  deleteOne(@Args('id') id: string) {
    return this.countryService.deleteOne(id);
  }
}
