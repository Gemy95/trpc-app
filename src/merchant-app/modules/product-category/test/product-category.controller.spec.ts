import { TestingModule, Test } from '@nestjs/testing';
import { ProductCategoryQueryDto } from '../dto/product-category-query.dto';
import { CreateProductCategoryDto } from '../dto/product-category.dto';
import { ReorderSerialNumberDto } from '../dto/reorder-category-serial.dto';
import { UpdateProductCategoryDto } from '../dto/update-product-category.dto';
import { ProductCategoryController } from '../product-category.controller';
import { ProductCategoryService } from '../product-category.service';
import {
  createStub,
  getAllStub,
  getOneStub,
  productCategoryStub,
  removeStub,
  reOrderSerialNumberStub,
  updateOneStub,
} from '../test/stubs/product-category.stub';

jest.mock('../product-category.service.ts');

describe('ProductCategoryController', () => {
  let productCategoryController: ProductCategoryController;
  let productCategoryService: ProductCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductCategoryController],
      providers: [ProductCategoryService],
    }).compile();

    productCategoryController = module.get<ProductCategoryController>(ProductCategoryController);
    productCategoryService = module.get<ProductCategoryService>(ProductCategoryService);
    jest.clearAllMocks();
  });

  describe('Create', () => {
    describe('Once Create is called', () => {
      let createProductCategoryDto: CreateProductCategoryDto;
      let productCategory;

      beforeEach(async () => {
        productCategory = await productCategoryController.create(
          productCategoryStub().merchantId,
          createProductCategoryDto,
        );
      });

      it('Should call productCategoryService', () => {
        expect(productCategoryService.create).toHaveBeenCalledWith(
          productCategoryStub().merchantId,
          createProductCategoryDto,
        );
      });

      it('Should return created productCategory', () => {
        expect(productCategory).toEqual(createStub());
      });
    });
  });

  describe('getAll', () => {
    describe('Once getAll is called', () => {
      let productCategories;
      let params: ProductCategoryQueryDto;

      beforeEach(async () => {
        productCategories = await productCategoryController.all(productCategoryStub().merchantId, params);
      });

      it('Should call productCategoryService', () => {
        expect(productCategoryService.getAll).toHaveBeenCalledWith(productCategoryStub().merchantId, params);
      });

      it('Should return created productCategory', () => {
        expect(productCategories).toEqual(getAllStub());
      });
    });
  });

  describe('getOne', () => {
    describe('Once getOne is called', () => {
      let productCategory;

      beforeEach(async () => {
        productCategory = await productCategoryController.getOne(
          productCategoryStub().merchantId,
          productCategoryStub()._id,
        );
      });

      it('Should call productCategoryService', () => {
        expect(productCategoryService.getOne).toHaveBeenCalledWith(
          productCategoryStub().merchantId,
          productCategoryStub()._id,
        );
      });

      it('Should return getOne productCategory', () => {
        expect(productCategory).toEqual(getOneStub());
      });
    });
  });

  describe('update', () => {
    describe('Once update is called', () => {
      let productCategory;
      let updateProductCategoryDto: UpdateProductCategoryDto;

      beforeEach(async () => {
        productCategory = await productCategoryController.update(
          productCategoryStub().merchantId,
          productCategoryStub()._id,
          updateProductCategoryDto,
        );
      });

      it('Should call productCategoryService', () => {
        expect(productCategoryService.updateOne).toBeCalledWith(
          productCategoryStub().merchantId,
          productCategoryStub()._id,
          updateProductCategoryDto,
        );
      });

      it('Should return productCategory details', () => {
        expect(productCategory).toEqual(updateOneStub());
      });
    });
  });

  describe('remove', () => {
    describe('Once remove One is called', () => {
      let productCategory;

      beforeEach(async () => {
        productCategory = await productCategoryController.remove(
          productCategoryStub().merchantId,
          productCategoryStub()._id,
        );
      });

      it('Should call productCategoryService', () => {
        expect(productCategoryService.remove).toBeCalledWith(
          productCategoryStub().merchantId,
          productCategoryStub()._id,
        );
      });

      it('Should return productCategory details', () => {
        expect(productCategory).toEqual(removeStub());
      });
    });
  });

  describe('reOrderSerialNumber', () => {
    describe('Once reOrderSerialNumber is called', () => {
      let productCategory;
      let reorderSerialNumberDto: ReorderSerialNumberDto;

      beforeEach(async () => {
        productCategory = await productCategoryController.reOrderSerialNumber(reorderSerialNumberDto);
      });

      it('Should call productCategoryService', () => {
        expect(productCategoryService.reOrderSerialNumber).toBeCalledWith(reorderSerialNumberDto);
      });

      it('Should return productCategory details', () => {
        expect(productCategory).toEqual(reOrderSerialNumberStub());
      });
    });
  });
});

// sudo nx test --test-file product-category.controller.spec.ts
