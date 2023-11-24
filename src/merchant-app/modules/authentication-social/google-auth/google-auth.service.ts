import { Injectable, Res } from '@nestjs/common';

import { UserRepository } from '../../models/common/user.repository';

@Injectable()
export class GoogleAuthService {
  constructor(private userRepository: UserRepository) {}
  async googleLogin(req, @Res() res) {
    if (!req.user) {
      return 'No user from google';
    }

    const users = await this.userRepository.fetchAllUsersByEmail(req.user.email);
    return res.send({
      message: 'User information from google',
      user: req.user,
      users,
    });
    // return res.redirect("https://www.google.com/");
  }
}
