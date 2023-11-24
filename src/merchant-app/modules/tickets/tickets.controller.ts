import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { CurrentUser } from '../common/decorators';
import { GetAllDto } from '../common/dto/get-all.dto';
import { GetAllForOperation } from './dto/get-all-for-operation.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { swaggerResources } from '../common/constants/swagger-resource.constants';

@Controller('tickets')
@ApiBearerAuth()
@ApiTags(swaggerResources.Ticket)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.create(user, createTicketDto);
  }

  @Get(':merchant')
  findAllForMerchant(@Param('merchant') merchant: string, @Query() params: GetAllDto) {
    return this.ticketsService.findAllForMerchant(merchant, params);
  }

  @Get()
  findAllForOperation(@Query() params: GetAllForOperation) {
    return this.ticketsService.findAllForOperation(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(id, updateTicketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(id);
  }
}
