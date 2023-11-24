import { Test, TestingModule } from '@nestjs/testing';
import {
  menuTemplateProductGroupStub,
  createStub,
  findAllStub,
  findOneStub,
  updateOneStub,
  removeStub,
} from './stubs/menu-template-product-group.stub';
import { MenuTemplateProductGroupResolver } from '../menu-template-product-group.resolver';
import { MenuTemplateProductGroupService } from '../menu-template-product-group.service';
import { UpdateMenuTemplateProductGroupDto } from '../dto/update-menu-template-product-group.dto';
import { CreateMenuTemplateProductGroupDto } from '../dto/create-menu-template-product-group.dto';
import { FindAllMenuTemplateProductGroupDto } from '../dto/findAll-menu-template-product-group.dto';

jest.mock('../menu-template-product-group.service.ts');

describe('MenuTemplateProductGroupResolver', () => {
  let menuTemplateProductGroupResolver: MenuTemplateProductGroupResolver;
  let menuTemplateProductGroupService: MenuTemplateProductGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MenuTemplateProductGroupResolver, MenuTemplateProductGroupService],
    }).compile();

    menuTemplateProductGroupResolver = module.get<MenuTemplateProductGroupResolver>(MenuTemplateProductGroupResolver);
    menuTemplateProductGroupService = module.get<MenuTemplateProductGroupService>(MenuTemplateProductGroupService);
    jest.clearAllMocks();
  });

  describe('Create', () => {
    describe('Once Create is called', () => {
      let createMenuTemplateProductGroupDto: CreateMenuTemplateProductGroupDto;
      let menuTemplateProductGroup;

      beforeEach(async () => {
        menuTemplateProductGroup = await menuTemplateProductGroupService.create(createMenuTemplateProductGroupDto);
      });

      it('Should call menuTemplateProductGroupService', () => {
        expect(menuTemplateProductGroupService.create).toHaveBeenCalledWith(createMenuTemplateProductGroupDto);
      });

      it('Should return created menuTemplateProductGroup', () => {
        expect(menuTemplateProductGroup).toEqual(createStub());
      });
    });
  });

  describe('findAll', () => {
    describe('Once findAll is called', () => {
      let menuTemplateProductGroups;
      let query: FindAllMenuTemplateProductGroupDto;
      beforeEach(async () => {
        menuTemplateProductGroups = await menuTemplateProductGroupResolver.findAll(query);
      });

      it('Should call menuTemplateProductGroupService', () => {
        expect(menuTemplateProductGroupService.getAll).toBeCalledWith(query);
      });

      it('Should return menuTemplateProductGroup details', () => {
        expect(menuTemplateProductGroups).toEqual(findAllStub());
      });
    });
  });

  describe('findOne', () => {
    describe('Once findOne is called', () => {
      let bank;
      beforeEach(async () => {
        bank = await menuTemplateProductGroupResolver.findOne(menuTemplateProductGroupStub()._id);
      });

      it('Should call menuTemplateProductGroupService', () => {
        expect(menuTemplateProductGroupService.findOne).toBeCalledWith(menuTemplateProductGroupStub()._id);
      });

      it('Should return bank details', () => {
        expect(bank).toEqual(findOneStub());
      });
    });
  });

  describe('updateOne', () => {
    describe('Once updateOne is called', () => {
      let menuTemplateProductGroup;
      let updateMenuTemplateProductGroupDto: UpdateMenuTemplateProductGroupDto;
      beforeEach(async () => {
        menuTemplateProductGroup = await menuTemplateProductGroupResolver.update(
          menuTemplateProductGroupStub()._id,
          updateMenuTemplateProductGroupDto,
        );
      });

      it('Should call menuTemplateProductGroupService', () => {
        expect(menuTemplateProductGroupService.updateOne).toBeCalledWith(
          menuTemplateProductGroupStub()._id,
          updateMenuTemplateProductGroupDto,
        );
      });

      it('Should return updated menuTemplateProductGroup', () => {
        expect(menuTemplateProductGroup).toEqual(updateOneStub());
      });
    });
  });

  describe('remove', () => {
    describe('Once remove is called', () => {
      let menuTemplateProductGroup;

      beforeEach(async () => {
        menuTemplateProductGroup = await menuTemplateProductGroupResolver.deleteOne(menuTemplateProductGroupStub()._id);
      });

      it('Should call menuTemplateProductGroupService', () => {
        expect(menuTemplateProductGroupService.deleteOne).toBeCalledWith(menuTemplateProductGroupStub()._id);
      });

      it('Should delete menuTemplateProductGroup', () => {
        expect(menuTemplateProductGroup).toEqual(removeStub());
      });
    });
  });
});

// nx test --test-file menu-template-product-group.resolver.spec.ts
