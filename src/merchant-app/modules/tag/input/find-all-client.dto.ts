import { Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

export class CategoryTag {
  // @Field()
  @IsString()
  categoryId: string;
}

export class FindAllClientTagDto {
  // @Field()
  @ValidateNested({ each: true })
  @Type(() => CategoryTag)
  categoriesIds: CategoryTag[];
}
