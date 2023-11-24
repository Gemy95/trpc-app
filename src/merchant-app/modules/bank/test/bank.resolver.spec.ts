import { Test, TestingModule } from '@nestjs/testing';
import { BankService } from '../bank.service';
import { BankResolver } from '../bank.resolver';
import { bankStub, createStub, findAllStub, findOneStub, updateOneStub, removeStub } from './stubs/bank.stub';
import { CreateBankDto } from '../dto/create-bank.dto';
import { UpdateBankDto } from '../dto/update-bank.dto';
import { FindAllBankDto } from '../dto/findAll-bank.dto';

jest.mock('../bank.service.ts');

describe('BankResolver', () => {
  let bankResolver: BankResolver;
  let bankService: BankService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BankResolver, BankService],
    }).compile();

    bankResolver = module.get<BankResolver>(BankResolver);
    bankService = module.get<BankService>(BankService);
    jest.clearAllMocks();
  });

  describe('Create', () => {
    describe('Once Create is called', () => {
      let createBankDto: CreateBankDto;
      let bank;

      beforeEach(async () => {
        bank = await bankResolver.create(createBankDto);
      });

      it('Should call bankService', () => {
        expect(bankService.create).toHaveBeenCalledWith(createBankDto);
      });

      it('Should return created bank', () => {
        expect(bank).toEqual(createStub());
      });
    });
  });

  describe('findAll', () => {
    describe('Once findAll is called', () => {
      let banks;
      let query: FindAllBankDto;
      beforeEach(async () => {
        banks = await bankResolver.findAll(query);
      });

      it('Should call bankService', () => {
        expect(bankService.getAll).toBeCalledWith(query);
      });

      it('Should return bank details', () => {
        expect(banks).toEqual(findAllStub());
      });
    });
  });

  describe('findOne', () => {
    describe('Once findOne is called', () => {
      let bank;
      beforeEach(async () => {
        bank = await bankResolver.getOne(bankStub()._id);
      });

      it('Should call bankService', () => {
        expect(bankService.getOne).toBeCalledWith(bankStub()._id);
      });

      it('Should return bank details', () => {
        expect(bank).toEqual(findOneStub());
      });
    });
  });

  describe('updateOne', () => {
    describe('Once updateOne is called', () => {
      let bank;
      let updateBankDto: UpdateBankDto;
      beforeEach(async () => {
        bank = await bankResolver.update(bankStub()._id, updateBankDto);
      });

      it('Should call bankService', () => {
        expect(bankService.updateOne).toBeCalledWith(bankStub()._id, updateBankDto);
      });

      it('Should return updated bank', () => {
        expect(bank).toEqual(updateOneStub());
      });
    });
  });

  describe('remove', () => {
    describe('Once remove is called', () => {
      let bank;

      beforeEach(async () => {
        bank = await bankResolver.deleteOne(bankStub()._id);
      });

      it('Should call bankService', () => {
        expect(bankService.deleteOne).toBeCalledWith(bankStub()._id);
      });

      it('Should delete bank', () => {
        expect(bank).toEqual(removeStub());
      });
    });
  });
});

// nx test --test-file bank.resolver.spec.ts
