import { Document, FilterQuery, Model } from 'mongoose';

export abstract class EntityRepository<T extends Document> {
  constructor(protected readonly entityModel: Model<T>) {}

  async findOne(entityFilterQuery: FilterQuery<T>, projection?: Record<string, unknown>): Promise<T | null> {
    return this.entityModel
      .findOne(entityFilterQuery, {
        ...projection,
      })
      .exec();
  }

  async find(entityFilterQuery: FilterQuery<T>): Promise<T[] | null> {
    return this.entityModel.where(entityFilterQuery).exec();
  }

  async create(createEntityData) /*: Promise<T>*/ {
    const entity = new this.entityModel(createEntityData);
    return entity.save();
  }

  async update(entityFilterQuery: FilterQuery<T>, updateEntityData: any): Promise<T | null> {
    return this.entityModel.findOneAndUpdate(entityFilterQuery, updateEntityData, { new: true });
  }

  async remove(entityFilterQuery: FilterQuery<T>): Promise<boolean> {
    const result = await this.entityModel.deleteOne(entityFilterQuery);
    return result.deletedCount >= 1;
  }

  async removeMany(entityFilterQuery: FilterQuery<T>): Promise<boolean> {
    const result = await this.entityModel.deleteMany(entityFilterQuery);
    return result.deletedCount >= 1;
  }
}
