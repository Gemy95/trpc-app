import { BranchGroup } from '../../../models';

const branchGroup = {
  _id: '63d3bebd02a728dd0f298ed3',
  name: 'gazera group',
  location: {
    type: 'Point',
    coordinates: [-73.99279, 40.719296],
  },
  translation: [
    {
      _lang: 'en',
      name: 'gazera en',
    },
  ],
  city: '6345ef831a22a0b661b37e9c',
  createdAt: '',
  updatedAt: '',
  __v: 0,
};

export const branchGroupStub = (): BranchGroup => {
  return branchGroup;
};

export const createStub = (): BranchGroup => {
  return branchGroup;
};

export const findAllStub = (): { page: 1; pages: number; length: number; branchgroups: [BranchGroup] } => {
  return {
    page: 1,
    pages: 2,
    length: 10,
    branchgroups: [branchGroup],
  };
};

export const findOneStub = (): BranchGroup => {
  return branchGroup;
};

export const updateOneStub = (): BranchGroup => {
  return branchGroup;
};

export const removeStub = (): BranchGroup => {
  return branchGroup;
};
