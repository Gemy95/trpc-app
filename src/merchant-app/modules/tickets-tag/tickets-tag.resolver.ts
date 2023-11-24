import { TicketsTagService } from './tickets-tag.service';
import { CreateTicketsTagDto } from './dto/create-tickets-tag.dto';
import { UpdateTicketsTagDto } from './dto/update-tickets-tag.dto';
import { GetAllDto } from '../common/input/get-all.dto';
import { PermissionsGuard } from '../common/guards';
import { Permissions } from '../common/decorators';
import ticketTagPermissions from '../common/permissions/ticket-tag.permissions';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

@Resolver('')
@UseGuards(PermissionsGuard)
export class TicketsTagResolver {
  constructor(private readonly ticketsTagService: TicketsTagService) {}

  @Permissions(ticketTagPermissions.ALL_PERMISSION.value, ticketTagPermissions.CREATE_PERMISSION.value)
  @Mutation('createTicketTag')
  create(@Args('createTicketsTagDto') createTicketsTagDto: CreateTicketsTagDto) {
    return this.ticketsTagService.create(createTicketsTagDto);
  }

  @Permissions(ticketTagPermissions.ALL_PERMISSION.value, ticketTagPermissions.READ_PERMISSION.value)
  @Query('findAllTicketsTags')
  findAll(@Args('params') params: GetAllDto) {
    return this.ticketsTagService.findAll(params);
  }

  @Permissions(ticketTagPermissions.ALL_PERMISSION.value, ticketTagPermissions.READ_PERMISSION.value)
  @Query('findOneTicketTag')
  findOne(@Args('id') id: string) {
    return this.ticketsTagService.findOne(id);
  }

  @Permissions(ticketTagPermissions.ALL_PERMISSION.value, ticketTagPermissions.UPDATE_PERMISSION.value)
  @Mutation('updateOneTicketTag')
  update(@Args('id') id: string, @Args('updateTicketsTagDto') updateTicketsTagDto: UpdateTicketsTagDto) {
    return this.ticketsTagService.update(id, updateTicketsTagDto);
  }

  @Permissions(ticketTagPermissions.ALL_PERMISSION.value, ticketTagPermissions.UPDATE_PERMISSION.value)
  @Mutation('removeOneTicketTag')
  remove(@Args('id') id: string) {
    return this.ticketsTagService.remove(id);
  }
}
