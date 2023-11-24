import { PartialType } from '@nestjs/mapped-types';
import { z } from 'zod';

import { CreateAddressDto } from './create-address.dto';

// export class UpdateAddressDto extends PartialType(CreateAddressDto) {}

export const UpdateAddressDto = z
  .object({
    addressId: z.string(),
  })
  .merge(CreateAddressDto.partial());
