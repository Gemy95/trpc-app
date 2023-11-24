import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from '../category.controller';
import { CategoryService } from '../category.service';
import { CategoryDto } from '../dto/category.dto';
import { CategoryQueryDto } from '../dto/categoryQuery.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { categoryStub, createStub, deleteOneStub, getAllStub, getOneStub, updateOneStub } from './stubs/category.stub';

jest.mock('../category.service.ts');

describe('CategoryController', () => {
  let categoryController: CategoryController;
  let categoryService: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [CategoryService],
    }).compile();

    categoryController = module.get<CategoryController>(CategoryController);
    categoryService = module.get<CategoryService>(CategoryService);
    jest.clearAllMocks();
  });

  describe('Create', () => {
    describe('Once Create is called', () => {
      let createDto: CategoryDto;
      let category;

      beforeEach(async () => {
        category = await categoryController.create(createDto);
      });

      it('Should call categoryService', () => {
        expect(categoryService.create).toHaveBeenCalledWith(createDto);
      });

      it('Should return created category', () => {
        expect(category).toEqual(createStub());
      });
    });
  });

  describe('getAll', () => {
    describe('Once get all is called', () => {
      let categories;
      let query: CategoryQueryDto;
      beforeEach(async () => {
        categories = await categoryController.all(query);
      });

      it('Should call categoryService', () => {
        expect(categoryService.getAll).toBeCalledWith(query);
      });

      it('Should return category details', () => {
        expect(categories).toEqual(getAllStub());
      });
    });
  });

  describe('getOne', () => {
    describe('Once get One is called', () => {
      let category;

      beforeEach(async () => {
        category = await categoryController.getOne(categoryStub()._id);
      });

      it('Should call categoryService', () => {
        expect(categoryService.getOne).toBeCalledWith(categoryStub()._id);
      });

      it('Should return category details', () => {
        expect(category).toEqual(getOneStub());
      });
    });
  });

  describe('updateOne', () => {
    describe('Once update One is called', () => {
      let category;
      let updateCategoryDto: UpdateCategoryDto;

      beforeEach(async () => {
        category = await categoryController.update(categoryStub()._id, updateCategoryDto);
      });

      it('Should call categoryService', () => {
        expect(categoryService.updateOne).toBeCalledWith(categoryStub()._id, updateCategoryDto);
      });

      it('Should return category details', () => {
        expect(category).toEqual(updateOneStub());
      });
    });
  });

  describe('deleteOne', () => {
    describe('Once delete One is called', () => {
      let category;

      beforeEach(async () => {
        category = await categoryController.deleteOne(categoryStub()._id);
      });

      it('Should call categoryService', () => {
        expect(categoryService.deleteOne).toBeCalledWith(categoryStub()._id);
      });

      it('Should return category details', () => {
        expect(category).toEqual(deleteOneStub());
      });
    });
  });
});
// sudo npm run test -- category.controller.spec.ts
