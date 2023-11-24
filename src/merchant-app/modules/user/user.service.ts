import { Injectable, NotFoundException } from '@nestjs/common';

import { ERROR_CODES } from '../../../libs/utils/src';
import { UserRepository } from '../models';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getOne(user: any) {
    const isUserExists = await this.userRepository.getById(user['_id'], {});

    if (!isUserExists) {
      throw new NotFoundException(ERROR_CODES.err_user_not_found);
    }

    return isUserExists;
  }
}
