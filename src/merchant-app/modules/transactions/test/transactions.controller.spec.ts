import { Test, TestingModule } from '@nestjs/testing';
import { TransactionQueryDto } from '../dtos/transaction-query.dto';
import { TransactionsController } from '../transactions.controller';
import { TransactionsService } from '../transactions.service';
import { findAllByMerchantIdStub, findAllStub, findOneStub, updateStub } from '../test/stubs/transactions.stub';
import { GetAllTransactionDto } from '../dtos/get-all-transaction.dto';

jest.mock('../transactions.service.ts');

describe('TransactionController', () => {
  let transactionsController: TransactionsController;
  let transactionsService: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [TransactionsService],
    }).compile();

    transactionsController = module.get<TransactionsController>(TransactionsController);
    transactionsService = module.get<TransactionsService>(TransactionsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    describe('Once findAll is called', () => {
      let query: TransactionQueryDto;
      let transactions;

      beforeEach(async () => {
        transactions = await transactionsController.findAll(query);
      });

      it('Should call transactionsService', () => {
        expect(transactionsService.findAll).toHaveBeenCalledWith(query);
      });

      it('Should return created transactions', () => {
        expect(transactions).toEqual(findAllStub());
      });
    });
  });

  describe('findAllByMerchantIdStub', () => {
    describe('Once findAllByMerchantIdStub is called', () => {
      let transactions;
      let getAllTransactionDto: GetAllTransactionDto;

      beforeEach(async () => {
        transactions = await transactionsController.findAllByMerchantId(getAllTransactionDto, {});
      });

      it('Should call transactionsService', () => {
        expect(transactionsService.findAllByMerchantId).toBeCalledWith(getAllTransactionDto, {});
      });

      it('Should return transactions details', () => {
        expect(transactions).toEqual(findAllByMerchantIdStub());
      });
    });
  });

  describe('findOne', () => {
    describe('Once findOne is called', () => {
      let transaction;

      beforeEach(async () => {
        transaction = await transactionsController.findOne('123');
      });

      it('Should call transactionsService', () => {
        expect(transactionsService.findOne).toBeCalledWith('123');
      });

      it('Should return transaction details', () => {
        expect(transaction).toEqual(findOneStub());
      });
    });
  });

  describe('update', () => {
    describe('Once update is called', () => {
      let transaction;

      beforeEach(async () => {
        transaction = await transactionsController.update('', {});
      });

      it('Should call transactionsService', () => {
        expect(transactionsService.update).toBeCalledWith('', {});
      });

      it('Should return transaction details', () => {
        expect(transaction).toEqual(updateStub());
      });
    });
  });
});
// sudo nx test --test-file transactions.controller.spec.ts
