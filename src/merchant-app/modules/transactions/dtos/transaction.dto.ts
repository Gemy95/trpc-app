import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { STATUS } from '../../common/constants/status.constants';
import { TRANSACTION_TYPE } from '../../common/constants/transaction.constants';

export class TransactionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  operationId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  tax: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  commission: number;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  from: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  to: string;

  @ApiProperty({ enum: TRANSACTION_TYPE })
  @IsNotEmpty()
  @IsEnum(TRANSACTION_TYPE)
  @IsString()
  operationType: TRANSACTION_TYPE;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({ enum: STATUS })
  @IsNotEmpty()
  @IsEnum(STATUS)
  @IsString()
  status: STATUS;
}
