import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { BranchGroup } from '../../../libs/database/src/lib/models/branch-group/branch-group.schema';
// import { BaseRepository } from '../../branch-group/dto/create-branch-group.dto';
import { BaseRepository } from '../BaseRepository';
import { SettingRepository } from '../setting/setting.repository';

// import { FindAllBranchGroupDto } from '../../branch-group/dto/findAll-branch-group.dto';
// import { UpdateBranchGroupDto } from '../../branch-group/dto/update-branch-group.dto';
// import generateFilters from '../../common/utils/generate-filters';
// import { ERROR_CODES } from '../../../libs/utils/src';

@Injectable()
export class BranchGroupRepository extends BaseRepository<BranchGroup> {
  constructor(
    @InjectModel(BranchGroup.name) private readonly nModel: Model<BranchGroup>,
    private readonly settingRepository: SettingRepository,
  ) {
    super(nModel);
  }

  //   async createOne(createBranchGroupDto: CreateBranchGroupDto) {
  //     const branchGroup = new BranchGroup();

  //     branchGroup.name = createBranchGroupDto.nameArabic;
  //     branchGroup.location = {
  //       type: 'Point',
  //       coordinates: [createBranchGroupDto.longitude, createBranchGroupDto.latitude],
  //     };
  //     branchGroup.translation = [
  //       {
  //         _lang: 'en',
  //         name: createBranchGroupDto.nameEnglish,
  //       },
  //     ];

  //     branchGroup.city = new mongoose.Types.ObjectId(createBranchGroupDto.city);
  //     return this.create(branchGroup);
  //   }

  //   async getAll(params: FindAllBranchGroupDto) {
  //     const { limit, page, paginate, ...rest } = params;
  //     const generatedMatch = generateFilters(rest);

  //     const distance = await this.settingRepository.getOne({ modelName: 'BranchGroup' });
  //     const minDistance = distance?.minDistance || 0;
  //     const maxDistance = distance?.maxDistance || 100000;

  //     if(generatedMatch['cities']){
  //      delete Object.assign(generatedMatch,{
  //       'city': generatedMatch['cities']
  //      }) ['cities'];
  //     }

  //     const branchGroups = await this.aggregate([
  //       {
  //         $geoNear: (params?.longitude && params?.latitude) ? {
  //           near: { type: 'Point', coordinates: [params?.longitude || 0, params?.latitude || 0] },
  //           distanceField: 'dist.calculated',
  //           minDistance,
  //           maxDistance,
  //           includeLocs: 'dist.location',
  //           spherical: true,
  //         } : {
  //           near: { type: 'Point', coordinates: [params?.longitude || 0, params?.latitude || 0] },
  //           distanceField: 'dist.calculated',
  //           includeLocs: 'dist.location',
  //           spherical: true,
  //         },
  //       },
  //       {
  //         $match: { ...generatedMatch },
  //       },
  //       {
  //         $sort: { 'dist.calculated': 1 },
  //       },
  //       {
  //         $project:{
  //           _id: 1,
  //           name: 1,
  //           location: 1,
  //           translation: 1,
  //           city: 1,
  //           createdAt: 1,
  //           updatedAt: 1,
  //           distance: { $round: ['$dist.calculated', 2] }  ,
  //         }
  //       },
  //       {
  //         $skip: page <= 0 ? 0 : limit * page,
  //       },
  //       {
  //         $limit: limit,
  //       },
  //     ]);

  //     return branchGroups;
  //   }

  //   async getOne(branchGroupId: string) {
  //     const [branchGroup] = await this._model.aggregate([
  //       {
  //         $match: {
  //           _id: new mongoose.Types.ObjectId(branchGroupId),
  //         },
  //       },
  //     ]);

  //     if (!branchGroup) {
  //       throw new NotFoundException(ERROR_CODES.err_branch_group_not_found);
  //     }

  //     return branchGroup;
  //   }

  //   async updateOne(branchGroupId: string, updateBranchGroupDto: UpdateBranchGroupDto) {
  //     const branchGroup = new BranchGroup();

  //     branchGroup.name = updateBranchGroupDto?.nameArabic;
  //     branchGroup.location =
  //       updateBranchGroupDto?.longitude && updateBranchGroupDto?.latitude
  //         ? {
  //             type: 'Point',
  //             coordinates: [updateBranchGroupDto?.longitude, updateBranchGroupDto?.latitude],
  //           }
  //         : undefined;

  //     branchGroup.translation = updateBranchGroupDto?.nameEnglish
  //       ? [
  //           {
  //             _lang: 'en',
  //             name: updateBranchGroupDto?.nameEnglish,
  //           },
  //         ]
  //       : undefined;

  //     branchGroup.city = (updateBranchGroupDto.city) ? new mongoose.Types.ObjectId(updateBranchGroupDto.city) : undefined;

  //     const isBranchGroupExists = await this.getById(new mongoose.Types.ObjectId(branchGroupId), {});
  //     if (!isBranchGroupExists) {
  //       throw new NotFoundException(ERROR_CODES.err_branch_group_not_found);
  //     }
  //     return this.updateById(branchGroupId, { ...branchGroup }, { lean: true, new: true }, {});
  //   }

  //   async remove(branchGroupId: string) {
  //     const branchGroup = await this.getById(new mongoose.Types.ObjectId(branchGroupId), {});
  //     if (!branchGroup) {
  //       throw new NotFoundException(ERROR_CODES.err_branch_group_not_found);
  //     }
  //     await this.deleteById(branchGroupId);
  //     return { success: true };
  //   }
}
