import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from '../../../../libs/database/src/lib/models/common/user.schema';
import { BaseRepository } from '../BaseRepository';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(
    @InjectModel(User.name)
    private readonly nModel: Model<User>,
  ) {
    super(nModel);
  }

  async fetchAllUsersByEmail(email: string) {
    const users = await this.nModel.aggregate([
      {
        $match: { email },
      },
      { $unset: ['password'] },
      {
        $project: {
          _id: 1,
          name: 1,
          countryCode: 1,
          mobile: 1,
          email: 1,
          type: 1,
        },
      },
      // {
      //   $skip: page <= 0 ? 0 : limit * page,
      // },
      // {
      //   $limit: limit,
      // },
    ]);

    return users;
  }
}
