import { Test, TestingModule } from '@nestjs/testing';
import { MarketplaceTableController } from '../marketplace-table.controller';
import { MarketplaceTableService } from '../marketplace-table.service';
import { GetTablesDto } from '../dto/get-tables.dto';
import { findAllStub, findOneStub, tableStub } from './stubs/dashboard-table.stub';

jest.mock('../marketplace-table.service.ts');

describe('MarketplaceTableController', () => {
  let marketplaceTableController: MarketplaceTableController;
  let marketplaceTableService: MarketplaceTableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarketplaceTableController],
      providers: [MarketplaceTableService],
    }).compile();

    marketplaceTableController = module.get<MarketplaceTableController>(MarketplaceTableController);
    marketplaceTableService = module.get<MarketplaceTableService>(MarketplaceTableService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    describe('Once findAll is called', () => {
      let tables;
      let query: GetTablesDto;
      beforeEach(async () => {
        tables = await marketplaceTableController.findAll(query);
      });

      it('Should call marketplaceTableService', () => {
        expect(marketplaceTableService.findAll).toBeCalledWith(query);
      });

      it('Should return table details', () => {
        expect(tables).toEqual(findAllStub());
      });
    });
  });

  describe('findOne', () => {
    describe('Once findOne is called', () => {
      let table;
      beforeEach(async () => {
        table = await marketplaceTableController.findOne(tableStub()._id, tableStub().branchId.toString());
      });

      it('Should call marketplaceTableService', () => {
        expect(marketplaceTableService.findOne).toBeCalledWith(tableStub()._id, tableStub().branchId);
      });

      it('Should return table details', () => {
        expect(table).toEqual(findOneStub());
      });
    });
  });
});

// nx test --test-file marketplace-table.controller.spec.ts
