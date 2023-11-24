import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { ORDER_STATUS } from '../../common/constants/order.constants';
import { GetAllDto } from '../../common/dto/get-all-without-pagination.dto';

export class findAllOrderQueryDto extends PartialType(GetAllDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(ORDER_STATUS, { each: true })
  @Transform(({ value }) => value.split(','))
  status?: string[];
}
