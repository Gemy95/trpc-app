import { Injectable } from '@nestjs/common';
import mongoose, { Types } from 'mongoose';
import { ProductGroup, ProductGroupRepository } from '../models';
import { CreateProductGroupDto } from './dto/create-product-group.dto';
import { GetAllProductGroupDto, GetAllProductGroupInput } from './dto/get-product-group.dto';
import { ReorderSerialNumberDto } from './dto/reorder-product-group-serial.dto';
import { UpdateProductGroupDto } from './dto/update-product-group.dto';

@Injectable()
export class ProductGroupService {
  constructor(private productGroupRepository: ProductGroupRepository) {}

  async create(merchantId: string, createProductGroupDto: CreateProductGroupDto) {
    const merchantProductGroupsCount = await this.productGroupRepository.getDocumentsCount({
      merchantId: new mongoose.Types.ObjectId(merchantId),
    });

    const newProductGroup = new ProductGroup();
    newProductGroup.name = createProductGroupDto.nameArabic;
    newProductGroup.maximum = createProductGroupDto.maximum;
    newProductGroup.minimum = createProductGroupDto.minimum;
    newProductGroup.required = createProductGroupDto.required;
    newProductGroup.status = createProductGroupDto.status;
    newProductGroup.merchantId = new mongoose.Types.ObjectId(merchantId);
    newProductGroup.translation = [
      {
        _lang: 'en',
        name: createProductGroupDto.nameEnglish,
      },
    ];
    newProductGroup.serialDisplayNumber = merchantProductGroupsCount + 1;
    newProductGroup.options = createProductGroupDto.options.map((option) => {
      return {
        name: option.nameArabic,
        translation: [
          {
            _lang: 'en',
            name: option.nameEnglish,
          },
        ],
        extraPrice: option.extraPrice,
        serialDisplayNumber: option.serialDisplayNumber,
      };
    });

    return this.productGroupRepository.create(newProductGroup);
  }

  async findAll(merchantId: string, query: GetAllProductGroupInput) {
    const { limit, order, page, sortBy } = query;
    const data = await this.productGroupRepository.aggregate([
      {
        $match: {
          merchantId: new Types.ObjectId(merchantId),
          isDeleted: false,
        },
      },
      {
        $sort: { serialDisplayNumber: 1 },
      },
      {
        $skip: page <= 0 ? 0 : limit * page,
      },
      {
        $limit: limit,
      },
    ]);

    const sortedGroups = data?.['productgroups']?.map((group) => {
      const sortedOptions = group?.options?.sort((a, b) => {
        return a?.serialDisplayNumber < b?.serialDisplayNumber
          ? -1
          : a?.serialDisplayNumber > b?.serialDisplayNumber
          ? 1
          : 0;
      });
      return { ...group, options: sortedOptions };
    });

    return { ...data, productgroups: sortedGroups };
  }

  findOne(merchantId: string, productGroupId: string) {
    return this.productGroupRepository.getOne(
      {
        _id: new Types.ObjectId(productGroupId),
        merchantId: new Types.ObjectId(merchantId),
        isDeleted: false,
      },
      { lean: true },
    );
  }

  update(merchantId: string, productGroupId: string, updateProductGroupDto: UpdateProductGroupDto) {
    const updateProductGroupData = {
      ...updateProductGroupDto,
      name: updateProductGroupDto?.nameArabic ? updateProductGroupDto.nameArabic : undefined,
      translation: updateProductGroupDto?.nameEnglish
        ? [
            {
              _lang: 'en',
              name: updateProductGroupDto.nameEnglish,
            },
          ]
        : undefined,
      options: updateProductGroupDto?.options
        ? updateProductGroupDto.options.map((option) => ({
            name: option.nameArabic,
            translation: {
              _lang: 'en',
              name: option.nameEnglish,
            },
            extraPrice: option.extraPrice,
          }))
        : undefined,
    };

    return this.productGroupRepository.updateOne(
      {
        _id: new Types.ObjectId(productGroupId),
        merchantId: new Types.ObjectId(merchantId),
        isDeleted: false,
      },
      updateProductGroupData,
      { new: true },
    );
  }

  remove(merchantId: string, productGroupId: string) {
    return this.productGroupRepository.updateOne(
      {
        _id: new Types.ObjectId(productGroupId),
        merchantId: new Types.ObjectId(merchantId),
      },
      { isDeleted: true },
      { new: true },
    );
  }

  public async reOrderSerialNumber(reorderSerialNumber: ReorderSerialNumberDto) {
    const result = await Promise.all(
      reorderSerialNumber.serials.map((element) =>
        this.productGroupRepository.updateOne(
          {
            _id: new mongoose.Types.ObjectId(element.id),
          },
          {
            serialDisplayNumber: element.newSerialNumber,
          },
          { new: true, lean: true },
        ),
      ),
    );
    return result.sort((a, b) => {
      return a.serialDisplayNumber < b.serialDisplayNumber ? -1 : a.serialDisplayNumber > b.serialDisplayNumber ? 1 : 0;
    });
  }

  public async serialsReorderProductGroupOption(productGroupId: string, reorderSerialNumber: ReorderSerialNumberDto) {
    const result = await Promise.all(
      reorderSerialNumber.serials.map((element) =>
        this.productGroupRepository.updateOne(
          {
            _id: new mongoose.Types.ObjectId(productGroupId),
            'options._id': new mongoose.Types.ObjectId(element.id),
          },
          {
            'options.$.serialDisplayNumber': element.newSerialNumber,
          },
          { new: true, lean: true },
        ),
      ),
    );
    const sortedOptions = result[result?.length - 1]?.options?.sort((a, b) => {
      return a?.serialDisplayNumber < b?.serialDisplayNumber
        ? -1
        : a?.serialDisplayNumber > b?.serialDisplayNumber
        ? 1
        : 0;
    });
    return sortedOptions;
  }
}
