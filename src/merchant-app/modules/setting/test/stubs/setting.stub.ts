import { Setting } from '../../../models';

const distance = {
  _id: '631b5cf00b54c9153c8dce73',
  minDistance: 0,
  maxDistance: 35000,
  modelName: 'Branch',
  createdAt: new Date(),
  updatedAt: new Date(),
  __v: 0,
};

export const distanceStub = (): Setting => {
  return distance;
};

export const createStub = (): Setting => {
  return distance;
};

export const updateStub = (): Setting => {
  return distance;
};

export const deleteOneStub = (): { message: string } => {
  return { message: 'Setting Deleted Successfully' };
};
