import { MarketplaceReservationService } from './marketplace-reservation.service';
import { GetAllDto } from '../common/dto/get-all.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { GetOneReservationDto } from './dto/get-one-reservation.dto';
import { DeleteOneReservationDto } from './dto/delete-one-reservation.dto';
import { CancelOneReservationDto } from './dto/cancel-one-reservation.dto';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/shared/decorator/user.graphql.decorator';
import { SharedReservationService } from './reservation.shared.service';
import { MarketPlaceFindAllReservationDto } from './dto/marketplace-find-all-filter.dto';

@Resolver('')
export class MarketplaceReservationResolver {
  constructor(
    private readonly reservationService: MarketplaceReservationService,
    private sharedReservationService: SharedReservationService,
  ) {}

  @Query('marketplaceAvailableReservationDays')
  availableReservation(@Args('branchId') branchId: string, @CurrentUser() user: any) {
    return this.sharedReservationService.availableReservation(branchId);
  }

  @Mutation('marketplaceCreateReservation')
  createReservation(
    @Args('createReservationDto') createReservationDto: CreateReservationDto,
    @CurrentUser() user: any,
  ) {
    return this.sharedReservationService.create({ ...createReservationDto, clientId: user._id }, user);
  }

  @Query('marketplaceFindAllReservation')
  findAllReservation(@Args('query') query: MarketPlaceFindAllReservationDto, @CurrentUser() user: any) {
    return this.reservationService.findAllReservation(query, user);
  }

  @Query('marketplaceFindOneReservation')
  findOneReservation(@Args('reservationId') reservationId: string, @CurrentUser() user: any) {
    return this.reservationService.findOneReservation(reservationId);
  }

  @Mutation('marketplaceCancelReservation')
  cancel(@Args('reservationId') reservationId: string, @CurrentUser() user: any) {
    return this.reservationService.cancel(reservationId, user);
  }

  @Query('marketplaceCheckReservationDay')
  checkReservationDay(@Args('branchId') branchId: string, @Args('day') day: string, @CurrentUser() user: any) {
    return this.sharedReservationService.checkReservationDay(branchId, day, user);
  }
}
