import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/shared/decorator/user.graphql.decorator';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { FindAllNotificationQuery } from './dto/find-all-notification-query.input';
import { NotificationService } from './notification.service';

@Resolver('')
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Mutation('shoppexEmployeeCreateNotification')
  shoppexNotification(
    @CurrentUser() user: any,
    @Args('createNotificationDto') createNotificationDto: CreateNotificationDto,
  ) {
    return this.notificationService.shoppexNotification(user, createNotificationDto);
  }

  @Query('findAllNotification')
  findAll(@CurrentUser() user: any, @Args('query') query: FindAllNotificationQuery) {
    return this.notificationService.findAll(user, query);
  }
}
