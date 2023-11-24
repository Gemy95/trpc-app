import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString, Validate } from 'class-validator';

export class CancelOneReservationDto {
  @ApiProperty({ description: 'This is the reservation id' })
  @IsNotEmpty()
  @IsString()
  @Validate(IsMongoId)
  id: string;
}