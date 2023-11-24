import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { MenuTemplateProductGroup } from '../../../../libs/database/src/lib/models/menu-template-product-group/menu-template-product-group.schema';
import { ERROR_CODES } from '../../../../libs/utils/src';
import generateFilters from '../../common/utils/generate-filters';
import { CreateMenuTemplateProductGroupDto } from '../../menu-template-product-group/dto/create-menu-template-product-group.dto';
import { FindAllMenuTemplateProductGroupDto } from '../../menu-template-product-group/dto/findAll-menu-template-product-group.dto';
import { UpdateMenuTemplateProductGroupDto } from '../../menu-template-product-group/dto/update-menu-template-product-group.dto';
import { BaseRepository } from '../BaseRepository';

@Injectable()
export class MenuTemplateProductGroupRepository extends BaseRepository<MenuTemplateProductGroup> {
  constructor(@InjectModel(MenuTemplateProductGroup.name) private readonly nModel: Model<MenuTemplateProductGroup>) {
    super(nModel);
  }

  async createOne(createMenuTemplateProductGroupDto: CreateMenuTemplateProductGroupDto) {
    const menuTemplateProductGroup = await this.prepareMenuTemplateProductGroup(createMenuTemplateProductGroupDto);

    // need to check if exists from before
    const menuTemplateProductGroupResponse = await this.create({ ...menuTemplateProductGroup });

    return menuTemplateProductGroupResponse;
  }

  async getAll(params: FindAllMenuTemplateProductGroupDto) {
    const { limit, page, paginate, ...rest } = params;
    const generatedMatch = generateFilters(rest);

    const menuTemplateProductGroups = await this.aggregate([
      // {
      //   $match: { ...generatedMatch },
      // },
      {
        $skip: page <= 0 ? 0 : limit * page,
      },
      {
        $limit: limit,
      },
    ]);

    return menuTemplateProductGroups;
  }

  async findOne(menuTemplateProductGroupId: string) {
    const [menuTemplateProductGroup] = await this._model.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(menuTemplateProductGroupId),
        },
      },
    ]);

    if (!menuTemplateProductGroup) {
      throw new NotFoundException(ERROR_CODES.err_menu_template_product_group_not_found);
    }

    return menuTemplateProductGroup;
  }

  async updateOne(
    menuTemplateProductGroupId: string,
    updateMenuTemplateProductGroupDto: UpdateMenuTemplateProductGroupDto,
  ) {
    const menuTemplateProductGroup = await this.prepareMenuTemplateProductGroup(updateMenuTemplateProductGroupDto);

    const isMenuTemplateProductGroupExists = await this.getById(
      new mongoose.Types.ObjectId(menuTemplateProductGroupId),
      {},
    );
    if (!isMenuTemplateProductGroupExists) {
      throw new NotFoundException(ERROR_CODES.err_menu_template_product_group_not_found);
    }
    return this.updateById(menuTemplateProductGroupId, { ...menuTemplateProductGroup }, { lean: true, new: true }, {});
  }

  async remove(menuTemplateProductGroupId: string) {
    const menuTemplateProductGroup = await this.getById(new mongoose.Types.ObjectId(menuTemplateProductGroupId), {});
    if (!menuTemplateProductGroup) {
      throw new NotFoundException(ERROR_CODES.err_menu_template_product_group_not_found);
    }
    await this.deleteById(menuTemplateProductGroup);
    return { success: true };
  }

  async prepareMenuTemplateProductGroup(
    createMenuTemplateProductGroupDto: CreateMenuTemplateProductGroupDto | UpdateMenuTemplateProductGroupDto,
  ) {
    const menuTemplateProductGroup = new MenuTemplateProductGroup();
    menuTemplateProductGroup.name = createMenuTemplateProductGroupDto?.nameArabic;
    menuTemplateProductGroup.maximum = createMenuTemplateProductGroupDto?.maximum;
    menuTemplateProductGroup.minimum = createMenuTemplateProductGroupDto?.minimum;
    menuTemplateProductGroup.required = createMenuTemplateProductGroupDto?.required;
    menuTemplateProductGroup.status = createMenuTemplateProductGroupDto?.status;
    menuTemplateProductGroup.isDeleted = false;
    menuTemplateProductGroup.translation = createMenuTemplateProductGroupDto?.nameEnglish
      ? [
          {
            _lang: 'en',
            name: createMenuTemplateProductGroupDto.nameEnglish,
          },
        ]
      : undefined;
    menuTemplateProductGroup.options = createMenuTemplateProductGroupDto?.options?.map((option) => {
      return {
        name: option?.nameArabic,
        translation: option?.nameEnglish
          ? [
              {
                _lang: 'en',
                name: option?.nameEnglish,
              },
            ]
          : undefined,
        extraPrice: option?.extraPrice,
        serialDisplayNumber: option?.serialDisplayNumber,
      };
    });

    return menuTemplateProductGroup;
  }
}
