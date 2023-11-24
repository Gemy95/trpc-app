import { HttpException, HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
// eslint-disable-next-line @typescript-eslint/no-var-requires
import generateOtp from 'gen-totp';
import { omit } from 'lodash';
import * as _ from 'lodash';

import { ERROR_CODES } from '../../../libs/utils/src';
import { ConfigurationService } from '../config/configuration.service';
import { CryptoService } from '../crypto/crypto.service';
import { MailService } from '../mail/mail.service';
import { User, UserRepository } from '../models';
import ISendSMS from '../sms/interfaces/send-sms.interface';
import { SmsService } from '../sms/sms.service';
import { ChangePasswordDto } from './dto/change-password';
import { LoginDto } from './dto/login-auth.dto';
import { createCacheKey } from './helpers/create-cache-key';
import IUserOtp from './interfaces/user-otp.interface';
import { AuthUserType } from './shared/constants/auth.types.enum';
import { getJwtModuleOptions } from './shared/utils/auth.jwtOptions';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cryptoService: CryptoService,
    private readonly mailService: MailService,
    private readonly smsService: SmsService,
    private jwtService: JwtService,
    private configService: ConfigurationService,
  ) {}

  private async _setOtp(data: User, type: string): Promise<string> {
    const { _id, uuid, email, mobile } = data;

    const otp = generateOtp(uuid ?? _id, { digits: 6 });
    const userOtp: IUserOtp = {
      otp,
      email,
      mobile,
      numberOfTries: 3,
    };

    let key: string;
    if (type === 'email') {
      key = createCacheKey({ partOne: uuid, partTwo: email });
    }

    if (type === 'mobile') {
      key = createCacheKey({ partOne: uuid, partTwo: mobile });
    }

    return otp;
  }

  private async setOtpToEmail(data: User) {
    const otp: string = await this._setOtp(data, 'email');
    await this.mailService.otpEmail(data, otp);
  }

  private async setOtpToMobile(data: User) {
    const otp: string = await this._setOtp(data, 'mobile');

    const smsData: ISendSMS = {
      CountryCode: data.countryCode,
      mobileno: data.mobile,
      msgtext: `This is the opt: ${otp}`,
    };

    this.smsService.sendSms(smsData);
  }

  async login(loginDto: LoginDto) {
    const { mobile, password, countryCode } = loginDto;

    const user = await this.userRepository.getOne(
      {
        mobile,
        countryCode,
        mobileIsVerified: true,
      },
      { lean: true },
    );

    if (!user) {
      throw new HttpException(ERROR_CODES.err_mobile_number_or_password_not_correct, 403);
    }

    const isPasswordMatch = await this.cryptoService.compareHash(password, user.password);

    if (!isPasswordMatch) {
      throw new HttpException(ERROR_CODES.err_mobile_number_or_password_not_correct, 403);
    }

    if (!user.mobileIsVerified) {
      await this.setOtpToMobile(user);
      await this.setOtpToEmail(user);
      throw new HttpException(ERROR_CODES.err_mobile_not_verified, 403);
    }

    const token = await this.cryptoService.createJwtToken({
      ...omit(user, ['password']),
    });

    return {
      ...omit(user, ['password']),
      token,
    };
  }

  async changePassword(changePasswordDto: ChangePasswordDto, user: any) {
    const { email } = user;
    const { newPassword, oldPassword } = changePasswordDto;

    const userData = await this.userRepository.getOne({ email });
    if (!userData) {
      throw new UnprocessableEntityException(ERROR_CODES.err_access_denied);
    }

    const isPasswordMatch = await this.cryptoService.compareHash(oldPassword, userData.password);
    if (!isPasswordMatch) {
      throw new HttpException(ERROR_CODES.err_password_does_not_match, HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await this.cryptoService.createHash(newPassword);

    const userUpdated = await this.userRepository.updateOne(
      { _id: user._id },
      { password: hashedPassword },
      { new: true, lean: true },
    );

    const token = await this.cryptoService.createJwtToken({
      ...omit(userUpdated, ['password']),
    });

    return {
      ...omit(userUpdated, ['password']),
      token,
    };
  }

  generateTokens(
    authUserType: AuthUserType,
    payload: any, // need update IClient | IAdmin | IOwner etc...
  ): { accessToken: string; refreshToken: string } {
    const accessTokenOptions: JwtSignOptions = getJwtModuleOptions(
      Buffer.from(this.configService.auth[`ACCESS_TOKEN_${authUserType}_PRIVATE_KEY`], 'base64').toString('ascii'),
      'RS256',
      this.configService.auth[`ACCESS_TOKEN_${authUserType}_EXPIRY_IN`],
      'Shoppex',
      'iam@user.me',
      authUserType,
    );

    const accessToken = this.jwtService.sign(payload, accessTokenOptions);

    const refreshTokenOptions: JwtSignOptions = getJwtModuleOptions(
      Buffer.from(this.configService.auth[`REFRESH_TOKEN_${authUserType}_PRIVATE_KEY`], 'base64').toString('ascii'),
      'RS256',
      this.configService.auth[`REFRESH_TOKEN_${authUserType}_EXPIRY_IN`],
      'Shoppex',
      'iam@user.me',
      authUserType,
    );

    const refreshToken = this.jwtService.sign(payload, refreshTokenOptions);

    return {
      accessToken,
      refreshToken,
    };
  }
}
