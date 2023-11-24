import { Injectable, Res } from '@nestjs/common';

import { UserRepository } from '../../models/common/user.repository';

@Injectable()
export class FacebookAuthService {
  constructor(private userRepository: UserRepository) {}
  async facebookLogin(req, @Res() res) {
    if (!req.user) {
      return 'No user from facebook';
    }

    // const users = await this.userRepository.fetchAllUsersByEmail(req.user.email);
    // return res.send({
    //     message: 'User information from facebook',
    //     user: req.user,
    //     users
    // });
  }
}
