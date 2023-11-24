import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BranchGroup, BranchGroupSchema } from '../../../libs/database/src/lib/models/branch-group/branch-group.schema';
import { BranchGroupRepository } from '../models';
import { SettingModule } from '../setting/setting.module';
import { BranchGroupResolver } from './branch-group.resolver';
import { BranchGroupService } from './branch-group.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: BranchGroup.name, schema: BranchGroupSchema }]), SettingModule],
  providers: [BranchGroupService, BranchGroupRepository, BranchGroupResolver],
  exports: [BranchGroupService, BranchGroupRepository],
})
export class BranchGroupModule {}
