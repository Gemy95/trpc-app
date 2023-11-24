import { OmitType, PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { TABLE_STATUS } from '../../common/constants/table.constants';
import { CreateTableDto } from './create-table.dto';

export class UpdateTableDto extends PartialType(OmitType(CreateTableDto, ['branchId'] as const)) {
  @ApiProperty({ default: TABLE_STATUS.AVAILABLE_STATUS, enum: TABLE_STATUS, required: false })
  @IsOptional()
  @IsEnum(TABLE_STATUS)
  status?: TABLE_STATUS;
}
