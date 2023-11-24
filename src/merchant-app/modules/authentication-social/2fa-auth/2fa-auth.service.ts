import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';
import { toFileStream } from 'qrcode';
import * as speakeasy from 'speakeasy';

import ERROR_CODES from '../../../../libs/utils/src/lib/errors_codes';
import { UserRepository } from '../../models/common/user.repository';
import { OwnerService } from '../../owner/owner.service';
import { ShoppexEmployeeService } from '../../shoppex-employee/shoppex-employee.service';

@Injectable()
export class TFAService {
  constructor(
    private configService: ConfigService,
    private userRepository: UserRepository,
    private ownerService: OwnerService,
    private shoppexEmployeeService: ShoppexEmployeeService,
  ) {}

  async setTwoFactorAuthenticationSecret(secret: string, user: any) {
    return this.userRepository.updateOne(
      { _id: new mongoose.Types.ObjectId(user['_id']) },
      {
        twoFactorAuthenticationSecret: secret,
      },
    );
  }

  async getUserSecret(user: any) {
    let currentUser = await this.userRepository.getOne(
      { _id: new mongoose.Types.ObjectId(user['_id']) },
      { lean: true },
    );
    return currentUser?.twoFactorAuthenticationSecret;
  }

  async turnOnUserTwoFactorAuthentication(user: any) {
    return this.userRepository.updateOne(
      { _id: new mongoose.Types.ObjectId(user['_id']) },
      {
        isTwoFactorAuthenticationEnabled: true,
      },
    );
  }

  public async pipeQrCodeStream(stream: Response, otpAuthUrl: string) {
    return toFileStream(stream, otpAuthUrl);
  }

  public async generateTwoFactorAuthenticationSecret(user: any) {
    const secret = speakeasy.generateSecret({
      name: this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'),
    });
    const otpAuthUrl = secret.otpauth_url;
    await this.setTwoFactorAuthenticationSecret(secret.base32, user);
    return {
      secret,
      otpAuthUrl,
    };
  }

  public isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, userSecret: string) {
    try {
      return speakeasy.totp.verify({
        secret: userSecret,
        encoding: 'base32',
        token: twoFactorAuthenticationCode,
      });
    } catch (error) {
      console.log('error=', error);
      throw new BadRequestException(ERROR_CODES.err_wrong_authentication_code);
    }
  }

  async loginWith2fa(data: any) {
    const user = data;
    let loginData;
    if (user?.type == 'Owner' || user?.type == 'MerchantEmployee') {
      loginData = await this.ownerService.login(
        { mobile: user?.mobile, countryCode: user?.countryCode, password: null },
        false,
      );
    } else if (user?.type == 'ShoppexEmployee' || user?.type == 'Admin') {
      loginData = await this.shoppexEmployeeService.login(
        { mobile: user?.mobile, countryCode: user?.countryCode, password: null },
        false,
      );
    }

    return loginData;
  }
}
