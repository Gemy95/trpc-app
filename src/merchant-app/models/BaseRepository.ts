import { Model, UpdateWriteOpResult } from 'mongoose';
import * as _ from 'lodash';

/**
 * params:
 * page: number
 * limit: number
 * fields: comma separated values for data you want to be returned
 * lean: [false] boolean to indicate that you need only data or full mongoose object
 * sort: comma separated values, with/without minus operator Ex. sort=-table,followers
 * populate: array of arrays, which contains populate field and selection Ex. [['employees', '_id name'], ['address']]
 *           or array of mongoose populate objects objects
 *           {
 *               path: 'fans',
 *               match: { age: { $gte: 21 }},
 *               // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
 *               select: 'name -_id',
 *               options: { limit: 5 }
 *           }
 *  Note:
 *  We can send additional params from controller to service under fields _options
 *  for security this will be removed from query mutation so its only send internally by devs
 */
type GetAllParams = {
  page?: number;
  limit?: number;
  sort?: object;
  paginate?: boolean;
  populate?;
  lean?: boolean;
  returnType?: 'model_name' | 'else';
};
export class BaseRepository<T> {
  constructor(private readonly model: Model<T>) {}

  get _model() {
    return this.model;
  }

  async create(data): Promise<T> {
    const document = new this.model.prototype.constructor(data);
    return document.save();
  }

  async createMany(data) {
    return this.model.insertMany(data);
  }

  async updateOne(query, data, options?, params?): Promise<T> {
    const q = this._buildQuery(this.model.findOneAndUpdate(query, data, options), params);
    return q.exec();
  }

  async getDocumentsCount(query): Promise<number> {
    return this.model.countDocuments(query);
  }

  async exists(query): Promise<boolean> {
    const exists = await this.model.findOne(query).lean().exec();
    return !_.isNil(exists);
  }

  async getCount(query): Promise<number> {
    return this.model.countDocuments(query).exec();
  }

  async updateById(id, data, options, params): Promise<T> {
    const q = this._buildQuery(this.model.findByIdAndUpdate(id, data, options), params);
    return q.exec();
  }

  async updateMany(query, data, options, params) {
    const q = this._buildQuery(this.model.updateMany(query, data, options), params);
    return q.exec();
  }

  async delete(query): Promise<{ acknowledged: boolean; deletedCount: number }> {
    const q = this._buildQuery(this.model.updateMany(query), {});
    return q.exec();
  }

  async getAll(
    query,
    params: GetAllParams = {
      page: 0,
      limit: 25,
      sort: {},
      paginate: true,
      returnType: 'model_name',
    },
  ): Promise<T[] | { page: number; pages: number; length: number }> {
    const { page = 0, limit = 25, sort, paginate = true } = params;
    const q = this._buildQuery(this.model.find(query || {}), params);
    if (paginate) {
      q.skip(limit * page);
      q.limit(limit);
    }

    if (sort) {
      q.sort(sort);
    }
    let result = await q.exec();

    if (paginate) {
      let count;
      if (_.isEmpty(query)) {
        count = await this.getDocumentsCount({});
      } else {
        count = await this.getCount(query || {});
      }
      const pagesCount = Math.ceil(count / limit) || 1;
      if (params.returnType === 'else') {
      } else {
        result = {
          [this.model.collection.name]: result,
          page: page,
          pages: pagesCount,
          length: count,
        };
      }
    }

    return result;
  }

  _buildQuery(func, params) {
    if (_.isNil(params)) {
      return func;
    }

    const { fields, populate, lean } = params;

    if (!_.isNil(fields)) func.select(fields);
    if (!_.isNil(lean)) func.lean();

    // Add populate
    if (populate) {
      for (let i = 0; i < populate.length; i += 1) {
        if (_.isArray(populate[i])) {
          func.populate(...populate[i]);
        } else {
          func.populate(populate[i]);
        }
      }
    }

    return func;
  }

  async getOne(query, params?): Promise<T> {
    const q = this._buildQuery(this.model.findOne(query || {}), params);
    return q.exec();
  }

  async getById(id, params): Promise<T> {
    const q = this._buildQuery(this.model.findById(id), params);
    return q.exec();
  }

  async deleteOne(query): Promise<T> {
    const q = this.model.findOneAndRemove(query);
    return q.exec();
  }

  async deleteById(id): Promise<T> {
    const q = this.model.findByIdAndDelete(id);
    return q.exec();
  }

  async aggregate(query, params = { page: 1, limit: 25, sort: {}, paginate: true }) {
    const { page, paginate } = params;
    let { limit } = params;
    let pagesCount, count;
    if (paginate) {
      query.push({ $count: 'length' });
      count = await this.model.aggregate(query);
      if (count.length > 0) {
        count = count[0].length;
      } else {
        count = 0;
      }
      query.pop();
      if (!limit) limit = count;
      pagesCount = Math.ceil(count / limit) || 1;

      query.push({
        $facet: {
          [this.model.collection.name]: [{ $skip: page <= 0 ? 0 : limit * (page - 1) }, { $limit: limit || 0 }],
        },
      });
    }
    const q = this.model.aggregate(query);

    let result: any = await q.exec();

    if (paginate) {
      result = {
        [this.model.collection.name]: result[0][this.model.collection.name],
        page: page || 0,
        pages: pagesCount,
        length: count,
      };
    }

    return result;
  }
}
