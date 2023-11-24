import { Injectable } from '@nestjs/common';
import { MenuTemplateProductGroupRepository } from '../models';
import { UpdateMenuTemplateProductGroupDto } from './dto/update-menu-template-product-group.dto';
import { CreateMenuTemplateProductGroupDto } from './dto/create-menu-template-product-group.dto';
import { FindAllMenuTemplateProductGroupDto } from './dto/findAll-menu-template-product-group.dto';

@Injectable()
export class MenuTemplateProductGroupService {
  constructor(private readonly menuTemplateProductGroupRepository: MenuTemplateProductGroupRepository) {}

  async create(createMenuTemplateProductGroupDto: CreateMenuTemplateProductGroupDto) {
    return this.menuTemplateProductGroupRepository.createOne(createMenuTemplateProductGroupDto);
  }

  async findOne(menuTemplateProductGroupId: string) {
    return this.menuTemplateProductGroupRepository.findOne(menuTemplateProductGroupId);
  }

  async getAll(params: FindAllMenuTemplateProductGroupDto) {
    return this.menuTemplateProductGroupRepository.getAll(params);
  }

  async updateOne(
    menuTemplateProductGroupId: string,
    updateMenuTemplateProductGroupDto: UpdateMenuTemplateProductGroupDto,
  ) {
    return this.menuTemplateProductGroupRepository.updateOne(
      menuTemplateProductGroupId,
      updateMenuTemplateProductGroupDto,
    );
  }

  async deleteOne(menuTemplateProductGroupId: string) {
    return this.menuTemplateProductGroupRepository.remove(menuTemplateProductGroupId);
  }
}
