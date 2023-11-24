import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { TicketsTagService } from './tickets-tag.service';
import { CreateTicketsTagDto } from './dto/create-tickets-tag.dto';
import { UpdateTicketsTagDto } from './dto/update-tickets-tag.dto';
import { GetAllDto } from '../common/dto/get-all.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { PermissionsGuard } from '../common/guards';
import { Permissions } from '../common/decorators';
import ticketTagPermissions from '../common/permissions/ticket-tag.permissions';

@Controller('tickets/tags')
@ApiBearerAuth()
@ApiTags(swaggerResources.TicketsTag)
@UseGuards(PermissionsGuard)
export class TicketsTagController {
  constructor(private readonly ticketsTagService: TicketsTagService) {}

  @Permissions(ticketTagPermissions.ALL_PERMISSION.value, ticketTagPermissions.CREATE_PERMISSION.value)
  @Post()
  create(@Body() createTicketsTagDto: CreateTicketsTagDto) {
    return this.ticketsTagService.create(createTicketsTagDto);
  }

  @Permissions(ticketTagPermissions.ALL_PERMISSION.value, ticketTagPermissions.READ_PERMISSION.value)
  @Get()
  findAll(@Query() params: GetAllDto) {
    return this.ticketsTagService.findAll(params);
  }

  @Permissions(ticketTagPermissions.ALL_PERMISSION.value, ticketTagPermissions.READ_PERMISSION.value)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketsTagService.findOne(id);
  }

  @Permissions(ticketTagPermissions.ALL_PERMISSION.value, ticketTagPermissions.UPDATE_PERMISSION.value)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketsTagDto: UpdateTicketsTagDto) {
    return this.ticketsTagService.update(id, updateTicketsTagDto);
  }

  @Permissions(ticketTagPermissions.ALL_PERMISSION.value, ticketTagPermissions.UPDATE_PERMISSION.value)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsTagService.remove(id);
  }
}
