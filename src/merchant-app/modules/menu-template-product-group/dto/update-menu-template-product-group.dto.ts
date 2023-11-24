import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuTemplateProductGroupDto } from './create-menu-template-product-group.dto';

export class UpdateMenuTemplateProductGroupDto extends PartialType(CreateMenuTemplateProductGroupDto) {}
