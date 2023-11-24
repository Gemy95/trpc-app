import { Injectable } from '@nestjs/common';

import { ERROR_CODES } from '../../../libs/utils/src';
import { OnBoardingRepository } from '../models';
import {
  CreateOnBoardingDto,
  CreateOnBoardingStepDto,
  QueryBoardingDto,
  RemoveBoardingStepsDto,
  UpdateOnBoardingDto,
} from './dtos/onboarding.dto';

@Injectable()
export class OnBoardingService {
  constructor(private onBoardingRepo: OnBoardingRepository) {}

  async create(body: CreateOnBoardingDto) {
    const { for_type, steps } = body;
    if (steps.length > 4) {
      return { message: ERROR_CODES.boarding_steps_must_be_4_or_less, success: false };
    }
    try {
      const result = await this.onBoardingRepo.create({ for_type, steps });
      return result;
    } catch (err) {
      if (err?.code === 11000) {
        return { message: ERROR_CODES.boarding_enum_already_exist, success: false };
      } else {
        return { message: ERROR_CODES.unknow_error, success: false };
      }
    }
  }

  async update(_id: string, data: UpdateOnBoardingDto) {
    try {
      const foundResult = await this.onBoardingRepo.findOne({ _id });
      if (!foundResult) {
        return { message: ERROR_CODES.boarding_not_found_with_this_id, success: false };
      }
      const { steps } = foundResult;
      const { steps: newSteps } = data;
      const updatedSteps = [...steps];

      for (let index1 = 0; index1 < updatedSteps.length; index1++) {
        for (let index2 = 0; index2 < newSteps.length; index2++) {
          if (updatedSteps[index1].stepNum === newSteps[index2].stepNum) {
            updatedSteps[index1] = { ...updatedSteps[index1], ...newSteps[index2] };
            if (newSteps[index2].translation) {
              updatedSteps[index1].translation.forEach((translateItem, translateIndex) => {
                newSteps[index2].translation.forEach((newTranslateItem) => {
                  if (translateItem._lang === newTranslateItem._lang) {
                    updatedSteps[index1].translation[translateIndex] = {
                      ...translateItem,
                      ...newTranslateItem,
                    };
                  }
                });
              });
            }
          } else {
            const isExists = updatedSteps.some((ele) => {
              return ele.stepNum == newSteps[index2].stepNum;
            });
            if (newSteps.length - 1 == index2 && !isExists) {
              updatedSteps.push(newSteps[index2]);
            }
          }
        }
      }

      // updatedSteps.forEach((step: CreateOnBoardingStepDto, index: number) => {
      //   newSteps.forEach((newStep: CreateOnBoardingStepDto, index2: number) => {
      //     if (step.stepNum === newStep.stepNum) {
      //       updatedSteps[index] = { ...step, ...newStep };
      //       if (newStep.translation) {
      //         step.translation.forEach((translateItem, translateIndex) => {
      //           newStep.translation.forEach(newTranslateItem => {
      //             if (translateItem._lang === newTranslateItem._lang) {
      //               updatedSteps[index].translation[translateIndex] = {
      //                 ...translateItem,
      //                 ...newTranslateItem,
      //               };
      //             }
      //           });
      //         });
      //       }
      //     }
      //   });
      // });

      return this.onBoardingRepo.update({ _id }, { steps: updatedSteps });
    } catch (error) {
      console.log('---> error', error);
      return { err: error?.message ?? JSON.stringify(error), message: ERROR_CODES.unknow_error, success: false };
    }
  }

  async get({ for_type }: QueryBoardingDto) {
    const res = await this.onBoardingRepo.find(for_type ? { for_type } : {});
    return res;
  }

  async remove(_id: string, removeSteps: RemoveBoardingStepsDto) {
    try {
      const foundResult = await this.onBoardingRepo.findOne({ _id });
      if (!foundResult) {
        return { message: ERROR_CODES.boarding_not_found_with_this_id, success: false };
      }
      const { steps } = foundResult;
      if (!removeSteps.steps || removeSteps.steps.length === 0) {
        return this.onBoardingRepo.remove({ _id });
      }
      const { steps: stepsToRemove } = removeSteps;
      const updatedSteps: any = [...steps];
      steps.forEach((step: CreateOnBoardingStepDto & { shouldRemove: boolean }, index: number) => {
        stepsToRemove.forEach((stepToRemove: CreateOnBoardingStepDto & { shouldRemove: boolean }) => {
          if (step.stepNum === stepToRemove.stepNum) {
            updatedSteps[index] = { ...step, shouldRemove: true };
          }
        });
      });
      const filtered = updatedSteps.filter((step: any) => !step.shouldRemove);
      if (filtered.length === 0) {
        this.onBoardingRepo.remove({ _id });
      } else {
        return this.onBoardingRepo.update({ _id }, { steps: filtered });
      }
    } catch (error) {
      return { err: error?.message ?? JSON.stringify(error), message: ERROR_CODES.unknow_error, success: false };
    }
  }
}
