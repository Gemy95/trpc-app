import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsMongoId, IsNumber, ValidateNested } from 'class-validator';

class UpdateSerial {
  @ApiProperty()
  @IsMongoId()
  id: string;

  @ApiProperty()
  @IsNumber()
  newSerialNumber: number;
}
export class ReorderSerialNumberDto {
  @ApiProperty({ type: UpdateSerial })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSerial)
  serials: UpdateSerial[];
}
