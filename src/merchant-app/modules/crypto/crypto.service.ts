import { ForbiddenException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

import { ConfigurationService } from '../config/configuration.service';

@Injectable()
export class CryptoService {
  constructor(private readonly configurationService: ConfigurationService) {}

  SALT_ROUNDS = 10;

  createHash(text): string {
    return bcrypt.hashSync(text, bcrypt.genSaltSync(this.SALT_ROUNDS));
  }

  compareHash(text, hash): boolean {
    return bcrypt.compareSync(text, hash);
  }

  createHmac(crc_token, consumer_secret) {
    return crypto.createHmac('sha256', consumer_secret).update(crc_token).digest('base64');
  }

  async createJwtToken(data): Promise<string> {
    return jwt.sign(data, this.configurationService.auth.key, { expiresIn: this.configurationService.auth.expiry });
  }

  async verifyJwtToken(token: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.configurationService.auth.key, (err, decoded) => {
        if (!err) {
          return resolve(decoded);
        }
        const error = new ForbiddenException('Invalid authorization token');
        return reject(error);
      });
    });
  }

  generateRandomNumber(): number {
    const number = Math.floor(Math.random() * 9000) + 1000;
    return number;
  }
}
