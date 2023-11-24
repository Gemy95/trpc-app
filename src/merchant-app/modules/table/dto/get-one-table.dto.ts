import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsMongoObjectId } from '../../lib/mongodb-helper';

export class GetOneTablesDto {
  @ApiProperty({ description: 'this is the branch id' })
  @IsNotEmpty()
  @IsString()
  @Validate(IsMongoObjectId)
  branchId: string;
}
