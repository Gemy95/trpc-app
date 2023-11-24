import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CountryDto } from './dto/country.dto';
import { CountryService } from './country.service';
import { CountryQueryDto } from './dto/countryQuery.dto';
import { Public, Permissions } from '../common/decorators';
import countryPermissions from '../common/permissions/country.permissions';
import { PermissionsGuard } from '../common/guards';
import { swaggerResources } from '../common/constants/swagger-resource.constants';

@Controller('countries')
@ApiTags(swaggerResources.Country)
@ApiBearerAuth()
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post()
  @ApiResponse({ description: 'Application', status: 201 })
  @Permissions(countryPermissions.ALL_PERMISSION.value, countryPermissions.CREATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  create(@Body() createDto: CountryDto) {
    return this.countryService.create(createDto);
  }

  @Public()
  @Get()
  @ApiResponse({ description: 'Application', status: 200 })
  all(@Query() params: CountryQueryDto) {
    return this.countryService.getAll(params);
  }

  @Public()
  @Get(':id')
  @ApiResponse({ description: 'Application', status: 200 })
  getOne(@Param('id') id: string) {
    return this.countryService.getOne(id);
  }

  @Patch(':id')
  @ApiResponse({ description: 'Application', status: 200 })
  @Permissions(countryPermissions.ALL_PERMISSION.value, countryPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  update(@Param('id') id: string, @Body() countryDto: CountryDto) {
    return this.countryService.updateOne(id, countryDto);
  }

  @Delete(':id')
  @ApiResponse({ description: 'Application', status: 203 })
  @Permissions(countryPermissions.ALL_PERMISSION.value, countryPermissions.DELETE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  deleteOne(@Param('id') id: string) {
    return this.countryService.deleteOne(id);
  }
}
