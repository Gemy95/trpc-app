import { RedisService } from '@liaoliaots/nestjs-redis';
import { Logger, UseFilters, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { EVENTS, NameSpaces, NOTIFICATION_EVENT_ROOM } from '../../../libs/realtime/src';
import { AccessTokenAuthGuard } from '../auth/shared/guards/access.token.guard';
import {
  ORDER_EVENT_ROOM,
  PARTICIPANTS_NAMESPACE,
  RATING_EVENT_ROOM,
  REQUEST_EVENT_ROOM,
  RESERVATION_EVENT_ROOM,
  ROOMS_NAMESPACE,
  TRANSACTION_EVENT_ROOM,
} from '../common/constants/socket.constants';
import { CurrentUser } from '../common/decorators';
import { Order, Reservation, Review, ShoppexEmployee, Transaction } from '../models';
import { IOperationEvent } from './dto/operation-event.dto';
import { WsExceptionsFilter } from './socket.filter';

@WebSocketGateway({
  transport: ['websocket', 'polling'],
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  namespace: NameSpaces.ShoppexOperation,
})
@UseFilters(new WsExceptionsFilter())
export class OperationDepartmentsGateWay implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly redisService: RedisService) {}
  private logger = new Logger(OperationDepartmentsGateWay.name);

  async handleConnection(@ConnectedSocket() socket: Socket) {
    const socketId = socket.id;
    this.logger.log(`New connecting... socket id:`, socketId);
    await this.redisService.getClient(PARTICIPANTS_NAMESPACE).set(socketId, '');
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    const socketId = socket.id;
    this.logger.log(`Disconnection... socket id:`, socketId);
    const isExist = this.redisService.getClient(PARTICIPANTS_NAMESPACE).get(socketId);
    if (isExist) {
      await this.redisService.getClient(PARTICIPANTS_NAMESPACE).del(socketId);
    }
    this.logger.log(`Socket disconnected`);
  }

  async emitOperationEvent(
    event: IOperationEvent,
    data: Partial<Order> | Partial<Reservation> | Partial<Transaction> | Partial<Review>,
  ): Promise<boolean> {
    const { room, name } = event;
    return this.server.in(room).emit(`${name}_${room}`, data);
  }

  async emitNotificationEvent(data: Partial<Order> | Partial<Review> | any): Promise<boolean> {
    return this.server.in(NOTIFICATION_EVENT_ROOM).emit(EVENTS['operation-new-notification'], data);
  }

  @UseGuards(AccessTokenAuthGuard)
  @SubscribeMessage(EVENTS.join)
  async onParticipate(@CurrentUser() user: ShoppexEmployee, @ConnectedSocket() socket: Socket) {
    this.logger.log('Registering new participant...', socket.id);
    const rooms: Array<string> = [];
    try {
      if (user.notifyOnOrders) {
        const orderRoomExist = await this.redisService.getClient(ROOMS_NAMESPACE).get(ORDER_EVENT_ROOM);
        if (!orderRoomExist) {
          await this.createRoom(ORDER_EVENT_ROOM);
        }
        rooms.push(ORDER_EVENT_ROOM);
      }
      if (user.notifyOnRequests) {
        const requestRoomExist = await this.redisService.getClient(ROOMS_NAMESPACE).get(REQUEST_EVENT_ROOM);
        if (!requestRoomExist) {
          await this.createRoom(REQUEST_EVENT_ROOM);
        }
        rooms.push(REQUEST_EVENT_ROOM);
      }
      if (user.notifyOnRatings) {
        const ratingRoomExist = await this.redisService.getClient(ROOMS_NAMESPACE).get(RATING_EVENT_ROOM);
        if (!ratingRoomExist) {
          await this.createRoom(RATING_EVENT_ROOM);
        }
        rooms.push(REQUEST_EVENT_ROOM);
      }
      if (user.notifyOnReservations) {
        const reservationRoomExist = await this.redisService.getClient(ROOMS_NAMESPACE).get(RESERVATION_EVENT_ROOM);
        if (!reservationRoomExist) {
          await this.createRoom(RESERVATION_EVENT_ROOM);
        }
        rooms.push(RESERVATION_EVENT_ROOM);
      }
      if (user.notifyOnTransactions) {
        const transactionRoomExist = await this.redisService.getClient(ROOMS_NAMESPACE).get(TRANSACTION_EVENT_ROOM);
        if (!transactionRoomExist) {
          await this.createRoom(TRANSACTION_EVENT_ROOM);
        }
        rooms.push(TRANSACTION_EVENT_ROOM);
      }
      rooms.push(NOTIFICATION_EVENT_ROOM);
      return socket.join(rooms);
    } catch (error) {
      this.logger.error(error);
      return { success: false };
    }
  }

  private createRoom(room: string): Promise<'OK'> {
    return this.redisService.getClient(ROOMS_NAMESPACE).set(room, '');
  }
}
