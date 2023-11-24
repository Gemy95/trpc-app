import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, Validate } from 'class-validator';
import { IsMongoObjectId } from '../../lib/mongodb-helper';
import { GetAllDto } from '../../common/dto/get-all.dto';
import { Type } from 'class-transformer';
import { DAYS } from '../../common/constants/branch.constants';

export class GetAvailableTablesDto extends GetAllDto {
  @ApiProperty({ description: 'this is the branch id' })
  @IsNotEmpty()
  @IsString()
  @Validate(IsMongoObjectId)
  branchId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  dateTime: Date;

  @ApiProperty({ default: DAYS.SATURDAY, enum: DAYS, required: true })
  @IsNotEmpty()
  @IsEnum(DAYS)
  day: DAYS;
}
