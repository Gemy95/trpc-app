import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { swaggerResources } from '../common/constants/swagger-resource.constants';
import { CurrentUser } from '../common/decorators';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { FindAllNotificationQuery } from './dto/find-all-notification-query.dto';
import { NotificationService } from './notification.service';

@Controller('notification')
@ApiTags(swaggerResources.Notification)
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  shoppexNotification(@CurrentUser() user: any, @Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.shoppexNotification(user, createNotificationDto);
  }

  @Get()
  findAll(@CurrentUser() user: any, @Query() query: FindAllNotificationQuery) {
    return this.notificationService.findAll(user, query);
  }
}
