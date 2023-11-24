import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { CreateBranchDto, ReservationsDays, ReservationsSettings } from '../../branch/dto/create-branch.dto';

export class UpdateBranchDto extends PartialType(CreateBranchDto) {
  //   @ApiProperty()
  //   @IsBoolean()
  //   @IsNotEmpty()
  //   isEnabledReservation: boolean;

  @ApiProperty({ type: [ReservationsDays] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ReservationsDays)
  reservationsDays?: ReservationsDays[];

  @ApiProperty({ type: ReservationsSettings })
  @IsOptional()
  reservationsSettings?: ReservationsSettings;

  @ApiProperty({ type: String })
  @IsOptional()
  products?: string;
}
