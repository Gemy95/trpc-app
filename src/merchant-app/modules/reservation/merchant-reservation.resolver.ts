import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/shared/decorator/user.graphql.decorator';
import { SharedReservationService } from './reservation.shared.service';
import { MerchantReservationService } from './merchant-reservation.service';
import { ApproveOrRejectReservationDto } from './dto/approve-or-reject.dto';
import { MerchantFindAllReservationDto } from './dto/merchant-find-all-filter.dto';
import { CreateLocalReservationToClientDto } from './dto/create-local-reservation-to-client.dto';
import { MerchantFindAllReservationByDateDto } from './dto/merchant-find-all-filter-date.dto';

@Resolver('')
export class MerchantReservationResolver {
  constructor(
    private readonly reservationService: MerchantReservationService,
    private sharedReservationService: SharedReservationService,
  ) {}

  @Mutation('merchantCreateReservation')
  createReservation(
    @Args('createReservationDto') createLocalReservationToClientDto: CreateLocalReservationToClientDto,
    @CurrentUser() user: any,
  ) {
    return this.sharedReservationService.create(createLocalReservationToClientDto, user);
  }

  @Query('merchantFindAllReservationsByBranchId')
  merchantFindAllReservationsByBranchId(
    @Args('branchId') branchId: string,
    @Args('query') query: MerchantFindAllReservationDto,
    @CurrentUser() user: any,
  ) {
    return this.sharedReservationService.merchantFindAllReservationsByBranchId(branchId, query, user);
  }

  @Query('merchantFindCountReservationsByBranchIdAndDate')
  merchantFindCountReservationsByBranchIdAndDate(
    @Args('branchId') branchId: string,
    @Args('query') query: MerchantFindAllReservationByDateDto,
    @CurrentUser() user: any,
  ) {
    return this.sharedReservationService.merchantFindCountReservationsByBranchIdAndDate(branchId, query, user);
  }

  @Query('merchantFindOneReservation')
  merchantFindOneReservation(@Args('reservationId') reservationId: string, @CurrentUser() user: any) {
    return this.sharedReservationService.merchantFindOneReservation(reservationId, user);
  }

  @Mutation('merchantApproveOrRejectReservation')
  approveOrRejectReservation(
    @Args('reservationId') reservationId: string,
    @Args('approveOrRejectReservationDto') approveOrRejectReservationDto: ApproveOrRejectReservationDto,
    @CurrentUser() user: any,
  ) {
    return this.reservationService.approveOrRejectReservation(reservationId, approveOrRejectReservationDto, user);
  }
}
