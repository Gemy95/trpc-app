import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { z } from 'zod';

import { CLIENT_ACTIVE_STATUS, CLIENT_STATUS } from '../../common/constants/client.constants';
import { CreateClientDto } from './create-client.dto';

// export class AdminUpdateClientDto extends PartialType(CreateClientDto) {
//   @ApiProperty({ default: CLIENT_ACTIVE_STATUS, enum: CLIENT_STATUS, required: false })
//   @IsOptional()
//   @IsEnum(CLIENT_STATUS)
//   status?: CLIENT_STATUS;
// }

export const AdminUpdateClientDto = z
  .object({
    status: z.nativeEnum(CLIENT_STATUS).optional().nullish(),
  })
  .merge(CreateClientDto.partial());
