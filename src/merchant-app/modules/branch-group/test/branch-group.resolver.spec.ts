import { Test, TestingModule } from '@nestjs/testing';
import { BranchGroupService } from '../branch-group.service';
import {
  branchGroupStub,
  createStub,
  findAllStub,
  findOneStub,
  updateOneStub,
  removeStub,
} from './stubs/branch-group.stub';
import { BranchGroupResolver } from '../branch-group.resolver';
import { CreateBranchGroupDto } from '../dto/create-branch-group.dto';
import { FindAllBranchGroupDto } from '../dto/findAll-branch-group.dto';
import { UpdateBranchGroupDto } from '../dto/update-branch-group.dto';

jest.mock('../branch-group.service.ts');

describe('BranchGroupResolver', () => {
  let branchGroupResolver: BranchGroupResolver;
  let branchGroupService: BranchGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BranchGroupResolver, BranchGroupService],
    }).compile();

    branchGroupResolver = module.get<BranchGroupResolver>(BranchGroupResolver);
    branchGroupService = module.get<BranchGroupService>(BranchGroupService);
    jest.clearAllMocks();
  });

  describe('Create', () => {
    describe('Once Create is called', () => {
      let createBranchGroupDto: CreateBranchGroupDto;
      let branchGroup;

      beforeEach(async () => {
        branchGroup = await branchGroupResolver.create(createBranchGroupDto);
      });

      it('Should call branchGroupService', () => {
        expect(branchGroupService.create).toHaveBeenCalledWith(createBranchGroupDto);
      });

      it('Should return created branch group', () => {
        expect(branchGroup).toEqual(createStub());
      });
    });
  });

  describe('findAll', () => {
    describe('Once findAll is called', () => {
      let branchGroups;
      let query: FindAllBranchGroupDto;
      beforeEach(async () => {
        branchGroups = await branchGroupResolver.findAll(query);
      });

      it('Should call branchGroupService', () => {
        expect(branchGroupService.getAll).toBeCalledWith(query);
      });

      it('Should return branch groups details', () => {
        expect(branchGroups).toEqual(findAllStub());
      });
    });
  });

  describe('findOne', () => {
    describe('Once findOne is called', () => {
      let branchGroup;
      beforeEach(async () => {
        branchGroup = await branchGroupResolver.getOne(branchGroupStub()._id);
      });

      it('Should call branchGroupService', () => {
        expect(branchGroupService.getOne).toBeCalledWith(branchGroupStub()._id);
      });

      it('Should return branchGroup details', () => {
        expect(branchGroup).toEqual(findOneStub());
      });
    });
  });

  describe('updateOne', () => {
    describe('Once updateOne is called', () => {
      let branchGroup;
      let updateBranchGroupDto: UpdateBranchGroupDto;
      beforeEach(async () => {
        branchGroup = await branchGroupResolver.update(branchGroupStub()._id, updateBranchGroupDto);
      });

      it('Should call branchGroupService', () => {
        expect(branchGroupService.updateOne).toBeCalledWith(branchGroupStub()._id, updateBranchGroupDto);
      });

      it('Should return updated branch group', () => {
        expect(branchGroup).toEqual(updateOneStub());
      });
    });
  });

  describe('remove', () => {
    describe('Once remove is called', () => {
      let branchGroup;

      beforeEach(async () => {
        branchGroup = await branchGroupResolver.deleteOne(branchGroupStub()._id);
      });

      it('Should call branchGroupService', () => {
        expect(branchGroupService.deleteOne).toBeCalledWith(branchGroupStub()._id);
      });

      it('Should delete branch group', () => {
        expect(branchGroup).toEqual(removeStub());
      });
    });
  });
});

// nx test --test-file branch-group.resolver.spec.ts
