import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { RatingScaleService } from './rating-scale.service';
import { CreateRatingScaleDto } from './dto/create-rating-scale.dto';
import { UpdateRatingScaleDto } from './dto/update-rating-scale.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { GetAllDto } from '../common/dto/get-all.dto';
import { PermissionsGuard } from '../common/guards';
import { Permissions, Public } from '../common/decorators';
import ratingScalePermissions from '../common/permissions/rating-scale.permissions';

@Controller()
@ApiTags(swaggerResources.RatingScale)
export class RatingScaleController {
  constructor(private readonly ratingScaleService: RatingScaleService) {}

  @ApiBearerAuth()
  @UseGuards(PermissionsGuard)
  @Permissions(ratingScalePermissions.ALL_PERMISSION.value, ratingScalePermissions.CREATE_PERMISSION.value)
  @Post('dashboard/rating-scale')
  create(@Body() createRatingScaleDto: CreateRatingScaleDto) {
    return this.ratingScaleService.create(createRatingScaleDto);
  }

  @Public()
  @Get('marketplace/rating-scale')
  findAll(@Query() params: GetAllDto) {
    return this.ratingScaleService.findAll(params);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionsGuard)
  @Permissions(ratingScalePermissions.ALL_PERMISSION.value, ratingScalePermissions.READ_PERMISSION.value)
  @Get('dashboard/rating-scale/:id')
  findOne(@Param('id') id: string) {
    return this.ratingScaleService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(PermissionsGuard)
  @Permissions(ratingScalePermissions.ALL_PERMISSION.value, ratingScalePermissions.UPDATE_PERMISSION.value)
  @Patch('dashboard/rating-scale/:id')
  update(@Param('id') id: string, @Body() updateRatingScaleDto: UpdateRatingScaleDto) {
    return this.ratingScaleService.update(id, updateRatingScaleDto);
  }
}
