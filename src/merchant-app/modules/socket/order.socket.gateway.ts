import { UseFilters, UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { Channels, EVENTS, NameSpaces, OrderPayload } from '../../../libs/realtime/src';
import { AccessTokenAuthGuard } from '../auth/shared/guards/access.token.guard';
import { WsExceptionsFilter } from './socket.filter';

@WebSocketGateway({
  transport: ['websocket', 'polling'],
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  namespace: NameSpaces.ShoppexOrder,
})
@UseFilters(new WsExceptionsFilter())
export class OrderSocketGateway {
  @WebSocketServer()
  server: Server;

  afterInit() {
    console.log('Starting Order Socket Server...');
  }

  async handleConnection() {
    console.log(`Socket connected`);
  }

  async handleDisconnect() {
    console.log(`Socket disconnected`);
  }

  async handleClientCreateOrderToBranch(data: Partial<OrderPayload | any>) {
    const id = data['branch']['_id'].toString();
    const server = Channels.branch_ + id;
    this.server.in(server).emit(EVENTS['new-order'], data);
  }

  async handleUpdateOrderToClient(data: Partial<OrderPayload | any>) {
    this.server.in(`${Channels.order_}${data['_id']}`).emit(EVENTS['update-order'], data);
  }

  ///////////////////////////////////////subscribe////////////////////////////////////

  @UseGuards()
  @SubscribeMessage(EVENTS.join)
  joinUserToRoom(@MessageBody() data: { roomId: string }, @ConnectedSocket() client: Socket): void | Promise<void> {
    return client.join(data?.roomId);
  }

  @UseGuards(AccessTokenAuthGuard)
  @SubscribeMessage(EVENTS.leave)
  leaveUserToRoom(@MessageBody() data: { roomId: string }, @ConnectedSocket() client: Socket): void | Promise<void> {
    return client.leave(data?.roomId);
  }
}
