import { Injectable } from '@nestjs/common';
import { BranchRepository } from '../models';
import { GetAllNearByDto, GetAllNearByFilterObject } from './dto/get-all-nearby-with-filters.dto';
import { GetAllNearestDto } from './dto/get-all-nearest-with-filter.dto';
import { MerchantBranchesDto } from './dto/merchant-branches-query.dto';

@Injectable()
export class MarketplaceBranchService {
  constructor(private branchRepository: BranchRepository) {}

  findAll(merchantId: string, query: MerchantBranchesDto) {
    return this.branchRepository.marketplaceMerchantBranches(merchantId, query);
  }

  getNearestBranches(query: GetAllNearestDto) {
    return this.branchRepository.getNearestBranches(query);
  }

  getNearByBranches(query: GetAllNearByDto, filterObject: GetAllNearByFilterObject) {
    return this.branchRepository.getNearByBranches(query, filterObject);
  }
}
