import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString, Validate } from 'class-validator';
import { z } from 'zod';

import ERROR_CODES from '../../../../libs/utils/src/lib/errors_codes';
import { IsMongoObjectId } from '../../lib/mongodb-helper';

// export class UpdateClientDto {
//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsString({ message: 'name must be a string' })
//   @IsNotEmpty()
//   name: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsNotEmpty()
//   @IsString({ message: 'cityId must be a string' })
//   @Validate(IsMongoObjectId)
//   cityId: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsNotEmpty()
//   @IsString({ message: 'countryId must be a string' })
//   @Validate(IsMongoObjectId)
//   countryId: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsString()
//   @IsNotEmpty()
//   uuid: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsNotEmpty()
//   @IsDate()
//   @Type(() => Date)
//   dateOfBirth: Date;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsString()
//   imageUrl: string;
// }

export const UpdateClientDto = z.object({
  name: z.string().optional().nullish(),
  cityId: z.string().optional().nullish(),
  countryId: z.string().optional().nullish(),
  uuid: z.string().uuid().optional().nullish(),
  dateOfBirth: z.date().optional().nullish(),
  imageUrl: z.string().optional().nullish(),
});
