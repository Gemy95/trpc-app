import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentsController } from '../departments.controller';
import { DepartmentsService } from '../departments.service';
import { CreateDepartmentDto } from '../dto/create-department.dto';
import { GetAllDepartmentsDto } from '../dto/get-all-department.dto';
import {
  createStub,
  departmentStub,
  findByIdStub,
  findStub,
  removeDepartmentStub,
  updateStub,
} from './stubs/departments.stub';
import { UpdateDepartmentDto } from '../dto/update-department.dto';

jest.mock('../departments.service.ts');

describe('DepartmentsController', () => {
  let departmentsController: DepartmentsController;
  let departmentsService: DepartmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartmentsController],
      providers: [DepartmentsService],
    }).compile();

    departmentsController = module.get<DepartmentsController>(DepartmentsController);
    departmentsService = module.get<DepartmentsService>(DepartmentsService);
    jest.clearAllMocks();
  });

  describe('Create', () => {
    describe('Once Create is called', () => {
      let createDepartmentDto: CreateDepartmentDto;
      let department;

      beforeEach(async () => {
        department = await departmentsController.create(createDepartmentDto);
      });

      it('Should call departmentService', () => {
        expect(departmentsService.create).toHaveBeenCalledWith(createDepartmentDto);
      });

      it('Should return created department', () => {
        expect(department).toEqual(createStub());
      });
    });
  });

  describe('find', () => {
    describe('Once find is called', () => {
      let departments;
      let query: GetAllDepartmentsDto;
      beforeEach(async () => {
        departments = await departmentsController.find(query);
      });

      it('Should call departmentService', () => {
        expect(departmentsService.find).toBeCalledWith(query);
      });

      it('Should return department details', () => {
        expect(departments).toEqual(findStub());
      });
    });
  });

  describe('findById', () => {
    describe('Once findById is called', () => {
      let department;

      beforeEach(async () => {
        department = await departmentsController.findById(departmentStub()._id);
      });

      it('Should call departmentService', () => {
        expect(departmentsService.findById).toBeCalledWith(departmentStub()._id);
      });

      it('Should return department details', () => {
        expect(department).toEqual(findByIdStub());
      });
    });
  });

  describe('update', () => {
    describe('Once update is called', () => {
      let department;
      let UpdateDepartmentDto: UpdateDepartmentDto;

      beforeEach(async () => {
        department = await departmentsController.update(departmentStub()._id, UpdateDepartmentDto);
      });

      it('Should call departmentService', () => {
        expect(departmentsService.update).toBeCalledWith(departmentStub()._id, UpdateDepartmentDto);
      });

      it('Should return department details', () => {
        expect(department).toEqual(updateStub());
      });
    });
  });

  describe('removeDepartment', () => {
    describe('Once remove Department is called', () => {
      let department;

      beforeEach(async () => {
        department = await departmentsController.remove(departmentStub()._id);
      });

      it('Should call departmentService', () => {
        expect(departmentsService.removeDepartment).toBeCalledWith(departmentStub()._id);
      });

      it('Should return department details', () => {
        expect(department).toEqual(removeDepartmentStub());
      });
    });
  });
});
// sudo npm run test -- departments.controller.spec.ts
