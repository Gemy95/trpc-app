import { z } from 'zod';

import { CreateBranchDto } from './create-branch.dto';

export const UpdateBranchDto = z.object({}).merge(CreateBranchDto.partial());
