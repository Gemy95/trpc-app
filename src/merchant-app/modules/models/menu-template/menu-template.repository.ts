import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { Product } from '..';
import { MenuTemplate } from '../../../../libs/database/src/lib/models/menu-template/menu-template.schema';
import { ProductCategory } from '../../../../libs/database/src/lib/models/productCategory/productCategory.schema';
import { ERROR_CODES } from '../../../../libs/utils/src';
import { BUILD_STATUS, RELEASE_STATUS } from '../../common/constants/product';
import generateFilters from '../../common/utils/generate-filters';
import { getMealsTime } from '../../common/utils/get-meals-time';
import { CreateMenuTemplateDto } from '../../menu-template/dto/create-menu-template.dto';
import { FindAllMenuTemplateDto } from '../../menu-template/dto/findAll-menu-template.dto';
import { UpdateMenuTemplateDto } from '../../menu-template/dto/update-menu-template.dto';
import { ProductService } from '../../product/product.service';
import { BaseRepository } from '../BaseRepository';
import { SettingRepository } from '../setting/setting.repository';

@Injectable()
export class MenuTemplateRepository extends BaseRepository<MenuTemplate> {
  constructor(
    @InjectModel(MenuTemplate.name) private readonly nModel: Model<MenuTemplate>,
    private readonly settingRepository: SettingRepository,
    private readonly productService: ProductService,
  ) {
    super(nModel);
  }

  async createOne(createMenuTemplateDto: CreateMenuTemplateDto) {
    const isMenuTemplateExists = await this.getOne(
      {
        name: createMenuTemplateDto.nameArabic,
        categoryId: new mongoose.Types.ObjectId(createMenuTemplateDto.categoryId),
      },
      { lean: true },
    );

    if (isMenuTemplateExists) {
      throw new BadRequestException(ERROR_CODES.err_menu_template_already_exists);
    }

    const menuTemplate = await this.prepareMenuTemplate(createMenuTemplateDto);

    const menuTemplateResponse = await this.create({ ...menuTemplate });

    return menuTemplateResponse;
  }

  async getAll(params: FindAllMenuTemplateDto) {
    const { limit, page, paginate, ...rest } = params;
    const generatedMatch = generateFilters(rest);

    const menuTemplates = await this.aggregate([
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

    return menuTemplates;
  }

  async findOne(menuTemplateId: string) {
    const [menuTemplate] = await this._model.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(menuTemplateId),
        },
      },
    ]);

    if (!menuTemplate) {
      throw new NotFoundException(ERROR_CODES.err_menu_template_not_found);
    }

    return menuTemplate;
  }

  async updateOne(menuTemplateId: string, updateMenuTemplateDto: UpdateMenuTemplateDto) {
    const menuTemplate = await this.prepareMenuTemplate(updateMenuTemplateDto);

    const isMenuTemplateExists = await this.getById(new mongoose.Types.ObjectId(menuTemplateId), {});
    if (!isMenuTemplateExists) {
      throw new NotFoundException(ERROR_CODES.err_menu_template_not_found);
    }
    return this.updateById(menuTemplateId, { ...menuTemplate }, { lean: true, new: true }, {});
  }

  async remove(menuTemplateId: string) {
    const menuTemplate = await this.getById(new mongoose.Types.ObjectId(menuTemplateId), {});
    if (!menuTemplate) {
      throw new NotFoundException(ERROR_CODES.err_menu_template_not_found);
    }
    await this.deleteById(menuTemplate);
    return { success: true };
  }

  async prepareMenuTemplate(createMenuTemplateDto: CreateMenuTemplateDto | UpdateMenuTemplateDto) {
    const menuTemplate = new MenuTemplate();
    menuTemplate.name = createMenuTemplateDto?.nameArabic;
    menuTemplate.translation = createMenuTemplateDto?.nameEnglish
      ? [
          {
            _lang: 'en',
            name: createMenuTemplateDto.nameEnglish,
          },
        ]
      : undefined;

    menuTemplate.categoryId = new mongoose.Types.ObjectId(createMenuTemplateDto?.categoryId);

    const productCategoryAndProductsResult = createMenuTemplateDto?.productCategoryAndProducts?.map((ele) => {
      const productCategory = new ProductCategory();
      productCategory.name = ele?.nameArabic;
      productCategory.translation = ele?.nameEnglish
        ? [
            {
              _lang: 'en',
              name: ele.nameEnglish,
            },
          ]
        : undefined;
      productCategory.image = ele?.image;
      productCategory.status = ele?.status;
      productCategory.isDeleted = false;

      // const products = ele?.products?.map(ele2 => {
      //   const newProduct = new Product();
      //   newProduct.name = ele2?.nameArabic;
      //   newProduct.description = ele2?.descriptionArabic;
      //   newProduct.translation =
      //     ele2?.nameEnglish || ele2?.descriptionEnglish
      //       ? [
      //           {
      //             _lang: 'en',
      //             name: ele2?.nameEnglish || undefined,
      //             description: ele2?.descriptionEnglish || undefined,
      //           },
      //         ]
      //       : undefined;
      //   newProduct.images =
      //     ele2?.images &&
      //     ele2?.images?.map(image => ({
      //       url: image?.url,
      //       title: image?.titleArabic,
      //       description: image?.descriptionArabic,
      //       translation: (image?.titleEnglish) ? [
      //         {
      //           _lang: 'en',
      //           title: image?.titleEnglish,
      //           description: image?.descriptionEnglish,
      //         },
      //       ] : undefined
      //     }));
      //   newProduct.mainImage = ele2?.mainImage && {
      //     url: ele2?.mainImage?.url,
      //     title: ele2?.mainImage?.titleArabic,
      //     description: ele2?.mainImage?.descriptionArabic,
      //     translation: (ele2?.mainImage?.titleEnglish) ? [
      //       {
      //         _lang: 'en',
      //         title: ele2?.mainImage?.titleEnglish,
      //         description: ele2?.mainImage?.descriptionEnglish,
      //       },
      //     ] : undefined
      //   };
      //   newProduct.price = ele2?.price;
      //   newProduct.preparationTime = ele2?.preparationTime;
      //   newProduct.status = ele2?.status;
      //   newProduct.calories = ele2?.calories;
      //   newProduct.mealsTime =
      //     ele2?.mealsTime?.map(ele => {
      //       return { name: ele, times: getMealsTime(ele) };
      //     }) || [];
      //   newProduct.tagsIds = ele2?.tagsIds.map((ele)=>{ return new mongoose.Types.ObjectId(ele) });
      //   newProduct.build_status = BUILD_STATUS.APPROVED_STATUS;
      //   newProduct.release_status = RELEASE_STATUS.PRODUCTION_STATUS;
      //   newProduct.isDeleted = false;

      //   return {
      //     ...newProduct,
      //   };
      // });

      const menuTemplateProductsIds = ele.menuTemplateProductsIds.map((ele) => {
        return new mongoose.Types.ObjectId(ele);
      });
      return {
        ...productCategory,
        menuTemplateProductsIds,
      };
    });

    menuTemplate.productCategoryAndProducts = productCategoryAndProductsResult;

    return menuTemplate;
  }
}
