import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, Length, Validate } from 'class-validator';
import { IsMongoObjectId } from '../../lib/mongodb-helper';

export class BranchCategoryImageDto {
  @ApiProperty()
  @IsUrl({ require_protocol: true, require_valid_protocol: true })
  url: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1)
  title?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1)
  description?: string;
}

export class CreateBranchCategoryDto {
  @ApiProperty()
  @IsString()
  @Length(1)
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1)
  description?: string;

  @ApiProperty()
  @Validate(IsMongoObjectId)
  branchId: string;

  @ApiProperty()
  images: BranchCategoryImageDto[];
}
