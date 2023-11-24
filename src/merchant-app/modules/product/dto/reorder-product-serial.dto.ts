import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsMongoId, IsNumber, IsOptional, ValidateNested } from 'class-validator';

class UpdateSerial {
  @ApiProperty()
  @IsMongoId()
  id: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  newSerialNumber: number;
}
export class ReorderSerialNumberDto {
  @ApiProperty({ type: UpdateSerial })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSerial)
  serials: UpdateSerial[];
}
