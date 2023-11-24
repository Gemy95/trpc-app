import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { GetAllDto } from '../common/input/get-all.dto';
import { GetAllForOperation } from './dto/get-all-for-operation.dto';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/shared/decorator/user.graphql.decorator';

@Resolver('')
export class TicketsResolver {
  constructor(private readonly ticketsService: TicketsService) {}

  @Mutation('createTicket')
  create(@CurrentUser() user: any, @Args('createTicketDto') createTicketDto: CreateTicketDto) {
    return this.ticketsService.create(user, createTicketDto);
  }

  @Query('findAllTicketsForMerchant')
  findAllForMerchant(@Args('merchant') merchant: string, @Args('params') params: GetAllDto) {
    return this.ticketsService.findAllForMerchant(merchant, params);
  }

  @Query('findAllTicketsForOperation')
  findAllForOperation(@Args('params') params: GetAllForOperation) {
    return this.ticketsService.findAllForOperation(params);
  }

  @Query('findOneTicket')
  findOne(@Args('id') id: string) {
    return this.ticketsService.findOne(id);
  }

  @Mutation('updateOneTicket')
  update(@Args('id') id: string, @Args('updateTicketDto') updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(id, updateTicketDto);
  }

  @Mutation('removeOneTicket')
  remove(@Args('id') id: string) {
    return this.ticketsService.remove(id);
  }
}
