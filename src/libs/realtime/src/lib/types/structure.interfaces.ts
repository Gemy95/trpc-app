import { EmitterTypeEnum } from './structure.enums';

export interface INamespace {
  name: string;
  rooms: IRoom[];
  eventsWithoutRoom?: IOrderEvent | IOperationEvent[];
}

export interface IRoom {
  name: string;
  events: IOrderEvent | IOperationEvent[];
}

export interface IOrderEvent {
  name: string;
  emitterType: EmitterTypeEnum;
  payload?: any;
}

export interface IOperationEvent {
  room: string;

  name: string;
}

export interface INotificationEvent {
  room: string;
}
