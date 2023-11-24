import { Test, TestingModule } from '@nestjs/testing';
import { TagDto } from '../dto/tag.dto';
import { TagQueryDto } from '../dto/tagQuery.dto';
import { UpdateTagDto } from '../dto/update-tag.dto';
import { TagController } from '../tag.controller';
import { TagService } from '../tag.service';
import {
  createStub,
  deleteOneStub,
  findStub,
  getAllByCategoryIdStub,
  getOneStub,
  tagStub,
  updateOneStub,
} from '../test/stubs/tag.stub';

jest.mock('../tag.service.ts');

describe('TagController', () => {
  let tagController: TagController;
  let tagService: TagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagController],
      providers: [TagService],
    }).compile();

    tagController = module.get<TagController>(TagController);
    tagService = module.get<TagService>(TagService);
    jest.clearAllMocks();
  });

  describe('Create', () => {
    describe('Once Create is called', () => {
      let tagDto: TagDto;
      let tag;

      beforeEach(async () => {
        tag = await tagController.create(tagStub().category.toString(), tagDto);
      });

      it('Should call tagService', () => {
        expect(tagService.create).toHaveBeenCalledWith(tagStub().category.toString(), tagDto);
      });

      it('Should return created Tag', () => {
        expect(tag).toEqual(createStub());
      });
    });
  });

  describe('getAllByCategoryIdStub', () => {
    describe('Once getAllByCategoryIdStub is called', () => {
      let tags;
      let params: TagQueryDto;

      beforeEach(async () => {
        tags = await tagController.all(tagStub().category.toString(), params);
      });

      it('Should call tagService', () => {
        expect(tagService.getAllByCategoryId).toBeCalledWith(tagStub().category.toString(), params);
      });

      it('Should return tag details', () => {
        expect(tags).toEqual(getAllByCategoryIdStub());
      });
    });
  });

  describe('getOne', () => {
    describe('Once getOne is called', () => {
      let tag;

      beforeEach(async () => {
        tag = await tagController.getOne(tagStub().category.toString(), tagStub()._id);
      });

      it('Should call tagService', () => {
        expect(tagService.getOne).toBeCalledWith(tagStub().category.toString(), tagStub()._id);
      });

      it('Should return tag details', () => {
        expect(tag).toEqual(getOneStub());
      });
    });
  });

  describe('updateOne', () => {
    describe('Once updateOne is called', () => {
      let tag;
      let updateTagDto: UpdateTagDto;

      beforeEach(async () => {
        tag = await tagController.update(tagStub().category.toString(), tagStub()._id, updateTagDto);
      });

      it('Should call tagService', () => {
        expect(tagService.updateOne).toBeCalledWith(tagStub().category.toString(), tagStub()._id, updateTagDto);
      });

      it('Should return tag details', () => {
        expect(tag).toEqual(updateOneStub());
      });
    });
  });

  describe('deleteOne', () => {
    describe('Once deleteOne is called', () => {
      let tag;

      beforeEach(async () => {
        tag = await tagController.deleteOne(tagStub().category.toString(), tagStub()._id);
      });

      it('Should call tagService', () => {
        expect(tagService.deleteOne).toBeCalledWith(tagStub().category.toString(), tagStub()._id);
      });

      it('Should return tag details', () => {
        expect(tag).toEqual(deleteOneStub());
      });
    });
  });

  describe('find', () => {
    describe('Once find is called', () => {
      let tags;
      let query: TagQueryDto;

      beforeEach(async () => {
        tags = await tagController.find(query);
      });

      it('Should call tagService', () => {
        expect(tagService.find).toBeCalledWith(query);
      });

      it('Should return tag details', () => {
        expect(tags).toEqual(findStub());
      });
    });
  });
});

// sudo nx test --test-file tag.controller.spec.ts
