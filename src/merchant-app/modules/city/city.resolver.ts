import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Public } from '../common/decorators';
import { CityService } from './city.service';
import { Permissions } from '../common/decorators';
import { UseGuards } from '@nestjs/common';
import { CityQueryDto } from './input/cityQuery.dto';
import { CityDto, UpdateCityDto } from './input/city.dto';
import { PermissionsGuard } from '../common/guards/permission.guard';
import CityPermissions from '../common/permissions/city.permissions';

@Resolver('')
export class CityResolver {
  constructor(private readonly cityService: CityService) {}
  @Public()
  @Query('cities')
  findAll(@Args('params') params: CityQueryDto) {
    return this.cityService.getAll(params);
  }

  @Public()
  @Query('city')
  findOne(@Args('countryId') countryId: string, @Args('cityId') cityId: string) {
    return this.cityService.getOne(countryId, cityId);
  }

  @Permissions(CityPermissions.ALL_PERMISSION.value, CityPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Mutation('createCity')
  create(@Args('city') cityDto: CityDto) {
    return this.cityService.create(cityDto);
  }

  @Permissions(CityPermissions.ALL_PERMISSION.value, CityPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Mutation('updateCity')
  update(@Args('countryId') countryId: string, @Args('cityId') cityId: string, @Args('city') cityDto: UpdateCityDto) {
    return this.cityService.updateOne(countryId, cityId, cityDto);
  }

  @Permissions(CityPermissions.ALL_PERMISSION.value, CityPermissions.DELETE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @Mutation('removeCity')
  deleteOne(@Args('countryId') countryId: string, @Args('cityId') cityId: string) {
    return this.cityService.deleteOne(countryId, cityId);
  }
}
