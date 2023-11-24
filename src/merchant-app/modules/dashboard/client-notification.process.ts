import { OnQueueActive, OnQueueError, Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { Client } from 'onesignal-node';
import { CLIENT_ACTIVE_STATUS } from '../common/constants/client.constants';
import { CLIENT_ACTION, USER_TYPES } from '../common/constants/notification.constant';
import { NOTIFICATION_CONTENT } from '../common/constants/notification.content.constant';
import { CHANGE_CLIENT_STATUS_PROCESSOR, CLIENT_QUEUE } from '../common/constants/queue.constants';
import { NotificationService } from '../notification/notification.service';
import { ClientGateWay } from '../socket/client.socket.gateway';

@Processor(CLIENT_QUEUE)
export class ClientNotificationProcessor {
  constructor(
    @Inject('CLIENT_ONESIGNAL') private readonly clientOneSignal: Client,
    private readonly notificationService: NotificationService,
    private readonly clientGateWay: ClientGateWay,
  ) {}

  private logger = new Logger(ClientNotificationProcessor.name);

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(`Processing job ${job.id} of type ${job.name} with data ${job.data}...`);
  }

  @OnQueueError()
  onError(error) {
    this.logger.error(error);
  }

  @Process(CHANGE_CLIENT_STATUS_PROCESSOR)
  async handleDashboardChangeClientStatusNotification(job: Job, done) {
    try {
      const { data } = job.toJSON();
      const playerIds = [data?.client?.uuid];
      const receiverIds = [data?.client?._id];
      const notified = await this.clientOneSignal.createNotification({
        include_player_ids: playerIds,
        contents: {
          en:
            data?.user?.status == CLIENT_ACTIVE_STATUS
              ? NOTIFICATION_CONTENT.en.activeChangeStatus
              : NOTIFICATION_CONTENT.en.blockChangeStatus,
          ar:
            data?.user?.status == CLIENT_ACTIVE_STATUS
              ? NOTIFICATION_CONTENT.ar.activeChangeStatus
              : NOTIFICATION_CONTENT.en.blockChangeStatus,
        },
        data: {
          status: data.client.status,
        },
      });
      if (notified.statusCode === 200 && notified.body?.recipients >= 1) {
        const notificationCreated = await this.notificationService.systemSentNotifications({
          receiver: receiverIds,
          action: CLIENT_ACTION,
          target: data.client._id,
          sender: data.user._id,
          senderType: USER_TYPES.SHOPPEX_EMPLOYEE,
          content: {
            en:
              data?.user?.status == CLIENT_ACTIVE_STATUS
                ? NOTIFICATION_CONTENT.en.activeChangeStatus
                : NOTIFICATION_CONTENT.en.blockChangeStatus,
            ar:
              data?.user?.status == CLIENT_ACTIVE_STATUS
                ? NOTIFICATION_CONTENT.ar.activeChangeStatus
                : NOTIFICATION_CONTENT.en.blockChangeStatus,
          },
          title: {
            en:
              data?.user?.status == CLIENT_ACTIVE_STATUS
                ? NOTIFICATION_CONTENT.en.activeChangeStatus
                : NOTIFICATION_CONTENT.en.blockChangeStatus,
            ar:
              data?.user?.status == CLIENT_ACTIVE_STATUS
                ? NOTIFICATION_CONTENT.ar.activeChangeStatus
                : NOTIFICATION_CONTENT.en.blockChangeStatus,
          },
          oneSignalId: notified.body.id,
        });

        await this.clientGateWay.emitChangeStatusNotificationEvent(notificationCreated);
      }
      done(null, true);
    } catch (error) {
      this.logger.error(error);
      done(error, false);
    }
  }
}
