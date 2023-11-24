import { Injectable } from '@nestjs/common';
import { MenuTemplateRepository } from '../models';
import { UpdateMenuTemplateDto } from './dto/update-menu-template.dto';
import { CreateMenuTemplateDto } from './dto/create-menu-template.dto';
import { FindAllMenuTemplateDto } from './dto/findAll-menu-template.dto';

@Injectable()
export class MenuTemplateService {
  constructor(private readonly menuTemplateRepository: MenuTemplateRepository) {}

  async create(createMenuTemplateDto: CreateMenuTemplateDto) {
    return this.menuTemplateRepository.createOne(createMenuTemplateDto);
  }

  async findOne(menuTemplateId: string) {
    return this.menuTemplateRepository.findOne(menuTemplateId);
  }

  async getAll(params: FindAllMenuTemplateDto) {
    return this.menuTemplateRepository.getAll(params);
  }

  async updateOne(menuTemplateId: string, updateMenuTemplateDto: UpdateMenuTemplateDto) {
    return this.menuTemplateRepository.updateOne(menuTemplateId, updateMenuTemplateDto);
  }

  async deleteOne(menuTemplateId: string) {
    return this.menuTemplateRepository.remove(menuTemplateId);
  }
}
