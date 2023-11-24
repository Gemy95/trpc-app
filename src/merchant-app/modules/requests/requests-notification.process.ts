import { OnQueueActive, OnQueueError, Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bull';
import mongoose from 'mongoose';
import { Client } from 'onesignal-node';

import { REQUEST_EVENT_ROOM } from '../../../libs/realtime/src';
import { REQUEST_ACTION } from '../common/constants/notification.constant';
import { NOTIFICATION_CONTENT } from '../common/constants/notification.content.constant';
import {
  BRANCH_APPROVAL_REQUEST_NOTIFICATION_PROCESS,
  MERCHANT_APPROVAL_REQUEST_NOTIFICATION_PROCESS,
  NOTIFICATION_QUEUE,
  PRODUCT_APPROVAL_REQUEST_NOTIFICATION_PROCESS,
  REQUEST_NOTIFICATION_PROCESS,
} from '../common/constants/queue.constants';
import { BranchRepository } from '../models';
import { NotificationService } from '../notification/notification.service';
import { OperationDepartmentsGateWay } from '../socket/department.socket.gateway';
import { MerchantGateWay } from '../socket/merchant.gateway';

@Processor(NOTIFICATION_QUEUE)
export class RequestProcess {
  constructor(
    @Inject('MERCHANT_ONESIGNAL') private readonly merchantOneSignal: Client,
    @Inject('ADMIN_ONESIGNAL') private readonly operationOneSignal: Client,
    private readonly operationDepartmentsGateWay: OperationDepartmentsGateWay,
    private readonly notificationService: NotificationService,
    private readonly branchRepository: BranchRepository,
    private readonly merchantGateWay: MerchantGateWay,
  ) {}

  private logger = new Logger(RequestProcess.name);

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(`Processing job ${job.id} of type ${job.name} with data ${job.data}...`);
  }

  @OnQueueError()
  onError(error) {
    this.logger.error(error);
  }

  @Process(REQUEST_NOTIFICATION_PROCESS)
  async handleCreatedRequest(job: Job, done) {
    try {
      const { data } = job.toJSON();
      await this.operationDepartmentsGateWay.emitOperationEvent({ room: REQUEST_EVENT_ROOM, name: 'create' }, data);
      const notified = await this.operationOneSignal.createNotification({
        included_segments: ['Subscribed Users', 'Active Users'],
        contents: {
          en: NOTIFICATION_CONTENT.en.requestCreated,
          ar: NOTIFICATION_CONTENT.ar.requestCreated,
        },
        data: {
          requestId: data._id,
        },
      });
      if (notified.statusCode === 200 && notified.body?.recipients >= 1) {
        const merchant =
          data?.modelName == 'Product' || data?.modelName == 'Branch'
            ? data?.reference?.merchantId
            : data?.reference?._id;
        const notificationCreated = await this.notificationService.systemSentNotifications({
          merchant: merchant,
          action: REQUEST_ACTION,
          target: data._id,
          content: {
            en: NOTIFICATION_CONTENT.en.requestCreated,
            ar: NOTIFICATION_CONTENT.ar.requestCreated,
          },
          title: {
            en: NOTIFICATION_CONTENT.en.requestCreated,
            ar: NOTIFICATION_CONTENT.ar.requestCreated,
          },
          oneSignalId: notified.body.id,
        });

        const { reference, ...target } = data;
        const newNotification = {};
        newNotification['target'] = target;
        newNotification['target']['reference'] = reference?._id;

        await this.operationDepartmentsGateWay.emitNotificationEvent({
          ...notificationCreated?.['_doc'],
          ...newNotification,
        });
      }
      done(null, true);
    } catch (error) {
      this.logger.error(error);
      done(error, false);
    }
  }

  @Process(PRODUCT_APPROVAL_REQUEST_NOTIFICATION_PROCESS)
  async handleRequestApprovalProduct(job: Job, done) {
    try {
      const { product, review, actionType, notes } = job.toJSON().data;

      await Promise.all(
        product?.branchesIds?.map(async (branch) => {
          const notificationCreated = await this.notificationService.systemSentNotifications({
            branch: branch.toString(),
            merchant: product?.merchantId?._id.toString(),
            action: REQUEST_ACTION,
            target: review?._id,
            content: {
              en:
                actionType == 'approved'
                  ? NOTIFICATION_CONTENT.en.approvedProduct
                  : NOTIFICATION_CONTENT.en.rejectedProduct,
              ar:
                actionType == 'approved'
                  ? NOTIFICATION_CONTENT.ar.approvedProduct
                  : NOTIFICATION_CONTENT.ar.rejectedProduct,
            },
            title: {
              en:
                actionType == 'approved'
                  ? NOTIFICATION_CONTENT.en.approvedProduct
                  : NOTIFICATION_CONTENT.en.rejectedProduct,
              ar:
                actionType == 'approved'
                  ? NOTIFICATION_CONTENT.ar.approvedProduct
                  : NOTIFICATION_CONTENT.ar.rejectedProduct,
            },
            useOneSignal: false,
            notes,
            product: product?._id?.toString(),
          });
          await this.merchantGateWay.emitNotificationEvent(notificationCreated);
        }),
      );
      done(null, true);
    } catch (error) {
      this.logger.error(error);
      done(error, false);
    }
  }

  @Process(MERCHANT_APPROVAL_REQUEST_NOTIFICATION_PROCESS)
  async handleRequestApprovalMerchant(job: Job, done) {
    try {
      const { merchant, reviewData, actionType, notes } = job.toJSON().data;
      const branches = await this.branchRepository._model.find({
        merchantId: new mongoose.Types.ObjectId(merchant._id),
      });
      if (branches?.length > 0) {
        await Promise.all(
          branches?.map(async (branch) => {
            const notificationCreated = await this.notificationService.systemSentNotifications({
              branch: branch._id.toString(),
              merchant: merchant?._id.toString(),
              action: REQUEST_ACTION,
              target: reviewData?._id,
              content: {
                en:
                  actionType == 'approved'
                    ? NOTIFICATION_CONTENT.en.approvedMerchant
                    : NOTIFICATION_CONTENT.en.rejectedMerchant,
                ar:
                  actionType == 'approved'
                    ? NOTIFICATION_CONTENT.ar.approvedMerchant
                    : NOTIFICATION_CONTENT.ar.rejectedMerchant,
              },
              title: {
                en:
                  actionType == 'approved'
                    ? NOTIFICATION_CONTENT.en.approvedMerchant
                    : NOTIFICATION_CONTENT.en.rejectedMerchant,
                ar:
                  actionType == 'approved'
                    ? NOTIFICATION_CONTENT.ar.approvedMerchant
                    : NOTIFICATION_CONTENT.ar.rejectedMerchant,
              },
              useOneSignal: false,
              notes,
            });
            await this.merchantGateWay.emitNotificationEvent(notificationCreated);
          }),
        );
      } else {
        const notificationCreated = await this.notificationService.systemSentNotifications({
          merchant: merchant?._id.toString(),
          action: REQUEST_ACTION,
          target: reviewData?._id.toString(),
          content: {
            en:
              actionType == 'approved'
                ? NOTIFICATION_CONTENT.en.approvedMerchant
                : NOTIFICATION_CONTENT.en.rejectedMerchant,
            ar:
              actionType == 'approved'
                ? NOTIFICATION_CONTENT.ar.approvedMerchant
                : NOTIFICATION_CONTENT.ar.rejectedMerchant,
          },
          title: {
            en:
              actionType == 'approved'
                ? NOTIFICATION_CONTENT.en.approvedMerchant
                : NOTIFICATION_CONTENT.en.rejectedMerchant,
            ar:
              actionType == 'approved'
                ? NOTIFICATION_CONTENT.ar.approvedMerchant
                : NOTIFICATION_CONTENT.ar.rejectedMerchant,
          },
          useOneSignal: false,
          notes,
        });
        await this.merchantGateWay.emitNotificationEventForOwner(
          notificationCreated,
          merchant?.ownerId?._id.toString(),
        );
      }
      done(null, true);
    } catch (error) {
      this.logger.error(error);
      done(error, false);
    }
  }

  @Process(BRANCH_APPROVAL_REQUEST_NOTIFICATION_PROCESS)
  async handleRequestApprovalBranch(job: Job, done) {
    try {
      const { branch, reviewData, actionType, notes } = job.toJSON().data;

      const notificationCreated = await this.notificationService.systemSentNotifications({
        branch: branch?._id.toString(),
        action: REQUEST_ACTION,
        target: reviewData?._id.toString(),
        content: {
          en:
            actionType == 'approved' ? NOTIFICATION_CONTENT.en.approvedBranch : NOTIFICATION_CONTENT.en.rejectedBranch,
          ar:
            actionType == 'approved' ? NOTIFICATION_CONTENT.ar.approvedBranch : NOTIFICATION_CONTENT.ar.rejectedBranch,
        },
        title: {
          en:
            actionType == 'approved' ? NOTIFICATION_CONTENT.en.approvedBranch : NOTIFICATION_CONTENT.en.rejectedBranch,
          ar:
            actionType == 'approved' ? NOTIFICATION_CONTENT.ar.approvedBranch : NOTIFICATION_CONTENT.ar.rejectedBranch,
        },
        useOneSignal: false,
        notes,
      });
      await this.merchantGateWay.emitNotificationEventForOwner(notificationCreated, branch?.ownerId?._id.toString());
      done(null, true);
    } catch (error) {
      this.logger.error(error);
      done(error, false);
    }
  }
}
