import { TestingModule, Test } from '@nestjs/testing';
import { CreateProductGroupDto } from '../dto/create-product-group.dto';
import { GetAllProductGroupDto } from '../dto/get-product-group.dto';
import { UpdateProductGroupDto } from '../dto/update-product-group.dto';
import { ProductGroupController } from '../product-group.controller';
import { ProductGroupService } from '../product-group.service';
import {
  createStub,
  findAllStub,
  findOneStub,
  productGroupStub,
  removeStub,
  updateStub,
} from '../test/stubs/product-group.stub';

jest.mock('../product-group.service.ts');

describe('ProductGroupController', () => {
  let productGroupController: ProductGroupController;
  let productGroupService: ProductGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductGroupController],
      providers: [ProductGroupService],
    }).compile();

    productGroupController = module.get<ProductGroupController>(ProductGroupController);
    productGroupService = module.get<ProductGroupService>(ProductGroupService);
    jest.clearAllMocks();
  });

  describe('Create', () => {
    describe('Once Create is called', () => {
      let createProductGroupDto: CreateProductGroupDto;
      let productGroup;

      beforeEach(async () => {
        productGroup = await productGroupController.create(
          productGroupStub().merchantId.toString(),
          createProductGroupDto,
        );
      });

      it('Should call productGroupService', () => {
        expect(productGroupService.create).toHaveBeenCalledWith(productGroupStub().merchantId, createProductGroupDto);
      });

      it('Should return created productGroup', () => {
        expect(productGroup).toEqual(createStub());
      });
    });
  });

  describe('findAll', () => {
    describe('Once findAll is called', () => {
      let productGroups;
      let getAllProductGroupsDto: GetAllProductGroupDto;

      beforeEach(async () => {
        productGroups = await productGroupController.findAll(
          productGroupStub().merchantId.toString(),
          getAllProductGroupsDto,
        );
      });

      it('Should call productGroupService', () => {
        expect(productGroupService.findAll).toHaveBeenCalledWith(productGroupStub().merchantId, getAllProductGroupsDto);
      });

      it('Should return created productGroup', () => {
        expect(productGroups).toEqual(findAllStub());
      });
    });
  });

  describe('findOne', () => {
    describe('Once findOne is called', () => {
      let productGroup;

      beforeEach(async () => {
        productGroup = await productGroupController.findOne(
          productGroupStub().merchantId.toString(),
          productGroupStub()._id,
        );
      });

      it('Should call productGroupService', () => {
        expect(productGroupService.findOne).toHaveBeenCalledWith(productGroupStub().merchantId, productGroupStub()._id);
      });

      it('Should return getOne productGroup', () => {
        expect(productGroup).toEqual(findOneStub());
      });
    });
  });

  describe('update', () => {
    describe('Once update is called', () => {
      let productGroup;
      let updateProductGroupDto: UpdateProductGroupDto;

      beforeEach(async () => {
        productGroup = await productGroupController.update(
          productGroupStub().merchantId.toString(),
          productGroupStub()._id,
          updateProductGroupDto,
        );
      });

      it('Should call productGroupService', () => {
        expect(productGroupService.update).toBeCalledWith(
          productGroupStub().merchantId,
          productGroupStub()._id,
          updateProductGroupDto,
        );
      });

      it('Should return productGroup details', () => {
        expect(productGroup).toEqual(updateStub());
      });
    });
  });

  describe('remove', () => {
    describe('Once remove One is called', () => {
      let productGroup;

      beforeEach(async () => {
        productGroup = await productGroupController.remove(
          productGroupStub().merchantId.toString(),
          productGroupStub()._id,
        );
      });

      it('Should call productGroupService', () => {
        expect(productGroupService.remove).toBeCalledWith(productGroupStub().merchantId, productGroupStub()._id);
      });

      it('Should return productGroup details', () => {
        expect(productGroup).toEqual(removeStub());
      });
    });
  });
});

// sudo nx test --test-file product-group.controller.spec.ts
