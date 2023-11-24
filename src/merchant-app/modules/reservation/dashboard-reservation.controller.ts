import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { DashboardReservationService } from './dashboard-reservation.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Permissions, CurrentUser } from '../common/decorators';
import reservationPermissions from '../common/permissions/reservation.permissions';
import { PermissionsGuard } from '../common/guards';
import { GetAllDto } from '../common/dto/get-all.dto';
import { GetOneReservationDto } from './dto/get-one-reservation.dto';
import { DeleteOneReservationDto } from './dto/delete-one-reservation.dto';
import { CancelOneReservationDto } from './dto/cancel-one-reservation.dto';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { CreateLocalReservationToClientDto } from './dto/create-local-reservation-to-client.dto';

@ApiTags(swaggerResources.DashboardReservations)
@ApiBearerAuth()
@Controller('dashboard/:branchId/reservations')
export class DashboardReservationController {
  constructor(private readonly reservationService: DashboardReservationService) {}

  @Post()
  @ApiResponse({ description: 'This for creating reservation', status: 201 })
  @Permissions(reservationPermissions.ALL_PERMISSION.value, reservationPermissions.CREATE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  create(@Body() createReservationDto: CreateLocalReservationToClientDto) {
    return this.reservationService.create(createReservationDto);
  }

  @Get()
  @ApiResponse({
    description: 'This for getting branch reservations',
    status: 200,
  })
  @Permissions(reservationPermissions.ALL_PERMISSION.value, reservationPermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  findAll(@Param('branchId') branchId: string, @Query() query: GetAllDto) {
    return this.reservationService.getBranchReservations(branchId, query);
  }

  @Get(':id')
  @ApiResponse({
    description: 'This for getting one reservation for logged in user',
    status: 200,
  })
  @Permissions(reservationPermissions.ALL_PERMISSION.value, reservationPermissions.READ_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  getOne(@Param('branchId') branchId: string, @Param() params: GetOneReservationDto) {
    return this.reservationService.getOneReservation(params, branchId);
  }

  @Delete(':id')
  @ApiResponse({
    description: "This for deleting one reservation by it's id",
    status: 203,
  })
  @Permissions(reservationPermissions.ALL_PERMISSION.value, reservationPermissions.DELETE_PERMISSION.value)
  @UseGuards(PermissionsGuard)
  remove(@Param('branchId') branchId: string, @Param() params: DeleteOneReservationDto) {
    return this.reservationService.remove(params, branchId);
  }

  @Patch(':id/cancel')
  @ApiResponse({
    description: 'This for cancel reservation',
    status: 203,
  })
  @Permissions(reservationPermissions.ALL_PERMISSION.value, reservationPermissions.UPDATE_PERMISSION.value)
  cancel(@Param('branchId') branchId: string, @Param() params: CancelOneReservationDto, @CurrentUser() user: any) {
    return this.reservationService.cancel(params, branchId, user);
  }
}
