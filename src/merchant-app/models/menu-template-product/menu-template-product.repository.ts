import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { MenuTemplateProduct } from '../../../libs/database/src/lib/models/menu-template-product/menu-template-product.schema';
import { ERROR_CODES } from '../../../libs/utils/src';
import generateFilters from '../../modules/common/utils/generate-filters';
import { getMealsTime } from '../../modules/common/utils/get-meals-time';
import { BaseRepository } from '../BaseRepository';
// import { BUILD_STATUS, RELEASE_STATUS } from '../../menu-template-product/dto/create-menu-template-product.dto';
// import { UpdateMenuTemplateProductDto } from '../../menu-template-product/dto/update-menu-template-product.dto';
// import { FindAllMenuTemplateProductDto } from '../../menu-template-product/dto/findAll-menu-template-product.dto';
import { BUILD_STATUS, RELEASE_STATUS } from './../../modules/common/constants/product';

@Injectable()
export class MenuTemplateProductRepository extends BaseRepository<MenuTemplateProduct> {
  constructor(
    @InjectModel(MenuTemplateProduct.name)
    private readonly nModel: Model<MenuTemplateProduct>,
  ) {
    super(nModel);
  }

  // async createOne(createMenuTemplateProductDto: CreateMenuTemplateProductDto) {
  //   const menuTemplateProduct = await this.prepareMenuTemplateProduct(
  //     createMenuTemplateProductDto,
  //   );

  //   const menuTemplateProductResponse = await this.create({
  //     ...menuTemplateProduct,
  //   });

  //   return menuTemplateProductResponse;
  // }

  // async getAll(params: FindAllMenuTemplateProductDto) {
  //   const { limit, page, paginate, ...rest } = params;
  //   const generatedMatch = generateFilters(rest);

  //   const menuTemplateProducts = await this.aggregate([
  //     // {
  //     //   $match: { ...generatedMatch },
  //     // },
  //     {
  //       $skip: page <= 0 ? 0 : limit * page,
  //     },
  //     {
  //       $limit: limit,
  //     },
  //   ]);

  //   return menuTemplateProducts;
  // }

  // async findOne(menuTemplateProductId: string) {
  //   const [menuTemplateProduct] = await this._model.aggregate([
  //     {
  //       $match: {
  //         _id: new mongoose.Types.ObjectId(menuTemplateProductId),
  //       },
  //     },
  //   ]);

  //   if (!menuTemplateProduct) {
  //     throw new NotFoundException(
  //       ERROR_CODES.err_menu_template_product_not_found,
  //     );
  //   }

  //   return menuTemplateProduct;
  // }

  // async updateOne(
  //   menuTemplateProductId: string,
  //   updateMenuTemplateProductDto: UpdateMenuTemplateProductDto,
  // ) {
  //   const menuTemplateProduct = await this.prepareMenuTemplateProduct(
  //     updateMenuTemplateProductDto,
  //   );

  //   const isMenuTemplateProductExists = await this.getById(
  //     new mongoose.Types.ObjectId(menuTemplateProductId),
  //     {},
  //   );
  //   if (!isMenuTemplateProductExists) {
  //     throw new NotFoundException(
  //       ERROR_CODES.err_menu_template_product_not_found,
  //     );
  //   }
  //   return this.updateById(
  //     menuTemplateProductId,
  //     { ...menuTemplateProduct },
  //     { lean: true, new: true },
  //     {},
  //   );
  // }

  // async remove(menuTemplateProductId: string) {
  //   const menuTemplateProduct = await this.getById(
  //     new mongoose.Types.ObjectId(menuTemplateProductId),
  //     {},
  //   );
  //   if (!menuTemplateProduct) {
  //     throw new NotFoundException(
  //       ERROR_CODES.err_menu_template_product_not_found,
  //     );
  //   }
  //   await this.deleteById(menuTemplateProduct);
  //   return { success: true };
  // }

  // async prepareMenuTemplateProduct(
  //   createMenuTemplateProductDto:
  //     | CreateMenuTemplateProductDto
  //     | UpdateMenuTemplateProductDto,
  // ) {
  //   const menuTemplateProduct = new MenuTemplateProduct();

  //   menuTemplateProduct.name = createMenuTemplateProductDto.nameArabic;
  //   menuTemplateProduct.description =
  //     createMenuTemplateProductDto.descriptionArabic;

  //   menuTemplateProduct.description =
  //     createMenuTemplateProductDto.descriptionArabic;
  //   menuTemplateProduct.translation = createMenuTemplateProductDto.nameEnglish
  //     ? [
  //         {
  //           _lang: 'en',
  //           name: createMenuTemplateProductDto.nameEnglish,
  //           description: createMenuTemplateProductDto.descriptionEnglish,
  //         },
  //       ]
  //     : undefined;
  //   menuTemplateProduct.images =
  //     createMenuTemplateProductDto?.images &&
  //     createMenuTemplateProductDto?.images?.map((image) => ({
  //       url: image?.url,
  //       title: image?.titleArabic,
  //       description: image?.descriptionArabic,
  //       translation: [
  //         {
  //           _lang: 'en',
  //           title: image?.titleEnglish,
  //           description: image?.descriptionEnglish,
  //         },
  //       ],
  //     }));
  //   menuTemplateProduct.mainImage = createMenuTemplateProductDto?.mainImage && {
  //     url: createMenuTemplateProductDto?.mainImage?.url,
  //     title: createMenuTemplateProductDto?.mainImage?.titleArabic,
  //     description: createMenuTemplateProductDto?.mainImage?.descriptionArabic,
  //     translation: [
  //       {
  //         _lang: 'en',
  //         title: createMenuTemplateProductDto?.mainImage?.titleEnglish,
  //         description:
  //           createMenuTemplateProductDto?.mainImage?.descriptionEnglish,
  //       },
  //     ],
  //   };
  //   menuTemplateProduct.price = createMenuTemplateProductDto.price;
  //   menuTemplateProduct.preparationTime =
  //     createMenuTemplateProductDto.preparationTime;
  //   menuTemplateProduct.status = createMenuTemplateProductDto.status;
  //   menuTemplateProduct.calories = createMenuTemplateProductDto.calories;
  //   menuTemplateProduct.inReview = false;
  //   menuTemplateProduct.build_status = BUILD_STATUS.APPROVED_STATUS;
  //   menuTemplateProduct.release_status = RELEASE_STATUS.PRODUCTION_STATUS;
  //   menuTemplateProduct.mealsTime =
  //     createMenuTemplateProductDto?.mealsTime?.map((ele) => {
  //       return { name: ele, times: getMealsTime(ele) };
  //     });
  //   menuTemplateProduct.quantity = createMenuTemplateProductDto?.quantity;
  //   menuTemplateProduct.tagsIds = createMenuTemplateProductDto?.tagsIds?.map(
  //     (ele) => {
  //       return new mongoose.Types.ObjectId(ele);
  //     },
  //   );
  //   menuTemplateProduct.isDeleted = false;
  //   menuTemplateProduct.menuTemplateProductGroupsIds =
  //     createMenuTemplateProductDto?.menuTemplateProductGroupsIds?.map((ele) => {
  //       return new mongoose.Types.ObjectId(ele);
  //     });

  //   return menuTemplateProduct;
  // }
}
