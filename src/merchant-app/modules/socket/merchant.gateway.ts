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
import { PARTICIPANTS_NAMESPACE, ROOMS_NAMESPACE } from '../common/constants/socket.constants';
import { Branch, Notification, Product } from '../models';
import { MerchantGateWayDto } from './dto/merchant-notification.dto';
import { WsExceptionsFilter } from './socket.filter';

@WebSocketGateway({
  transport: ['websocket', 'polling'],
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  namespace: NameSpaces.Merchant,
})
@UseFilters(new WsExceptionsFilter())
export class MerchantGateWay implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly redisService: RedisService) {}
  private logger = new Logger(MerchantGateWay.name);

  async handleConnection(@ConnectedSocket() socket: Socket) {
    const socketId = socket.id;
    this.logger.log(`Merchant new connection... socket id:`, socketId);
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    const socketId = socket.id;
    this.logger.log(`Merchant disconnection... socket id:`, socketId);
    this.logger.log(`Socket disconnected`);
  }

  public async emitNotificationEvent(data: Partial<Notification> | any): Promise<boolean> {
    return this.server.in(`merchants_${data.branch.toString()}`).emit(EVENTS['new-notification'], data);
  }

  public async emitBranchEvent(data: Partial<Branch>): Promise<boolean> {
    return this.server.in(`merchants_${data._id.toString()}`).emit(EVENTS['visibility-changed'], data);
  }

  public async emitNotificationEventForOwner(data: Partial<Notification> | any, ownerId: string): Promise<boolean> {
    return this.server.in(`owners_${ownerId.toString()}`).emit(EVENTS['new-notification'], data);
  }

  // public async emitBranchesBYProductQuantityEvent(data: Partial<Product>): Promise<any> {
  //   data?.branchesIds?.forEach(branchId => {
  //     return this.server.in(`merchants_${branchId.toString()}`).emit(EVENTS['product-quantity-warning'], data);
  //   });
  // }

  @UseGuards(AccessTokenAuthGuard)
  @SubscribeMessage(EVENTS.join)
  async onParticipate(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: MerchantGateWayDto,
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
