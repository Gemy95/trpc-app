import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductDto } from '../dto/create-product.dto';
import { GetAllProductDto } from '../dto/get-all-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductController } from '../product.controller';
import { ProductService } from '../product.service';
import { createStub, findAllStub, findOneStub, productStub, removeStub, updateOneStub } from './stubs/product.stub';

jest.mock('../product.service.ts');

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [ProductService],
    }).compile();

    productController = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
    jest.clearAllMocks();
  });

  describe('Create', () => {
    describe('Once Create is called', () => {
      let createProductDto: CreateProductDto;
      let product;

      beforeEach(async () => {
        product = await productController.create({}, createProductDto, productStub().merchantId.toString());
      });

      it('Should call productService', () => {
        expect(productService.create).toHaveBeenCalledWith({}, createProductDto, productStub().merchantId.toString());
      });

      it('Should return created product', () => {
        expect(product).toEqual(createStub());
      });
    });
  });

  describe('findAll', () => {
    describe('Once find all is called', () => {
      let products;
      let query: GetAllProductDto;
      beforeEach(async () => {
        products = await productService.findAll(query, productStub().merchantId.toString());
      });

      it('Should call productService', () => {
        expect(productService.findAll).toBeCalledWith(query, productStub().merchantId.toString());
      });

      it('Should return product details', () => {
        expect(products).toEqual(findAllStub());
      });
    });
  });

  describe('findOne', () => {
    describe('Once find One is called', () => {
      let product;

      beforeEach(async () => {
        product = await productService.findOne(productStub()._id, productStub().merchantId.toString());
      });

      it('Should call productService', () => {
        expect(productService.findOne).toBeCalledWith(productStub()._id, productStub().merchantId.toString());
      });

      it('Should return product details', () => {
        expect(product).toEqual(findOneStub());
      });
    });
  });

  describe('updateOne', () => {
    describe('Once update One is called', () => {
      let country;
      let updateDto: UpdateProductDto;

      beforeEach(async () => {
        country = await productService.updateOne(productStub()._id, updateDto, productStub().merchantId.toString());
      });

      it('Should call productService', () => {
        expect(productService.updateOne).toBeCalledWith(
          productStub()._id,
          updateDto,
          productStub().merchantId.toString(),
        );
      });

      it('Should return product details', () => {
        expect(country).toEqual(updateOneStub());
      });
    });
  });

  describe('remove', () => {
    describe('Once remove is called', () => {
      let product;

      beforeEach(async () => {
        product = await productService.remove(productStub()._id, productStub().merchantId.toString());
      });

      it('Should call productService', () => {
        expect(productService.remove).toBeCalledWith(productStub()._id, productStub().merchantId.toString());
      });

      it('Should return product details', () => {
        expect(product).toEqual(removeStub());
      });
    });
  });
});
// sudo npm run test -- product.controller.spec.ts
