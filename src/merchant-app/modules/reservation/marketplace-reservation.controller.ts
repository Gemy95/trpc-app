import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { MarketplaceReservationService } from './marketplace-reservation.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators';
import { GetAllDto } from '../common/dto/get-all.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { GetOneReservationDto } from './dto/get-one-reservation.dto';
import { DeleteOneReservationDto } from './dto/delete-one-reservation.dto';
import { CancelOneReservationDto } from './dto/cancel-one-reservation.dto';
import { swaggerResources } from '../common/constants/swagger-resource.constants';

@ApiTags(swaggerResources.MarketplaceReservations)
@ApiBearerAuth()
@Controller('marketplace/reservations')
export class MarketplaceReservationController {
  constructor(private readonly reservationService: MarketplaceReservationService) {}

  @Post()
  @ApiResponse({ description: 'This for creating reservation', status: 201 })
  create(@Body() createReservationDto: CreateReservationDto, @CurrentUser() user: any) {
    return this.reservationService.create(createReservationDto, user);
  }

  @Get()
  @ApiResponse({
    description: "This for getting logged in user's reservations",
    status: 200,
  })
  findAll(@Query() query: GetAllDto, @CurrentUser() user: any) {
    return this.reservationService.getReservations(query, user);
  }

  @Get(':id')
  @ApiResponse({
    description: 'This for getting one reservation for logged in user',
    status: 200,
  })
  getOne(@Param() params: GetOneReservationDto, @CurrentUser() user: any) {
    return this.reservationService.getOneReservation(params, user);
  }

  @Delete(':id')
  @ApiResponse({
    description: "This for deleting one reservation by it's id",
    status: 203,
  })
  remove(@Param() params: DeleteOneReservationDto, @CurrentUser() user: any) {
    return this.reservationService.remove(params, user);
  }

  @Patch(':id/cancel')
  @ApiResponse({
    description: "This for deleting one reservation by it's id",
    status: 203,
  })
  cancel(@Param() params: CancelOneReservationDto, @CurrentUser() user: any) {
    return this.reservationService.cancel(params.id, user);
  }
}
