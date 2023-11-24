import { RedisService } from '@liaoliaots/nestjs-redis';
import { Logger, UseFilters, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { EVENTS, NameSpaces } from '../../../libs/realtime/src';
import { AccessTokenAuthGuard } from '../auth/shared/guards/access.token.guard';
import { ROOMS_NAMESPACE } from '../common/constants/socket.constants';
import { Notification } from '../models';
import { ClientGateWayDto } from './dto/client-notification.dto';
import { WsExceptionsFilter } from './socket.filter';

@WebSocketGateway({
  transport: ['websocket', 'polling'],
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  namespace: NameSpaces.Client,
})
@UseFilters(new WsExceptionsFilter())
export class ClientGateWay implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly redisService: RedisService) {}
  private logger = new Logger(ClientGateWay.name);

  async handleConnection(@ConnectedSocket() socket: Socket) {
    const socketId = socket.id;
    this.logger.log(`Client new connection... socket id:`, socketId);
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    const socketId = socket.id;
    this.logger.log(`Client disconnection... socket id:`, socketId);
    this.logger.log(`Socket disconnected`);
  }

  public async emitChangeStatusNotificationEvent(data: Partial<Notification>): Promise<boolean> {
    return this.server.in(`client_${data.receiver.toString()}`).emit(EVENTS['status-change'], data);
  }

  @UseGuards(AccessTokenAuthGuard)
  @SubscribeMessage(EVENTS.join)
  async onParticipate(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: ClientGateWayDto,
  ): Promise<void | {
    success: boolean;
  }> {
    try {
      let room = await this.redisService.getClient(ROOMS_NAMESPACE).get(`${data.roomId}`);

      if (!room) {
        room = await this.createRoom(`${data.roomId}`);
      }
      return socket.join(`${data.roomId}`);
    } catch (error) {
      this.logger.error(error);
      return { success: false };
    }
  }

  private createRoom(room: string): Promise<'OK'> {
    return this.redisService.getClient(ROOMS_NAMESPACE).set(room, '');
  }
}
