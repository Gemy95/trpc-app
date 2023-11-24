import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Permissions, Public } from '../common/decorators';
import onboardingPermissions from '../common/permissions/onboarding.permissions';
import { PermissionsGuard } from '../common/guards/permission.guard';
import {
  CreateOnBoardingDto,
  QueryBoardingDto,
  RemoveBoardingStepsDto,
  UpdateOnBoardingDto,
} from './dtos/onboarding.dto';
import { OnBoardingService } from './onboarding.service';

@Resolver('/')
export class OnboardingResolver {
  // adding constructor to resolver and injecting service
  constructor(private readonly onboardingService: OnBoardingService) {}

  @Public()
  @Query('boarding')
  async get(@Args('for_type') queryBoardingDto: QueryBoardingDto) {
    return this.onboardingService.get(queryBoardingDto);
  }

  @Mutation('createOnBoarding')
  @Permissions(onboardingPermissions.ALL_PERMISSION.value, onboardingPermissions.CREATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  async create(@Args('data') data: CreateOnBoardingDto) {
    return this.onboardingService.create(data);
  }

  @Mutation('updateOnBoarding')
  @Permissions(onboardingPermissions.ALL_PERMISSION.value, onboardingPermissions.UPDATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  async update(@Args('_id') _id: string, @Args('data') data: UpdateOnBoardingDto) {
    return this.onboardingService.update(_id, data);
  }

  @Mutation('removeOnBoarding')
  @Permissions(onboardingPermissions.ALL_PERMISSION.value, onboardingPermissions.DELETE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  async remove(@Args('_id') _id: string, @Args('removeSteps') data?: RemoveBoardingStepsDto) {
    return this.onboardingService.remove(_id, data);
  }
}
