import { Test, TestingModule } from '@nestjs/testing';
import { ContentController } from '../content.controller';
import { ContentService } from '../content.service';
import { CreateContentDto, UpdateContentDto } from '../dtos/content.dto';
import { contentStub, createStub, deleteOneStub, updateOneStub } from './stubs/content.stub';

jest.mock('../content.service.ts');

describe('ContentController', () => {
  let contentController: ContentController;
  let contentService: ContentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentController],
      providers: [ContentService],
    }).compile();

    contentController = module.get<ContentController>(ContentController);
    contentService = module.get<ContentService>(ContentService);
    jest.clearAllMocks();
  });

  describe('Create', () => {
    describe('Once Create is called', () => {
      let createContentDto: CreateContentDto;
      let content;

      beforeEach(async () => {
        content = await contentController.create(createContentDto);
      });

      it('Should call contentService', () => {
        expect(contentService.create).toHaveBeenCalledWith(createContentDto);
      });

      it('Should return created content', () => {
        expect(content).toEqual(createStub());
      });
    });
  });

  describe('updateOne', () => {
    describe('Once update One is called', () => {
      let content;
      let updateContentDto: UpdateContentDto;

      beforeEach(async () => {
        content = await contentController.updateOne(contentStub()._id, updateContentDto);
      });

      it('Should call contentService', () => {
        expect(contentService.update).toBeCalledWith(contentStub()._id, updateContentDto);
      });

      it('Should return content details', () => {
        expect(content).toEqual(updateOneStub());
      });
    });
  });

  describe('deleteOne', () => {
    describe('Once delete One is called', () => {
      let content;

      beforeEach(async () => {
        content = await contentController.deleteOne(contentStub()._id);
      });

      it('Should call cityService', () => {
        expect(contentService.remove).toBeCalledWith(contentStub()._id);
      });

      it('Should return content details', () => {
        expect(content).toEqual(deleteOneStub());
      });
    });
  });
});
// sudo nx test --test-file content.controller.spec.ts
