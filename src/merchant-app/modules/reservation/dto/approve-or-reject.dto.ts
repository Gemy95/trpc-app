import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { APPROVE_OR_REJECT_RESERVATION_STATUS } from '../../common/constants/reservation.constants';

export class ApproveOrRejectReservationDto {
  @ApiProperty({
    example: APPROVE_OR_REJECT_RESERVATION_STATUS.RESERVATION_ACCEPTED_STATUS,
    enum: APPROVE_OR_REJECT_RESERVATION_STATUS,
  })
  @IsEnum(APPROVE_OR_REJECT_RESERVATION_STATUS)
  status: APPROVE_OR_REJECT_RESERVATION_STATUS;

  @ApiProperty()
  @IsOptional()
  notes?: string[];
}
