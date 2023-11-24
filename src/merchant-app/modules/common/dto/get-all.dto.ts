import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export enum Order {
  asc = 1,
  desc = -1,
}

export class GetAllDto {
  @ApiPropertyOptional({ description: 'this is the page number' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 0;

  @ApiPropertyOptional({ description: 'this is the limit' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 25;

  @ApiPropertyOptional({
    description: 'this is a field name that you want to sort by, default: createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Turn pagination on and off',
  })
  @IsOptional()
  @IsBoolean()
  paginate?: boolean;

  @ApiPropertyOptional({
    description: 'This is the order of the data, asc or desc, default: asc',
    enum: Order,
  })
  @IsOptional()
  @IsEnum(Order)
  @IsInt()
  @Type(() => Number)
  order?: number = -1;
}
