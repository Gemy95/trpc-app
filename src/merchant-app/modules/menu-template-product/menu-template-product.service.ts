import { Injectable } from '@nestjs/common';
import { MenuTemplateProductRepository } from '../models';
import { UpdateMenuTemplateProductDto } from './dto/update-menu-template-product.dto';
import { CreateMenuTemplateProductDto } from './dto/create-menu-template-product.dto';
import { FindAllMenuTemplateProductDto } from './dto/findAll-menu-template-product.dto';

@Injectable()
export class MenuTemplateProductService {
  constructor(private readonly menuTemplateProductRepository: MenuTemplateProductRepository) {}

  async create(createMenuTemplateProductDto: CreateMenuTemplateProductDto) {
    return this.menuTemplateProductRepository.createOne(createMenuTemplateProductDto);
  }

  async findOne(menuTemplateProductId: string) {
    return this.menuTemplateProductRepository.findOne(menuTemplateProductId);
  }

  async getAll(params: FindAllMenuTemplateProductDto) {
    return this.menuTemplateProductRepository.getAll(params);
  }

  async updateOne(menuTemplateProductId: string, updateMenuTemplateProductDto: UpdateMenuTemplateProductDto) {
    return this.menuTemplateProductRepository.updateOne(menuTemplateProductId, updateMenuTemplateProductDto);
  }

  async deleteOne(menuTemplateProductId: string) {
    return this.menuTemplateProductRepository.remove(menuTemplateProductId);
  }
}
