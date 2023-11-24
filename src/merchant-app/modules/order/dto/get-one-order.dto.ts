import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString, Validate } from 'class-validator';

export class GetOneOrder {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Validate(IsMongoId)
  orderId: string;
}
