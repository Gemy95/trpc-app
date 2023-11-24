import { TestingModule, Test } from '@nestjs/testing';
import { BaseQuery } from '../../common/dto/BaseQuery.dto';
import { DiscountController } from '../discount.controller';
import { DiscountService } from '../discount.service';
import { CreateDiscountDto } from '../dto/create-discount.dto';
import { UpdateDiscountDto } from '../dto/update-discount.dto';
import {
  createStub,
  discountStub,
  findAllByMerchantIdStub,
  findAllStub,
  findOneStub,
  removeStub,
  updateStub,
} from '../test/stubs/discount.stub';

jest.mock('../discount.service.ts');

describe('DiscountController', () => {
  let discountController: DiscountController;
  let discountService: DiscountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscountController],
      providers: [DiscountService],
    }).compile();

    discountController = module.get<DiscountController>(DiscountController);
    discountService = module.get<DiscountService>(DiscountService);
    jest.clearAllMocks();
  });

  describe('Create', () => {
    describe('Once Create is called', () => {
      let createDiscountDto: CreateDiscountDto;
      let discount;

      beforeEach(async () => {
        discount = await discountController.create(createDiscountDto);
      });

      it('Should call discountService', () => {
        expect(discountService.create).toHaveBeenCalledWith(createDiscountDto);
      });

      it('Should return created discount', () => {
        expect(discount).toEqual(createStub());
      });
    });
  });

  describe('findAll', () => {
    describe('Once findAll is called', () => {
      let discounts;

      beforeEach(async () => {
        discounts = await discountController.findAll();
      });

      it('Should call discountService', () => {
        expect(discountService.findAll).toHaveBeenCalledWith();
      });

      it('Should return created discount', () => {
        expect(discounts).toEqual(findAllStub());
      });
    });
  });

  describe('findAllByMerchantId', () => {
    describe('Once findAllByMerchantId is called', () => {
      let query: BaseQuery;
      let discount;

      beforeEach(async () => {
        discount = await discountController.findAllByMerchantId('', query);
      });

      it('Should call discountService', () => {
        expect(discountService.findAllByMerchantId).toHaveBeenCalledWith('', query);
      });

      it('Should return findAllByMerchantId discount', () => {
        expect(discount).toEqual(findAllByMerchantIdStub());
      });
    });
  });

  describe('findOne', () => {
    describe('Once findOne is called', () => {
      let discount;

      beforeEach(async () => {
        discount = await discountController.findOne(discountStub()._id.toString());
      });

      it('Should call discountService', () => {
        expect(discountService.findOne).toHaveBeenCalledWith(discountStub()._id);
      });

      it('Should return findOne discount', () => {
        expect(discount).toEqual({ ...findOneStub(), createdAt: discount.createdAt, updatedAt: discount.updatedAt });
      });
    });
  });

  describe('update', () => {
    describe('Once update is called', () => {
      let discount;
      let updateDiscountDto: UpdateDiscountDto;

      beforeEach(async () => {
        discount = await discountController.update(discountStub()._id.toString(), updateDiscountDto);
      });

      it('Should call discountService', () => {
        expect(discountService.update).toBeCalledWith(discountStub()._id.toString(), updateDiscountDto);
      });

      it('Should return discount details', () => {
        expect(discount).toEqual(updateStub());
      });
    });
  });

  describe('remove', () => {
    describe('Once remove One is called', () => {
      let discount;

      beforeEach(async () => {
        discount = await discountController.remove(discountStub()._id.toString());
      });

      it('Should call discountService', () => {
        expect(discountService.remove).toBeCalledWith(discountStub()._id.toString());
      });

      it('Should return discount details', () => {
        expect(discount).toEqual(removeStub());
      });
    });
  });
});

// sudo nx test --test-file discount.controller.spec.ts
