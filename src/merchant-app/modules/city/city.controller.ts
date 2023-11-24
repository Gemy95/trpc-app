import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CityDto } from './dto/city.dto';
import { CityService } from './city.service';
import { CityQueryDto } from './dto/cityQuery.dto';
import { Public } from '../common/decorators';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { AvailabilityQueryDto } from './dto/check-availability-query.dto';
import generateFilters from '../common/utils/generate-filters';
import CityPermissions from '../common/permissions/city.permissions';
import { Permissions } from '../common/decorators';
import { PermissionsGuard } from '../common/guards/permission.guard';
@Controller()
@ApiTags(swaggerResources.City)
@ApiBearerAuth()
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post('countries/:countryId/cities')
  @Permissions(CityPermissions.ALL_PERMISSION.value, CityPermissions.CREATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @ApiResponse({ description: 'Application', status: 201 })
  create(@Param('countryId') countryId: string, @Body() createDto: CityDto) {
    createDto.country = countryId;
    return this.cityService.create(createDto);
  }

  @Public()
  @Get('cities')
  @ApiResponse({ description: 'Application', status: 200 })
  all(@Query() query: CityQueryDto) {
    return this.cityService.getAll(query);
  }

  @Public()
  @Get('cities/check-availability')
  @ApiResponse({ description: 'Application', status: 200 })
  checkAvailability(@Query() query: AvailabilityQueryDto) {
    return this.cityService.shoppexAvailability(query);
  }

  @Public()
  @Get('countries/:countryId/cities')
  @ApiResponse({ description: 'Application', status: 200 })
  allByCountry(@Param('countryId') countryId: string, @Query() params: CityQueryDto) {
    return this.cityService.getAllByCountryId(countryId, params);
  }

  @Public()
  @Get('countries/:countryId/cities/:id')
  @ApiResponse({ description: 'Application', status: 200 })
  getOne(@Param('countryId') countryId: string, @Param('id') id: string) {
    return this.cityService.getOne(countryId, id);
  }

  @Put('countries/:countryId/cities/:id')
  @Permissions(CityPermissions.ALL_PERMISSION.value, CityPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @ApiResponse({ description: 'Application', status: 200 })
  update(@Param('countryId') countryId: string, @Param('id') id: string, @Body() countryDto: Partial<CityDto>) {
    return this.cityService.updateOne(countryId, id, countryDto);
  }

  @Delete('countries/:countryId/cities/:id')
  @Permissions(CityPermissions.ALL_PERMISSION.value, CityPermissions.DELETE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  @ApiResponse({ description: 'Application', status: 200 })
  deleteOne(@Param('countryId') countryId: string, @Param('id') id: string) {
    return this.cityService.deleteOne(countryId, id);
  }
}
