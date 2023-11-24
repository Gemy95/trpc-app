import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { TicketsTagReasonService } from './tickets-tag-reason.service';
import { CreateTicketsTagReasonDto } from './dto/create-tickets-tag-reason.dto';
import { UpdateTicketsTagReasonDto } from './dto/update-tickets-tag-reason.dto';
import { GetAllDto } from '../common/dto/get-all.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { Permissions, Public } from '../common/decorators';
import { PermissionsGuard } from '../common/guards';
import ticketTagReasonPermissions from '../common/permissions/ticket-tag-reason.permissions';

@Controller()
@ApiTags(swaggerResources.TicketsTagReason)
export class TicketsTagReasonController {
  constructor(private readonly ticketsTagReasonService: TicketsTagReasonService) {}

  @ApiBearerAuth()
  @UseGuards(PermissionsGuard)
  @Permissions(ticketTagReasonPermissions.ALL_PERMISSION.value, ticketTagReasonPermissions.CREATE_PERMISSION.value)
  @Post('tickets/tags/:tag/reason')
  create(@Param('tag') tag: string, @Body() createTicketsTagReasonDto: CreateTicketsTagReasonDto) {
    return this.ticketsTagReasonService.create(tag, createTicketsTagReasonDto);
  }

  @Public()
  @Get('tickets/tags/:tag/reason')
  findAll(@Param('tag') tag: string, @Query() params: GetAllDto) {
    return this.ticketsTagReasonService.findAll(tag, params);
  }

  @ApiBearerAuth()
  @Get('tickets/tags/reason')
  @UseGuards(PermissionsGuard)
  @Permissions(ticketTagReasonPermissions.ALL_PERMISSION.value, ticketTagReasonPermissions.READ_PERMISSION.value)
  findForDashboard(@Query() params: GetAllDto) {
    return this.ticketsTagReasonService.findForDashboard(params);
  }

  @ApiBearerAuth()
  @Patch('tickets/tags/:tag/reason/:id')
  @UseGuards(PermissionsGuard)
  @Permissions(ticketTagReasonPermissions.ALL_PERMISSION.value, ticketTagReasonPermissions.UPDATE_PERMISSION.value)
  update(@Param('id') id: string, @Body() updateTicketsTagReasonDto: UpdateTicketsTagReasonDto) {
    return this.ticketsTagReasonService.update(id, updateTicketsTagReasonDto);
  }

  @ApiBearerAuth()
  @Delete('tickets/tags/:tag/reason/:id')
  @UseGuards(PermissionsGuard)
  @Permissions(ticketTagReasonPermissions.ALL_PERMISSION.value, ticketTagReasonPermissions.UPDATE_PERMISSION.value)
  remove(@Param('id') id: string) {
    return this.ticketsTagReasonService.remove(id);
  }
}
