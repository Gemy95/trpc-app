import { UpdateBranchDto } from '../dto/update-branch.dto';

export interface IUpdateBranch {
  branchId: string;
  merchantId: string;
  data: UpdateBranchDto;
}
