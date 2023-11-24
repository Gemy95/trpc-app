import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsMongoObjectId } from '../../lib/mongodb-helper';
import { GetAllDto } from '../../common/dto/get-all.dto';

export class GetTablesDto extends GetAllDto {
  @ApiProperty({ description: 'this is the branch id' })
  @IsNotEmpty()
  @IsString()
  @Validate(IsMongoObjectId)
  branchId: string;
}
