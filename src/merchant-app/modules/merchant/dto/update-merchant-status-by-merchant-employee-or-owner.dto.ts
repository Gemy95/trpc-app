import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ONLINE_STATUS, VISIBILITY_STATUS } from '../../common/constants/merchant';

export class UpdateMerchantStatusByMerchantEmployeeOrOwnerDto {
  @ApiProperty({ default: ONLINE_STATUS, enum: VISIBILITY_STATUS, required: true })
  @IsNotEmpty()
  @IsEnum(VISIBILITY_STATUS)
  visibility_status: VISIBILITY_STATUS;
}
