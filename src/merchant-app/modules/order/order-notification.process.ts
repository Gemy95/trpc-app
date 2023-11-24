import { OnQueueActive, OnQueueError, Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { Client } from 'onesignal-node';
import { CASHIER } from '../common/constants/merchant-employee';
import { ORDER_ACTION, PRODUCT_ACTION } from '../common/constants/notification.constant';
import { NOTIFICATION_CONTENT } from '../common/constants/notification.content.constant';
import {
  ACCEPT_ORDER_NOTIFICATION_PROCESS,
  ARRIVED_TO_CLIENT_ORDER_NOTIFICATION_PROCESS,
  CANCEL_ORDER_NOTIFICATION_PROCESS,
  CLIENT_NOT_DELIVERED_ORDER_NOTIFICATION_PROCESS,
  CLIENT_NOT_RESPOND_ORDER_NOTIFICATION_PROCESS,
  CREATE_ORDER_NOTIFICATION_PROCESS,
  DELIVERED_ORDER_NOTIFICATION_PROCESS,
  NOTIFICATION_QUEUE,
  ON_WAY_TO_CLIENT_ORDER_NOTIFICATION_PROCESS,
  ORDER_PRODUCT_QUANTITY_NOTIFICATION_PROCESS,
  READY_ORDER_NOTIFICATION_PROCESS,
  REJECTED_ORDER_NOTIFICATION_PROCESS,
  DELIVERED_TO_CLIENT_ORDER_NOTIFICATION_PROCESS,
} from '../common/constants/queue.constants';
import { ORDER_EVENT_ROOM } from '../common/constants/socket.constants';
import { MerchantEmployeeService } from '../merchant-employee/merchant-employee.service';
import { NotificationService } from '../notification/notification.service';
import { OperationDepartmentsGateWay } from '../socket/department.socket.gateway';
import { MerchantGateWay } from '../socket/merchant.gateway';

@Processor(NOTIFICATION_QUEUE)
export class OrderNotificationProcessor {
  constructor(
    @Inject('MERCHANT_ONESIGNAL') private readonly merchantOneSignal: Client,
    @Inject('CLIENT_ONESIGNAL') private readonly clientOneSignal: Client,
    private readonly merchantEmployeeService: MerchantEmployeeService,
    private readonly notificationService: NotificationService,
    private readonly operationDepartmentsGateWay: OperationDepartmentsGateWay,
    private readonly merchantGateWay: MerchantGateWay,
  ) {}

  private logger = new Logger(OrderNotificationProcessor.name);

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(`Processing job ${job.id} of type ${job.name} with data ${job.data}...`);
  }

  @OnQueueError()
  onError(error) {
    this.logger.error(error);
  }

  @Process(CREATE_ORDER_NOTIFICATION_PROCESS)
  async handleDashboardCreatedOrderNotification(job: Job, done) {
    try {
      const { data } = job.toJSON();
      const branchUsers = await this.merchantEmployeeService.getNotificationIncludedUsers(data.branch._id, CASHIER);
      const playerIds = [];
      const receiverIds = [];
      branchUsers.map((employee) => {
        playerIds.push(employee.uuid);
        receiverIds.push(employee._id);
      });

      const notified = await this.merchantOneSignal.createNotification({
        include_player_ids: playerIds,
        contents: {
          en: NOTIFICATION_CONTENT.en.orderCreated,
          ar: NOTIFICATION_CONTENT.ar.orderCreated,
        },
        data: {
          orderId: data._id,
        },
      });
      if (notified.statusCode === 200 && notified.body?.recipients >= 1) {
        const notificationCreated = await this.notificationService.systemSentNotifications({
          receiver: receiverIds,
          branch: data.branch?._id,
          merchant: data.merchant?._id,
          action: ORDER_ACTION,
          target: data._id,
          content: {
            en: NOTIFICATION_CONTENT.en.orderCreated,
            ar: NOTIFICATION_CONTENT.ar.orderCreated,
          },
          title: {
            en: NOTIFICATION_CONTENT.en.orderCreated,
            ar: NOTIFICATION_CONTENT.ar.orderCreated,
          },
          oneSignalId: notified.body.id,
        });

        await this.merchantGateWay.emitNotificationEvent(notificationCreated);
        await this.operationDepartmentsGateWay.emitNotificationEvent(notificationCreated);
      } else {
        await this.merchantEmployeeService.updateNotificationUnSubscribedUsers(branchUsers, notified?.body?.errors);
      }
      await this.operationDepartmentsGateWay.emitOperationEvent({ room: ORDER_EVENT_ROOM, name: 'create' }, data);
      done(null, true);
    } catch (error) {
      this.logger.error(error);
      done(error, false);
    }
  }

  @Process(CANCEL_ORDER_NOTIFICATION_PROCESS)
  async handleDashboardCanceledOrderNotification(job: Job, done) {
    try {
      const { data } = job.toJSON();
      const branchUsers = await this.merchantEmployeeService.getNotificationIncludedUsers(data.branch._id, CASHIER);
      const playerIds = [];
      const receiverIds = [];
      branchUsers.map((employee) => {
        playerIds.push(employee.uuid);
        receiverIds.push(employee._id);
      });
      const clientNotified = await this.clientOneSignal.createNotification({
        include_player_ids: [data.orderCreatedBy.uuid],
        contents: {
          en: NOTIFICATION_CONTENT.en.orderCanceled,
          ar: NOTIFICATION_CONTENT.ar.orderCanceled,
        },
        data: {
          orderId: data._id,
        },
      });
      const merchantNotified = await this.merchantOneSignal.createNotification({
        include_player_ids: playerIds,
        contents: {
          en: NOTIFICATION_CONTENT.en.orderCanceled,
          ar: NOTIFICATION_CONTENT.ar.orderCanceled,
        },
        data: {
          orderId: data._id,
        },
      });
      if (merchantNotified.statusCode === 200 && merchantNotified.body?.recipients >= 1) {
        const notificationCreated = await this.notificationService.systemSentNotifications({
          receiver: receiverIds,
          branch: data.branch?._id,
          merchant: data.merchant?._id,
          action: ORDER_ACTION,
          target: data._id,
          content: {
            en: NOTIFICATION_CONTENT.en.orderCanceled,
            ar: NOTIFICATION_CONTENT.ar.orderCanceled,
          },
          title: {
            en: NOTIFICATION_CONTENT.en.orderCanceled,
            ar: NOTIFICATION_CONTENT.ar.orderCanceled,
          },
          oneSignalId: merchantNotified.body.id,
        });
        await this.merchantGateWay.emitNotificationEvent(notificationCreated);
        await this.operationDepartmentsGateWay.emitNotificationEvent(notificationCreated);
      } else {
        await this.merchantEmployeeService.updateNotificationUnSubscribedUsers(
          branchUsers,
          merchantNotified?.body?.errors,
        );
      }

      if (clientNotified.statusCode === 200 && clientNotified.body?.recipients >= 1) {
        await this.notificationService.systemSentNotifications({
          receiver: [data.orderCreatedBy.uuid],
          branch: data.branch?._id,
          merchant: data.merchant?._id,
          action: ORDER_ACTION,
          target: data._id,
          content: {
            en: NOTIFICATION_CONTENT.en.orderCanceled,
            ar: NOTIFICATION_CONTENT.ar.orderCanceled,
          },
          title: {
            en: NOTIFICATION_CONTENT.en.orderCanceled,
            ar: NOTIFICATION_CONTENT.ar.orderCanceled,
          },
          oneSignalId: clientNotified.body.id,
        });
      }
      await this.operationDepartmentsGateWay.emitOperationEvent({ room: ORDER_EVENT_ROOM, name: 'update' }, data);
      done(null, true);
    } catch (error) {
      this.logger.error(error);
      done(error, false);
    }
  }

  @Process(REJECTED_ORDER_NOTIFICATION_PROCESS)
  async handleDashboardRejectedOrderNotification(job: Job, done) {
    try {
      const { data } = job.toJSON();
      const branchUsers = await this.merchantEmployeeService.getNotificationIncludedUsers(data.branch._id, CASHIER);
      const playerIds = [];
      const receiverIds = [];
      branchUsers.map((employee) => {
        playerIds.push(employee.uuid);
        receiverIds.push(employee._id);
      });
      const clientNotified = await this.clientOneSignal.createNotification({
        include_player_ids: [data.orderCreatedBy.uuid],
        contents: {
          en: NOTIFICATION_CONTENT.en.orderRejected,
          ar: NOTIFICATION_CONTENT.ar.orderRejected,
        },
        data: {
          orderId: data._id,
        },
      });
      const merchantNotified = await this.merchantOneSignal.createNotification({
        include_player_ids: playerIds,
        contents: {
          en: NOTIFICATION_CONTENT.en.orderRejected,
          ar: NOTIFICATION_CONTENT.ar.orderRejected,
        },
        data: {
          orderId: data._id,
        },
      });
      if (merchantNotified.statusCode === 200 && merchantNotified.body?.recipients >= 1) {
        const notificationCreated = await this.notificationService.systemSentNotifications({
          receiver: receiverIds,
          branch: data.branch?._id,
          merchant: data.merchant?._id,
          action: ORDER_ACTION,
          target: data._id,
          content: {
            en: NOTIFICATION_CONTENT.en.orderRejected,
            ar: NOTIFICATION_CONTENT.ar.orderRejected,
          },
          title: {
            en: NOTIFICATION_CONTENT.en.orderRejected,
            ar: NOTIFICATION_CONTENT.ar.orderRejected,
          },
          oneSignalId: merchantNotified.body.id,
        });
        await this.merchantGateWay.emitNotificationEvent(notificationCreated);
        await this.operationDepartmentsGateWay.emitNotificationEvent(notificationCreated);
      } else {
        await this.merchantEmployeeService.updateNotificationUnSubscribedUsers(
          branchUsers,
          merchantNotified?.body?.errors,
        );
      }

      if (clientNotified.statusCode === 200 && clientNotified.body?.recipients >= 1) {
        await this.notificationService.systemSentNotifications({
          receiver: [data.orderCreatedBy.uuid],
          branch: data.branch?._id,
          merchant: data.merchant?._id,
          action: ORDER_ACTION,
          target: data._id,
          content: {
            en: NOTIFICATION_CONTENT.en.orderRejected,
            ar: NOTIFICATION_CONTENT.ar.orderRejected,
          },
          title: {
            en: NOTIFICATION_CONTENT.en.orderRejected,
            ar: NOTIFICATION_CONTENT.ar.orderRejected,
          },
          oneSignalId: clientNotified.body.id,
        });
      }
      await this.operationDepartmentsGateWay.emitOperationEvent({ room: ORDER_EVENT_ROOM, name: 'update' }, data);
      done(null, true);
    } catch (error) {
      this.logger.error(error);
      done(error, false);
    }
  }

  @Process(ACCEPT_ORDER_NOTIFICATION_PROCESS)
  async handleDashboardAcceptedOrderNotification(job: Job, done) {
    try {
      const { data } = job.toJSON();
      const branchUsers = await this.merchantEmployeeService.getNotificationIncludedUsers(data.branch._id, CASHIER);
      const playerIds = [];
      const receiverIds = [];
      branchUsers.map((employee) => {
        playerIds.push(employee.uuid);
        receiverIds.push(employee._id);
      });
      const clientNotified = await this.clientOneSignal.createNotification({
        include_player_ids: [data.orderCreatedBy.uuid],
        contents: {
          en: NOTIFICATION_CONTENT.en.orderAccepted,
          ar: NOTIFICATION_CONTENT.ar.orderAccepted,
        },
        data: {
          orderId: data._id,
        },
      });
      const merchantNotified = await this.merchantOneSignal.createNotification({
        include_player_ids: playerIds,
        contents: {
          en: NOTIFICATION_CONTENT.en.orderAccepted,
          ar: NOTIFICATION_CONTENT.ar.orderAccepted,
        },
        data: {
          orderId: data._id,
        },
      });
      if (merchantNotified.statusCode === 200 && merchantNotified.body?.recipients >= 1) {
        const notificationCreated = await this.notificationService.systemSentNotifications({
          receiver: receiverIds,
          branch: data.branch?._id,
          merchant: data.merchant?._id,
          action: ORDER_ACTION,
          target: data._id,
          content: {
            en: NOTIFICATION_CONTENT.en.orderAccepted,
            ar: NOTIFICATION_CONTENT.ar.orderAccepted,
          },
          title: {
            en: NOTIFICATION_CONTENT.en.orderAccepted,
            ar: NOTIFICATION_CONTENT.ar.orderAccepted,
          },
          oneSignalId: merchantNotified.body.id,
        });
        await this.merchantGateWay.emitNotificationEvent(notificationCreated);
        await this.operationDepartmentsGateWay.emitNotificationEvent(notificationCreated);
      } else {
        await this.merchantEmployeeService.updateNotificationUnSubscribedUsers(
          branchUsers,
          merchantNotified?.body?.errors,
        );
      }

      if (clientNotified.statusCode === 200 && clientNotified.body?.recipients >= 1) {
        await this.notificationService.systemSentNotifications({
          receiver: [data.orderCreatedBy.uuid],
          branch: data.branch?._id,
          merchant: data.merchant?._id,
          action: ORDER_ACTION,
          target: data._id,
          content: {
            en: NOTIFICATION_CONTENT.en.orderAccepted,
            ar: NOTIFICATION_CONTENT.ar.orderAccepted,
          },
          title: {
            en: NOTIFICATION_CONTENT.en.orderAccepted,
            ar: NOTIFICATION_CONTENT.ar.orderAccepted,
          },
          oneSignalId: clientNotified.body.id,
        });
      }
      await this.operationDepartmentsGateWay.emitOperationEvent({ room: ORDER_EVENT_ROOM, name: 'update' }, data);
      done(null, true);
    } catch (error) {
      this.logger.error(error);
      done(error, false);
    }
  }

  @Process(READY_ORDER_NOTIFICATION_PROCESS)
  async handleDashboardReadyOrderNotification(job: Job, done) {
    try {
      const { data } = job.toJSON();
      const branchUsers = await this.merchantEmployeeService.getNotificationIncludedUsers(data.branch._id, CASHIER);
      const playerIds = [];
      const receiverIds = [];
      branchUsers.map((employee) => {
        playerIds.push(employee.uuid);
        receiverIds.push(employee._id);
      });
      const clientNotified = await this.clientOneSignal.createNotification({
        include_player_ids: [data.orderCreatedBy.uuid],
        contents: {
          en: NOTIFICATION_CONTENT.en.orderReady,
          ar: NOTIFICATION_CONTENT.ar.orderReady,
        },
        data: {
          orderId: data._id,
        },
      });
      const merchantNotified = await this.merchantOneSignal.createNotification({
        include_player_ids: playerIds,
        contents: {
          en: NOTIFICATION_CONTENT.en.orderReady,
          ar: NOTIFICATION_CONTENT.ar.orderReady,
        },
        data: {
          orderId: data._id,
        },
      });
      if (merchantNotified.statusCode === 200 && merchantNotified.body?.recipients >= 1) {
        const notificationCreated = await this.notificationService.systemSentNotifications({
          receiver: receiverIds,
          branch: data.branch?._id,
          merchant: data.merchant?._id,
          action: ORDER_ACTION,
          target: data._id,
          content: {
            en: NOTIFICATION_CONTENT.en.orderReady,
            ar: NOTIFICATION_CONTENT.ar.orderReady,
          },
          title: {
            en: NOTIFICATION_CONTENT.en.orderReady,
            ar: NOTIFICATION_CONTENT.ar.orderReady,
          },
          oneSignalId: merchantNotified.body.id,
        });
        await this.merchantGateWay.emitNotificationEvent(notificationCreated);
        await this.operationDepartmentsGateWay.emitNotificationEvent(notificationCreated);
      } else {
        await this.merchantEmployeeService.updateNotificationUnSubscribedUsers(
          branchUsers,
          merchantNotified?.body?.errors,
        );
      }

      if (clientNotified.statusCode === 200 && clientNotified.body?.recipients >= 1) {
        await this.notificationService.systemSentNotifications({
          receiver: [data.orderCreatedBy.uuid],
          branch: data.branch?._id,
          merchant: data.merchant?._id,
          action: ORDER_ACTION,
          target: data._id,
          content: {
            en: NOTIFICATION_CONTENT.en.orderReady,
            ar: NOTIFICATION_CONTENT.ar.orderReady,
          },
          title: {
            en: NOTIFICATION_CONTENT.en.orderReady,
            ar: NOTIFICATION_CONTENT.ar.orderReady,
          },
          oneSignalId: clientNotified.body.id,
        });
      }
      await this.operationDepartmentsGateWay.emitOperationEvent({ room: ORDER_EVENT_ROOM, name: 'update' }, data);
      done(null, true);
    } catch (error) {
      this.logger.error(error);
      done(error, false);
    }
  }

  @Process(DELIVERED_ORDER_NOTIFICATION_PROCESS)
  async handleDashboardDeliveredOrderNotification(job: Job, done) {
    try {
      const { data } = job.toJSON();
      const branchUsers = await this.merchantEmployeeService.getNotificationIncludedUsers(data.branch._id, CASHIER);
      const playerIds = [];
      const receiverIds = [];
      branchUsers.map((employee) => {
        playerIds.push(employee.uuid);
        receiverIds.push(employee._id);
      });
      const clientNotified = await this.clientOneSignal.createNotification({
        include_player_ids: [data.orderCreatedBy.uuid],
        contents: {
          en: NOTIFICATION_CONTENT.en.orderDelivered,
          ar: NOTIFICATION_CONTENT.ar.orderDelivered,
        },
        data: {
          orderId: data._id,
        },
      });
      const merchantNotified = await this.merchantOneSignal.createNotification({
        include_player_ids: playerIds,
        contents: {
          en: NOTIFICATION_CONTENT.en.orderDelivered,
          ar: NOTIFICATION_CONTENT.ar.orderDelivered,
        },
        data: {
          orderId: data._id,
        },
      });
      if (merchantNotified.statusCode === 200 && merchantNotified.body?.recipients >= 1) {
        const notificationCreated = await this.notificationService.systemSentNotifications({
          receiver: receiverIds,
          branch: data.branch?._id,
          merchant: data.merchant?._id,
          action: ORDER_ACTION,
          target: data._id,
          content: {
            en: NOTIFICATION_CONTENT.en.orderDelivered,
            ar: NOTIFICATION_CONTENT.ar.orderDelivered,
          },
          title: {
            en: NOTIFICATION_CONTENT.en.orderDelivered,
            ar: NOTIFICATION_CONTENT.ar.orderDelivered,
          },
          oneSignalId: merchantNotified.body.id,
        });
        await this.merchantGateWay.emitNotificationEvent(notificationCreated);
        await this.operationDepartmentsGateWay.emitNotificationEvent(notificationCreated);
      } else {
        await this.merchantEmployeeService.updateNotificationUnSubscribedUsers(
          branchUsers,
          merchantNotified?.body?.errors,
        );
      }

      if (clientNotified.statusCode === 200 && clientNotified.body?.recipients >= 1) {
        await this.notificationService.systemSentNotifications({
          receiver: [data.orderCreatedBy.uuid],
          branch: data.branch?._id,
          merchant: data.merchant?._id,
          action: ORDER_ACTION,
          target: data._id,
          content: {
            en: NOTIFICATION_CONTENT.en.orderDelivered,
            ar: NOTIFICATION_CONTENT.ar.orderDelivered,
          },
          title: {
            en: NOTIFICATION_CONTENT.en.orderDelivered,
            ar: NOTIFICATION_CONTENT.ar.orderDelivered,
          },
          oneSignalId: clientNotified.body.id,
        });
      }
      await this.operationDepartmentsGateWay.emitOperationEvent({ room: ORDER_EVENT_ROOM, name: 'update' }, data);
      done(null, true);
    } catch (error) {
      this.logger.error(error);
      done(error, false);
    }
  }

  @Process(ON_WAY_TO_CLIENT_ORDER_NOTIFICATION_PROCESS)
  async handleDriverOnWayToClientOrderNotification(job: Job, done) {
    try {
      const { data } = job.toJSON();
      const branchUsers = await this.merchantEmployeeService.getNotificationIncludedUsers(data.branch._id, CASHIER);
      const playerIds = [];
      const receiverIds = [];
      branchUsers.map((employee) => {
        playerIds.push(employee.uuid);
        receiverIds.push(employee._id);
      });
      const clientNotified = await this.clientOneSignal.createNotification({
        include_player_ids: [data.orderCreatedBy.uuid],
        contents: {
          en: NOTIFICATION_CONTENT.en.orderOnWayToClient,
          ar: NOTIFICATION_CONTENT.ar.orderOnWayToClient,
        },
        data: {
          orderId: data._id,
        },
      });
      const merchantNotified = await this.merchantOneSignal.createNotification({
        include_player_ids: playerIds,
        contents: {
          en: NOTIFICATION_CONTENT.en.orderOnWayToClient,
          ar: NOTIFICATION_CONTENT.ar.orderOnWayToClient,
        },
        data: {
          orderId: data._id,
        },
      });
      if (merchantNotified.statusCode === 200 && merchantNotified.body?.recipients >= 1) {
        const notificationCreated = await this.notificationService.systemSentNotifications({
          receiver: receiverIds,
          branch: data.branch?._id,
          merchant: data.merchant?._id,
          action: ORDER_ACTION,
          target: data._id,
          content: {
            en: NOTIFICATION_CONTENT.en.orderOnWayToClient,
            ar: NOTIFICATION_CONTENT.ar.orderOnWayToClient,
          },
          title: {
            en: NOTIFICATION_CONTENT.en.orderOnWayToClient,
            ar: NOTIFICATION_CONTENT.ar.orderOnWayToClient,
          },
          oneSignalId: merchantNotified.body.id,
        });
        await this.merchantGateWay.emitNotificationEvent(notificationCreated);
        await this.operationDepartmentsGateWay.emitNotificationEvent(notificationCreated);
      } else {
        await this.merchantEmployeeService.updateNotificationUnSubscribedUsers(
          branchUsers,
          merchantNotified?.body?.errors,
        );
      }

      if (clientNotified.statusCode === 200 && clientNotified.body?.recipients >= 1) {
        await this.notificationService.systemSentNotifications({
          receiver: [data.orderCreatedBy.uuid],
          branch: data.branch?._id,
          merchant: data.merchant?._id,
          action: ORDER_ACTION,
          target: data._id,
          content: {
            en: NOTIFICATION_CONTENT.en.orderOnWayToClient,
            ar: NOTIFICATION_CONTENT.ar.orderOnWayToClient,
          },
          title: {
            en: NOTIFICATION_CONTENT.en.orderOnWayToClient,
            ar: NOTIFICATION_CONTENT.ar.orderOnWayToClient,
          },
          oneSignalId: clientNotified.body.id,
        });
      }
      await this.operationDepartmentsGateWay.emitOperationEvent({ room: ORDER_EVENT_ROOM, name: 'update' }, data);
      done(null, true);
    } catch (error) {
      this.logger.error(error);
      done(error, false);
    }
  }

  @Process(ARRIVED_TO_CLIENT_ORDER_NOTIFICATION_PROCESS)
  async handleDriverArrivedToClientOrderNotification(job: Job, done) {
    try {
      const { data } = job.toJSON();
      const branchUsers = await this.merchantEmployeeService.getNotificationIncludedUsers(data.branch._id, CASHIER);
      const playerIds = [];
      const receiverIds = [];
      branchUsers.map((employee) => {
        playerIds.push(employee.uuid);
        receiverIds.push(employee._id);
      });
      const clientNotified = await this.clientOneSignal.createNotification({
        include_player_ids: [data.orderCreatedBy.uuid],
        contents: {
          en: NOTIFICATION_CONTENT.en.orderArrivedToClient,
          ar: NOTIFICATION_CONTENT.ar.orderArrivedToClient,
        },
        data: {
          orderId: data._id,
        },
      });
      const merchantNotified = await this.merchantOneSignal.createNotification({
        include_player_ids: playerIds,
        contents: {
          en: NOTIFICATION_CONTENT.en.orderArrivedToClient,
          ar: NOTIFICATION_CONTENT.ar.orderArrivedToClient,
        },
        data: {
          orderId: data._id,
        },
      });
      if (merchantNotified.statusCode === 200 && merchantNotified.body?.recipients >= 1) {
        const notificationCreated = await this.notificationService.systemSentNotifications({
          receiver: receiverIds,
          branch: data.branch?._id,
          merchant: data.merchant?._id,
          action: ORDER_ACTION,
          target: data._id,
          content: {
            en: NOTIFICATION_CONTENT.en.orderArrivedToClient,
            ar: NOTIFICATION_CONTENT.ar.orderArrivedToClient,
          },
          title: {
            en: NOTIFICATION_CONTENT.en.orderArrivedToClient,
            ar: NOTIFICATION_CONTENT.ar.orderArrivedToClient,
          },
          oneSignalId: merchantNotified.body.id,
        });
        await this.merchantGateWay.emitNotificationEvent(notificationCreated);
        await this.operationDepartmentsGateWay.emitNotificationEvent(notificationCreated);
      } else {
        await this.merchantEmployeeService.updateNotificationUnSubscribedUsers(
          branchUsers,
          merchantNotified?.body?.errors,
        );
      }

      if (clientNotified.statusCode === 200 && clientNotified.body?.recipients >= 1) {
        await this.notificationService.systemSentNotifications({
          receiver: [data.orderCreatedBy.uuid],
          branch: data.branch?._id,
          merchant: data.merchant?._id,
          action: ORDER_ACTION,
          target: data._id,
          content: {
            en: NOTIFICATION_CONTENT.en.orderArrivedToClient,
            ar: NOTIFICATION_CONTENT.ar.orderArrivedToClient,
          },
          title: {
            en: NOTIFICATION_CONTENT.en.orderArrivedToClient,
            ar: NOTIFICATION_CONTENT.ar.orderArrivedToClient,
          },
          oneSignalId: clientNotified.body.id,
        });
      }
      await this.operationDepartmentsGateWay.emitOperationEvent({ room: ORDER_EVENT_ROOM, name: 'update' }, data);
      done(null, true);
    } catch (error) {
      this.logger.error(error);
      done(error, false);
    }
  }

  @Process(DELIVERED_TO_CLIENT_ORDER_NOTIFICATION_PROCESS)
  async handleDriverDeliveredToClientOrderNotification(job: Job, done) {
    try {
      const { data } = job.toJSON();
      const branchUsers = await this.merchantEmployeeService.getNotificationIncludedUsers(data.branch._id, CASHIER);
      const playerIds = [];
      const receiverIds = [];
      branchUsers.map((employee) => {
        playerIds.push(employee.uuid);
        receiverIds.push(employee._id);
      });
      const clientNotified = await this.clientOneSignal.createNotification({
        include_player_ids: [data.orderCreatedBy.uuid],
        contents: {
          en: NOTIFICATION_CONTENT.en.orderDeliveredToClient,
          ar: NOTIFICATION_CONTENT.ar.orderDeliveredToClient,
        },
        data: {
          orderId: data._id,
        },
      });
      const merchantNotified = await this.merchantOneSignal.createNotification({
        include_player_ids: playerIds,
        contents: {
          en: NOTIFICATION_CONTENT.en.orderDeliveredToClient,
          ar: NOTIFICATION_CONTENT.ar.orderDeliveredToClient,
        },
        data: {
          orderId: data._id,
        },
      });
      if (merchantNotified.statusCode === 200 && merchantNotified.body?.recipients >= 1) {
        const notificationCreated = await this.notificationService.systemSentNotifications({
          receiver: receiverIds,
          branch: data.branch?._id,
          merchant: data.merchant?._id,
          action: ORDER_ACTION,
          target: data._id,
          content: {
            en: NOTIFICATION_CONTENT.en.orderDeliveredToClient,
            ar: NOTIFICATION_CONTENT.ar.orderDeliveredToClient,
          },
          title: {
            en: NOTIFICATION_CONTENT.en.orderDeliveredToClient,
            ar: NOTIFICATION_CONTENT.ar.orderArrivedToClient,
          },
          oneSignalId: merchantNotified.body.id,
        });
        await this.merchantGateWay.emitNotificationEvent(notificationCreated);
        await this.operationDepartmentsGateWay.emitNotificationEvent(notificationCreated);
      } else {
        await this.merchantEmployeeService.updateNotificationUnSubscribedUsers(
          branchUsers,
          merchantNotified?.body?.errors,
        );
      }

      if (clientNotified.statusCode === 200 && clientNotified.body?.recipients >= 1) {
        await this.notificationService.systemSentNotifications({
          receiver: [data.orderCreatedBy.uuid],
          branch: data.branch?._id,
          merchant: data.merchant?._id,
          action: ORDER_ACTION,
          target: data._id,
          content: {
            en: NOTIFICATION_CONTENT.en.orderDeliveredToClient,
            ar: NOTIFICATION_CONTENT.ar.orderDeliveredToClient,
          },
          title: {
            en: NOTIFICATION_CONTENT.en.orderDeliveredToClient,
            ar: NOTIFICATION_CONTENT.ar.orderDeliveredToClient,
          },
          oneSignalId: clientNotified.body.id,
        });
      }
      await this.operationDepartmentsGateWay.emitOperationEvent({ room: ORDER_EVENT_ROOM, name: 'update' }, data);
      done(null, true);
    } catch (error) {
      this.logger.error(error);
      done(error, false);
    }
  }

  @Process(CLIENT_NOT_RESPOND_ORDER_NOTIFICATION_PROCESS)
  async handleDriverClientNotRespondOrderNotification(job: Job, done) {
    try {
      const { data } = job.toJSON();
      const branchUsers = await this.merchantEmployeeService.getNotificationIncludedUsers(data.branch._id, CASHIER);
      const playerIds = [];
      const receiverIds = [];
      branchUsers.map((employee) => {
        playerIds.push(employee.uuid);
        receiverIds.push(employee._id);
      });
      const clientNotified = await this.clientOneSignal.createNotification({
        include_player_ids: [data.orderCreatedBy.uuid],
        contents: {
          en: NOTIFICATION_CONTENT.en.orderClientNotRespond,
          ar: NOTIFICATION_CONTENT.ar.orderClientNotRespond,
        },
        data: {
          orderId: data._id,
        },
      });
      const merchantNotified = await this.merchantOneSignal.createNotification({
        include_player_ids: playerIds,
        contents: {
          en: NOTIFICATION_CONTENT.en.orderClientNotRespond,
          ar: NOTIFICATION_CONTENT.ar.orderClientNotRespond,
        },
        data: {
          orderId: data._id,
        },
      });
      if (merchantNotified.statusCode === 200 && merchantNotified.body?.recipients >= 1) {
        const notificationCreated = await this.notificationService.systemSentNotifications({
          receiver: receiverIds,
          branch: data.branch?._id,
          merchant: data.merchant?._id,
          action: ORDER_ACTION,
          target: data._id,
          content: {
            en: NOTIFICATION_CONTENT.en.orderClientNotRespond,
            ar: NOTIFICATION_CONTENT.ar.orderClientNotRespond,
          },
          title: {
            en: NOTIFICATION_CONTENT.en.orderClientNotRespond,
            ar: NOTIFICATION_CONTENT.ar.orderClientNotRespond,
          },
          oneSignalId: merchantNotified.body.id,
        });
        await this.merchantGateWay.emitNotificationEvent(notificationCreated);
        await this.operationDepartmentsGateWay.emitNotificationEvent(notificationCreated);
      } else {
        await this.merchantEmployeeService.updateNotificationUnSubscribedUsers(
          branchUsers,
          merchantNotified?.body?.errors,
        );
      }

      if (clientNotified.statusCode === 200 && clientNotified.body?.recipients >= 1) {
        await this.notificationService.systemSentNotifications({
          receiver: [data.orderCreatedBy.uuid],
          branch: data.branch?._id,
          merchant: data.merchant?._id,
          action: ORDER_ACTION,
          target: data._id,
          content: {
            en: NOTIFICATION_CONTENT.en.orderClientNotRespond,
            ar: NOTIFICATION_CONTENT.ar.orderClientNotRespond,
          },
          title: {
            en: NOTIFICATION_CONTENT.en.orderClientNotRespond,
            ar: NOTIFICATION_CONTENT.ar.orderClientNotRespond,
          },
          oneSignalId: clientNotified.body.id,
        });
      }
      await this.operationDepartmentsGateWay.emitOperationEvent({ room: ORDER_EVENT_ROOM, name: 'update' }, data);
      done(null, true);
    } catch (error) {
      this.logger.error(error);
      done(error, false);
    }
  }

  @Process(CLIENT_NOT_DELIVERED_ORDER_NOTIFICATION_PROCESS)
  async handleDriverClientNotDeliveredOrderNotification(job: Job, done) {
    try {
      const { data } = job.toJSON();
      const branchUsers = await this.merchantEmployeeService.getNotificationIncludedUsers(data.branch._id, CASHIER);
      const playerIds = [];
      const receiverIds = [];
      branchUsers.map((employee) => {
        playerIds.push(employee.uuid);
        receiverIds.push(employee._id);
      });
      const clientNotified = await this.clientOneSignal.createNotification({
        include_player_ids: [data.orderCreatedBy.uuid],
        contents: {
          en: NOTIFICATION_CONTENT.en.orderClientNotDelivered,
          ar: NOTIFICATION_CONTENT.ar.orderClientNotDelivered,
        },
        data: {
          orderId: data._id,
        },
      });
      const merchantNotified = await this.merchantOneSignal.createNotification({
        include_player_ids: playerIds,
        contents: {
          en: NOTIFICATION_CONTENT.en.orderClientNotDelivered,
          ar: NOTIFICATION_CONTENT.ar.orderClientNotDelivered,
        },
        data: {
          orderId: data._id,
        },
      });
      if (merchantNotified.statusCode === 200 && merchantNotified.body?.recipients >= 1) {
        const notificationCreated = await this.notificationService.systemSentNotifications({
          receiver: receiverIds,
          branch: data.branch?._id,
          merchant: data.merchant?._id,
          action: ORDER_ACTION,
          target: data._id,
          content: {
            en: NOTIFICATION_CONTENT.en.orderClientNotDelivered,
            ar: NOTIFICATION_CONTENT.ar.orderClientNotDelivered,
          },
          title: {
            en: NOTIFICATION_CONTENT.en.orderClientNotDelivered,
            ar: NOTIFICATION_CONTENT.ar.orderClientNotDelivered,
          },
          oneSignalId: merchantNotified.body.id,
        });
        await this.merchantGateWay.emitNotificationEvent(notificationCreated);
        await this.operationDepartmentsGateWay.emitNotificationEvent(notificationCreated);
      } else {
        await this.merchantEmployeeService.updateNotificationUnSubscribedUsers(
          branchUsers,
          merchantNotified?.body?.errors,
        );
      }

      if (clientNotified.statusCode === 200 && clientNotified.body?.recipients >= 1) {
        await this.notificationService.systemSentNotifications({
          receiver: [data.orderCreatedBy.uuid],
          branch: data.branch?._id,
          merchant: data.merchant?._id,
          action: ORDER_ACTION,
          target: data._id,
          content: {
            en: NOTIFICATION_CONTENT.en.orderClientNotDelivered,
            ar: NOTIFICATION_CONTENT.ar.orderClientNotDelivered,
          },
          title: {
            en: NOTIFICATION_CONTENT.en.orderClientNotDelivered,
            ar: NOTIFICATION_CONTENT.ar.orderClientNotDelivered,
          },
          oneSignalId: clientNotified.body.id,
        });
      }
      await this.operationDepartmentsGateWay.emitOperationEvent({ room: ORDER_EVENT_ROOM, name: 'update' }, data);
      done(null, true);
    } catch (error) {
      this.logger.error(error);
      done(error, false);
    }
  }

  @Process(ORDER_PRODUCT_QUANTITY_NOTIFICATION_PROCESS)
  async handleOrderProductQuantityWarningNotification(job: Job, done) {
    try {
      const { data } = job.toJSON();
      const branchUsers = await this.merchantEmployeeService.getNotificationIncludedUsersByBranches(data.branchesIds);
      const playerIds = [];
      const receiverIds = [];
      branchUsers.map((employee) => {
        playerIds.push(employee.uuid);
        receiverIds.push(employee._id);
      });
      const merchantNotified = await this.merchantOneSignal.createNotification({
        include_player_ids: playerIds,
        contents: {
          en: NOTIFICATION_CONTENT.en.productQuantityWarning,
          ar: NOTIFICATION_CONTENT.ar.productQuantityWarning,
        },
        data,
      });
      if (merchantNotified.statusCode === 200 && merchantNotified.body?.recipients >= 1) {
        data?.branchesIds?.forEach(async (branchId) => {
          const notificationCreated = await this.notificationService.systemSentNotifications({
            receiver: receiverIds,
            branch: branchId,
            merchant: data?.merchantId,
            action: PRODUCT_ACTION,
            target: data._id,
            content: {
              en: data?.translation?.[0]?.name,
              ar: data?.name,
            },
            title: {
              en: NOTIFICATION_CONTENT.en.productQuantityWarning,
              ar: NOTIFICATION_CONTENT.ar.productQuantityWarning,
            },
            oneSignalId: merchantNotified.body.id,
          });

          await this.merchantGateWay.emitNotificationEvent(notificationCreated);
        });
      } else {
        await this.merchantEmployeeService.updateNotificationUnSubscribedUsers(
          branchUsers,
          merchantNotified?.body?.errors,
        );
      }

      done(null, true);
    } catch (error) {
      this.logger.error(error);
      done(error, false);
    }
  }
}
