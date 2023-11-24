import { MenuTemplateProductGroup } from '../../../models';

const menuTemplateProductGroup = {
  _id: '63e6b5ca685c60b5ac13a7f2',
  name: 'shata ar',
  minimum: 3,
  maximum: 1,
  options: [
    {
      name: 'tom ar',
      extraPrice: 1,
      serialDisplayNumber: 1,
      translation: [
        {
          _lang: 'en',
          name: 'tom en',
          _id: '63e6b5ca685c60b5ac13a7f4',
        },
      ],
      _id: '63e6b5ca685c60b5ac13a7f3',
    },
  ],
  translation: [
    {
      _lang: 'en',
      name: 'shata en',
      createdAt: '',
      updatedAt: '',
    },
  ],
  required: true,
  status: 'active',
  isDeleted: false,
  createdAt: '',
  updatedAt: '',
  merchantId: '',
  serialDisplayNumber: 1,
  __v: 0,
};

export const menuTemplateProductGroupStub = (): MenuTemplateProductGroup => {
  return menuTemplateProductGroup;
};

export const createStub = (): MenuTemplateProductGroup => {
  return menuTemplateProductGroup;
};

export const findAllStub = (): {
  page: 1;
  pages: number;
  length: number;
  menutemplateproductgroups: [MenuTemplateProductGroup];
} => {
  return {
    page: 1,
    pages: 2,
    length: 10,
    menutemplateproductgroups: [menuTemplateProductGroup],
  };
};

export const findOneStub = (): MenuTemplateProductGroup => {
  return menuTemplateProductGroup;
};

export const updateOneStub = (): MenuTemplateProductGroup => {
  return menuTemplateProductGroup;
};

export const removeStub = (): MenuTemplateProductGroup => {
  return menuTemplateProductGroup;
};
