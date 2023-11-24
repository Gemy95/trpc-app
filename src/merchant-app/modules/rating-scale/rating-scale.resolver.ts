import { RatingScaleService } from './rating-scale.service';
import { CreateRatingScaleDto } from './dto/create-rating-scale.dto';
import { UpdateRatingScaleDto } from './dto/update-rating-scale.dto';
import { GetAllDto } from '../common/dto/get-all.dto';
import { PermissionsGuard } from '../common/guards';
import { Permissions, Public } from '../common/decorators';
import ratingScalePermissions from '../common/permissions/rating-scale.permissions';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

@Resolver('')
export class RatingScaleResolver {
  constructor(private readonly ratingScaleService: RatingScaleService) {}

  @UseGuards(PermissionsGuard)
  @Permissions(ratingScalePermissions.ALL_PERMISSION.value, ratingScalePermissions.CREATE_PERMISSION.value)
  @Mutation('dashboardCreateRatingScale')
  create(@Args('createRatingScaleDto') createRatingScaleDto: CreateRatingScaleDto) {
    return this.ratingScaleService.create(createRatingScaleDto);
  }

  @Public()
  @Query('marketplaceFindAllRatingScale')
  findAll(@Args('params') params: GetAllDto) {
    return this.ratingScaleService.findAll(params);
  }

  @UseGuards(PermissionsGuard)
  @Permissions(ratingScalePermissions.ALL_PERMISSION.value, ratingScalePermissions.READ_PERMISSION.value)
  @Query('dashboardFindOneRatingScale')
  findOne(@Args('id') id: string) {
    return this.ratingScaleService.findOne(id);
  }

  @UseGuards(PermissionsGuard)
  @Permissions(ratingScalePermissions.ALL_PERMISSION.value, ratingScalePermissions.UPDATE_PERMISSION.value)
  @Mutation('dashboardUpdateRatingScale')
  update(@Args('id') id: string, @Args('updateRatingScaleDto') updateRatingScaleDto: UpdateRatingScaleDto) {
    return this.ratingScaleService.update(id, updateRatingScaleDto);
  }
}
