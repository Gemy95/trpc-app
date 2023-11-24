import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuTemplateProductDto } from './create-menu-template-product.dto';

export class UpdateMenuTemplateProductDto extends PartialType(CreateMenuTemplateProductDto) {}
