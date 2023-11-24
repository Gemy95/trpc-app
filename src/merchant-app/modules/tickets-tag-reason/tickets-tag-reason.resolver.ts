import { TicketsTagReasonService } from './tickets-tag-reason.service';
import { CreateTicketsTagReasonDto } from './dto/create-tickets-tag-reason.dto';
import { UpdateTicketsTagReasonDto } from './dto/update-tickets-tag-reason.dto';
import { GetAllDto } from '../common/input/get-all.dto';
import { Permissions, Public } from '../common/decorators';
import { PermissionsGuard } from '../common/guards';
import ticketTagReasonPermissions from '../common/permissions/ticket-tag-reason.permissions';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

@Resolver('')
export class TicketsTagReasonResolver {
  constructor(private readonly ticketsTagReasonService: TicketsTagReasonService) {}

  @UseGuards(PermissionsGuard)
  @Permissions(ticketTagReasonPermissions.ALL_PERMISSION.value, ticketTagReasonPermissions.CREATE_PERMISSION.value)
  @Mutation('createTicketTagReason')
  create(
    @Args('tag') tag: string,
    @Args('createTicketsTagReasonDto') createTicketsTagReasonDto: CreateTicketsTagReasonDto,
  ) {
    return this.ticketsTagReasonService.create(tag, createTicketsTagReasonDto);
  }

  @Public()
  @Query('findAllTicketTagReasons')
  findAll(@Args('tag') tag: string, @Args('params') params: GetAllDto) {
    return this.ticketsTagReasonService.findAll(tag, params);
  }

  @Query('findForDashboardTicketTagReasons')
  @UseGuards(PermissionsGuard)
  @Permissions(ticketTagReasonPermissions.ALL_PERMISSION.value, ticketTagReasonPermissions.READ_PERMISSION.value)
  findForDashboard(@Args('params') params: GetAllDto) {
    return this.ticketsTagReasonService.findForDashboard(params);
  }

  @Mutation('updateOneTicketTagReason')
  @UseGuards(PermissionsGuard)
  @Permissions(ticketTagReasonPermissions.ALL_PERMISSION.value, ticketTagReasonPermissions.UPDATE_PERMISSION.value)
  update(
    @Args('id') id: string,
    @Args('updateTicketsTagReasonDto') updateTicketsTagReasonDto: UpdateTicketsTagReasonDto,
  ) {
    return this.ticketsTagReasonService.update(id, updateTicketsTagReasonDto);
  }

  @Mutation('removeTicketTagReason')
  @UseGuards(PermissionsGuard)
  @Permissions(ticketTagReasonPermissions.ALL_PERMISSION.value, ticketTagReasonPermissions.UPDATE_PERMISSION.value)
  remove(@Args('id') id: string) {
    return this.ticketsTagReasonService.remove(id);
  }
}
