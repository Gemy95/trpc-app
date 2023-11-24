import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class MenuQueryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  branchId: string;
}
