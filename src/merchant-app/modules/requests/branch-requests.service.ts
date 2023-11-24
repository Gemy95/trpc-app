import { InjectQueue } from '@nestjs/bull';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Queue } from 'bull';
import { Types } from 'mongoose';

import { ERROR_CODES } from '../../../libs/utils/src';
import { BRANCH_REQUEST_TYPES, BRANCH_RESERVATION_STATUS, BRANCH_STATUS } from '../common/constants/branch.constants';
import {
  BRANCH_APPROVAL_REQUEST_NOTIFICATION_PROCESS,
  NOTIFICATION_QUEUE,
  REQUEST_NOTIFICATION_PROCESS,
} from '../common/constants/queue.constants';
import { REQUEST_EVENT_ROOM } from '../common/constants/socket.constants';
import { MailService } from '../mail/mail.service';
import { Branch, BranchRepository, CityRepository, ReviewRepository } from '../models';
import { NotificationService } from '../notification/notification.service';
import { ProductService } from '../product/product.service';
import { OperationDepartmentsGateWay } from '../socket/department.socket.gateway';
import { BranchApproveOrRejectDto } from './dto/branch-approve-or-reject.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Injectable()
export class BranchRequestsService {
  constructor(
    @InjectQueue(NOTIFICATION_QUEUE) private readonly notificationQueue: Queue,
    private branchRepository: BranchRepository,
    private reviewRepository: ReviewRepository,
    private cityRepository: CityRepository,
    private readonly operationDepartmentsGateWay: OperationDepartmentsGateWay,
    private readonly notificationService: NotificationService,
    private mailService: MailService,
    private readonly productService: ProductService,
  ) {}

  findOne(branchId: string, branchRequestType: BRANCH_REQUEST_TYPES) {
    return this.reviewRepository.getOne({ reference: new Types.ObjectId(branchId), branchRequestType });
  }

  async create(branchId: string, branchRequestType: BRANCH_REQUEST_TYPES, updateBranchDto: UpdateBranchDto, user: any) {
    const { _id } = user;

    const branch = await this.branchRepository.getOne({
      _id: new Types.ObjectId(branchId),
      isDeleted: false,
    });

    if (!branch) {
      throw new NotFoundException(ERROR_CODES.err_branch_not_found);
    }

    if (branchRequestType == BRANCH_REQUEST_TYPES.RESERVATION) {
      const city = await this.cityRepository.getOne({
        _id: new Types.ObjectId(branch.cityId.toString()),
        isDeleted: false,
      });

      if (!city) {
        throw new NotFoundException(ERROR_CODES.err_city_not_found);
      }

      if (!city.isEnabledReservation) {
        throw new BadRequestException(ERROR_CODES.err_city_not_enabled_reservation);
      }
    }

    const data = {
      updatedBy: new Types.ObjectId(_id),
      modelName: Branch.name,
      reference: branch._id,
      ...updateBranchDto,
      branchRequestType,
    };

    const updateRequestExist = await this.reviewRepository.getOne({
      reference: branch._id,
      branchRequestType,
    });

    if (updateRequestExist)
      throw new ConflictException(ERROR_CODES.err_already_exists.replace('{{item}}', 'update_request'));

    await this.branchRepository.updateOne(
      {
        _id: new Types.ObjectId(branchId),
      },
      {
        inReview: true,
      },
    );

    await this.reviewRepository._model.create(data);

    const [createdRequest] = await this.findReviewData(branch._id.toString(), branchRequestType);

    if (!createdRequest) throw new BadRequestException(ERROR_CODES.err_failed_to_create_request);

    await this.notificationQueue.add(REQUEST_NOTIFICATION_PROCESS, createdRequest, {
      attempts: 3,
    });

    return createdRequest;
  }

