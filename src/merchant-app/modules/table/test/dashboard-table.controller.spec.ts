import { Test, TestingModule } from '@nestjs/testing';
import { DashboardTableController } from '../dashboard-table.controller';
import { DashboardTableService } from '../dashboard-table.service';
import { CreateTableDto } from '../dto/create-table.dto';
import { GetTablesDto } from '../dto/get-tables.dto';
import { UpdateTableDto } from '../dto/update-table.dto';
import {
  createStub,
  findAllStub,
  findOneStub,
  removeStub,
  tableStub,
  updateOneStub,
} from './stubs/dashboard-table.stub';

jest.mock('../dashboard-table.service.ts');

describe('DashboardTableController', () => {
  let dashboardTableController: DashboardTableController;
  let dashboardTableService: DashboardTableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardTableController],
      providers: [DashboardTableService],
    }).compile();

    dashboardTableController = module.get<DashboardTableController>(DashboardTableController);
    dashboardTableService = module.get<DashboardTableService>(DashboardTableService);
    jest.clearAllMocks();
  });

  describe('Create', () => {
    describe('Once Create is called', () => {
      let createTableDto: CreateTableDto;
      let table;

      beforeEach(async () => {
        table = await dashboardTableController.create(createTableDto);
      });

      it('Should call tableService', () => {
        expect(dashboardTableService.create).toHaveBeenCalledWith(createTableDto);
      });

      it('Should return created table', () => {
        expect(table).toEqual(createStub());
      });
    });
  });

  describe('findAll', () => {
    describe('Once findAll is called', () => {
      let tables;
      let query: GetTablesDto;
      beforeEach(async () => {
        tables = await dashboardTableController.findAll(query);
      });

      it('Should call dashboardTableService', () => {
        expect(dashboardTableService.findAll).toBeCalledWith(query);
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
        table = await dashboardTableController.findOne(tableStub()._id, tableStub().branchId.toString());
      });

      it('Should call dashboardTableService', () => {
        expect(dashboardTableService.findOne).toBeCalledWith(tableStub()._id, tableStub().branchId);
      });

      it('Should return table details', () => {
        expect(table).toEqual(findOneStub());
      });
    });
  });

  describe('updateOne', () => {
    describe('Once updateOne is called', () => {
      let table;
      let updateTableDto: UpdateTableDto;
      beforeEach(async () => {
        table = await dashboardTableController.updateOne(
          tableStub()._id,
          tableStub().branchId.toString(),
          updateTableDto,
        );
      });

      it('Should call dashboardTableService', () => {
        expect(dashboardTableService.updateOne).toBeCalledWith(tableStub()._id, tableStub().branchId, updateTableDto);
      });

      it('Should return updated table', () => {
        expect(table).toEqual(updateOneStub());
      });
    });
  });

  describe('remove', () => {
    describe('Once remove is called', () => {
      let table;

      beforeEach(async () => {
        table = await dashboardTableController.remove(tableStub()._id, tableStub().branchId.toString());
      });

      it('Should call dashboardTableService', () => {
        expect(dashboardTableService.remove).toBeCalledWith(tableStub()._id, tableStub().branchId);
      });

      it('Should delete table', () => {
        expect(table).toEqual(removeStub());
      });
    });
  });
});

// nx test --test-file dashboard-table.controller.spec.ts
