import { PartialType } from '@nestjs/mapped-types';
import { GetAllDto } from '../../common/input/get-all.dto';

export class FindAllMenuTemplateProductGroupDto extends PartialType(GetAllDto) {}