  async createPublishBranchesRequests(branchesIds: string[], user: any) {
    try {
      const { _id } = user;

      await Promise.all(
        branchesIds?.map(async (branchId) => {
          const branch = await this.branchRepository.getOne({
            _id: new Types.ObjectId(branchId),
            isDeleted: false,
          });

          if (!branch) {
            throw ERROR_CODES.err_branch_not_found;
          }

          const updateRequestExist = await this.reviewRepository.getOne({
            reference: new Types.ObjectId(branchId),
            branchRequestType: BRANCH_REQUEST_TYPES.PUBLISH,
          });
          if (updateRequestExist) throw ERROR_CODES.err_already_exists.replace('{{item}}', 'update_request');
        }),
      );

      await Promise.all(
        branchesIds?.map(async (branchId) => {
          const data = {
            updatedBy: new Types.ObjectId(_id),
            modelName: Branch.name,
            reference: new Types.ObjectId(branchId),
            branchRequestType: BRANCH_REQUEST_TYPES.PUBLISH,
          };

          await this.branchRepository.updateOne(
            {
              _id: new Types.ObjectId(branchId),
            },
            {
              inReview: true,
            },
          );

          await this.reviewRepository._model.create(data);

          const [createdRequest] = await this.findReviewData(branchId, BRANCH_REQUEST_TYPES.PUBLISH);

          if (!createdRequest) throw ERROR_CODES.err_failed_to_create_request;

          await this.notificationQueue.add(REQUEST_NOTIFICATION_PROCESS, createdRequest, {
            attempts: 3,
          });
        }),
      );
      return { success: true };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(
    requestId: string,
    branchId: string,
    branchRequestType: BRANCH_REQUEST_TYPES,
    updateBranchDto: UpdateBranchDto,
    user: any,
  ) {
    // this for branch only
    const { _id } = user;

    const branch = await this.branchRepository.getOne({
      _id: new Types.ObjectId(branchId),
      isDeleted: false,
    });

    if (!branch) {
      throw new NotFoundException(ERROR_CODES.err_branch_not_found);
    }

    const updateRequestExist = await this.reviewRepository.exists({
      _id: new Types.ObjectId(requestId),
      reference: new Types.ObjectId(branchId),
      branchRequestType: branchRequestType,
    });

    if (!updateRequestExist) throw new NotFoundException(ERROR_CODES.err_request_not_found);

    const data = {
      updatedBy: new Types.ObjectId(_id),
      modelName: Branch.name,
      reference: branch._id,
      ...updateBranchDto,
      branchRequestType,
    };

    await this.reviewRepository._model.updateOne(
      {
        _id: new Types.ObjectId(requestId),
        reference: new Types.ObjectId(branchId),
        branchRequestType,
      },
      data,
    );

    const [updatedRequest] = await this.findReviewData(branch._id, branchRequestType);

    if (!updatedRequest) throw new BadRequestException(ERROR_CODES.err_failed_to_update.replace('{{item}}', 'request'));
    await this.operationDepartmentsGateWay.emitOperationEvent(
      { room: REQUEST_EVENT_ROOM, name: 'update' },
      updatedRequest,
    );
    return updatedRequest;
  }

  async approveOrReject(
    user: any,
    branchId: string,
    branchRequestType: BRANCH_REQUEST_TYPES,
    changeStatusDto: BranchApproveOrRejectDto,
  ) {
    const { status, status_tags, notes } = changeStatusDto;

    const branch = await this.branchRepository.getOne(
      {
        _id: new Types.ObjectId(branchId),
        inReview: true,
      },
      {
        populate: [{ path: 'ownerId', select: 'name email' }],
      },
    );

    if (!branch) throw new NotFoundException(ERROR_CODES.err_request_not_found);

    const [reviewData] = await this.findReviewData(branch._id, branchRequestType);

    if (!reviewData) throw new NotFoundException(ERROR_CODES.err_request_not_found);

    if (branchRequestType == BRANCH_REQUEST_TYPES.RESERVATION) {
      await this.branchRepository.updateOne(
        {
          _id: new Types.ObjectId(branchId),
          inReview: true,
        },
        {
          inReview: false,
          reservation_status:
            status == BRANCH_STATUS.APPROVED_STATUS
              ? BRANCH_RESERVATION_STATUS.APPROVED_STATUS
              : BRANCH_RESERVATION_STATUS.REJECTED_STATUS,
        },
      );
      return { success: true };
    }

    if (status == BRANCH_STATUS.PENDING_STATUS) {
      await Promise.all([
        this.branchRepository.updateOne(
          {
            _id: new Types.ObjectId(branchId),
            inReview: true,
          },
          { inReview: true, status: status, status_tags: status_tags },
        ),
      ]);
      return { success: true };
    } else if (status == BRANCH_STATUS.REJECTED_STATUS || status == BRANCH_STATUS.BANNED_STATUS) {
      await Promise.all([
        this.branchRepository.updateOne(
          {
            _id: new Types.ObjectId(branchId),
            inReview: true,
          },
          { inReview: false, tatus: status, status_tags: status_tags },
        ),
        this.reviewRepository._model.deleteOne({
          modelName: Branch.name,
          reference: new Types.ObjectId(branchId),
        }),
        this.mailService.rejectEmail(notes, { branch }),
      ]);

      await this.notificationQueue.add(
        BRANCH_APPROVAL_REQUEST_NOTIFICATION_PROCESS,
        { branch, reviewData, actionType: 'rejected', notes },
        {
          attempts: 3,
        },
      );

      return { success: true };
    } else {
      const updateBranch = new Branch();
      updateBranch.approvedBy = new Types.ObjectId(user._id);
      updateBranch.inReview = false;
      updateBranch.reservation_status = status;
      updateBranch.reservationsDays = reviewData.reservationsDays;
      updateBranch.reservationsSettings = reviewData.reservationsSettings;
      updateBranch.status = status;
      updateBranch.status_tags = status_tags;

      const [updatedBranch, reviewDeleted] = await Promise.all([
        this.branchRepository.updateOne(
          {
            _id: new Types.ObjectId(branchId),
            inReview: true,
          },
          updateBranch,
        ),
        await this.reviewRepository._model.deleteOne({
          modelName: Branch.name,
          reference: new Types.ObjectId(branchId),
        }),
      ]);

      if (reviewData && reviewData.products) {
        if (reviewData.products === 'all') {
          await this.productService.addBranch(updatedBranch.merchantId.toString(), updatedBranch._id.toString());
        } else {
          await this.productService.addBranch(
            updatedBranch.merchantId.toString(),
            updatedBranch._id.toString(),
            reviewData.products,
          );
        }
      }

      await this.notificationQueue.add(
        BRANCH_APPROVAL_REQUEST_NOTIFICATION_PROCESS,
        { branch, reviewData, actionType: 'approved' },
        {
          attempts: 3,
        },
      );

      return {
        success: true,
        updatedBranch,
        requestRemoved: reviewDeleted.acknowledged,
      };
    }
  }

  async remove(requestId: string, branchRequestType: BRANCH_REQUEST_TYPES) {
    const request = await this.reviewRepository.getOne({ _id: new Types.ObjectId(requestId), branchRequestType });
    const removed = await this.reviewRepository.deleteOne({
      _id: new Types.ObjectId(requestId),
      branchRequestType,
    });
    if (!removed) throw new BadRequestException(ERROR_CODES.err_failed_to_delete.replace('{{item}}', 'request'));
    await this.branchRepository.updateOne({ _id: request.reference }, { inReview: false });
    await this.operationDepartmentsGateWay.emitOperationEvent(
      { room: REQUEST_EVENT_ROOM, name: 'cancel' },
      {
        _id: request._id,
      },
    );
    return { success: true };
  }

  private async findReviewData(branchId, branchRequestType: BRANCH_REQUEST_TYPES) {
    return this.reviewRepository._model.aggregate([
      {
        $match: {
          reference: new Types.ObjectId(branchId),
          branchRequestType,
        },
      },
      {
        $lookup: {
          from: 'branches',
          let: { localbranch: '$reference' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$$localbranch', '$_id'] }],
                },
              },
            },
            {
              $lookup: {
                from: 'cities',
                localField: 'cityId',
                foreignField: '_id',
                as: 'cityId',
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                search: 1,
                mobile: 1,
                address: 1,
                cityId: 1,
                merchantId: 1,
                ownerId: 1,
                uuid: 1,
                visibleToClients: 1,
                status: 1,
                status_tags: 1,
                visibility_status: 1,
                notes: 1,
                isFreezing: 1,
                location: 1,
                locationDelta: 1,
                workingHours: 1,
                reservationHours: 1,
                reservationsInstructions: 1,
                pickupInstructions: 1,
                deliveryInstructions: 1,
                translation: 1,
                isDeleted: 1,
                client_visits: 1,
                createdAt: 1,
                updatedAt: 1,
                reservation_status: 1,
                inRview: 1,
                reservationsDays: 1,
                reservationsSettings: 1,
                products: 1,
                branchRequestType: 1,
              },
            },
          ],
          as: 'reference',
        },
      },
      {
        $unwind: '$reference',
      },
    ]);
  }
}
