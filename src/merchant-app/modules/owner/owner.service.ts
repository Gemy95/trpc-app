import { RedisService } from '@liaoliaots/nestjs-redis';
import {
  BadRequestException,
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import generateOtp from 'gen-totp';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import mongoose from 'mongoose';
import { v4 as uuidv } from 'uuid';
import { validate as isValidUUID } from 'uuid';

import { ERROR_CODES } from '../../../libs/utils/src';
import { AuthService } from '../auth/auth.service';
import { AuthUserType } from '../auth/shared/constants/auth.types.enum';
import { Activity } from '../common/constants/activities.event.constants';
import { MERCHANT_STATUS } from '../common/constants/merchant';
import { REDIS_MERCHANT_EMPLOYEE_NAME_SPACE } from '../common/constants/merchant-employee';
import { REDIS_OWNER_NAME_SPACE, VERIFY_TYPE } from '../common/constants/owner.constants';
import { OTP_VERIFICATION_TYPE_EMAIL, OTP_VERIFICATION_TYPE_MOBILE } from '../common/constants/users.types';
import { CryptoService } from '../crypto/crypto.service';
import { OwnerFiltersQuery } from '../dashboard/dto/owner-filters.dto';
import { MailService } from '../mail/mail.service';
import { MerchantEmployee, MerchantEmployeeRepository, MerchantRepository, Owner, OwnerRepository } from '../models';
import { SettingService } from '../setting/setting.service';
import ISendSMS from '../sms/interfaces/send-sms.interface';
import { SmsService } from '../sms/sms.service';
import { AdminUpdateOwnerDto } from './dto/admin-update-owner';
import { ChangePasswordOwnerDto } from './dto/change-password-owner';
import { BodyConfirmOwnerDto, ParamsConfirmOwnerDto } from './dto/confirm-owner';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { LoginOwnerDto } from './dto/login-owner';
import { RequestCancelDeleteAccountOwnerDto } from './dto/request-cancel-delete-account-owner';
import { RequestChangeEmailOwnerDto } from './dto/request-change-email-owner';
import { RequestChangeMobileOwnerDto } from './dto/request-change-mobile-owner';
import { RequestForgetPasswordOwnerDto } from './dto/request-forget-password-owner';
import { ResendOtpOwnerDto } from './dto/resend-otp-owner.dto';
import { UpdateOwnerByItselfDto } from './dto/update-owner-by-itself';
import { VerifyCancelDeleteAccountOwnerDto } from './dto/verify-cancel-delete-account-owner';
import { VerifyChangeEmailOwnerDto } from './dto/verify-change-email-owner';
import { VerifyChangeMobileOwnerDto } from './dto/verify-change-mobile-owner';
import { VerifyForgetPasswordOwnerDto } from './dto/verify-forget-password-owner';
import { VerifyMobileOwnerDto } from './dto/verify-mobile-owner';
import { createCacheKey } from './helpers/create-cache-key';
import IOwnerOtp from './interface/owner-otp';

@Injectable()
export class OwnerService {
  constructor(
    private readonly ownerRepository: OwnerRepository,
    private readonly cryptoService: CryptoService,
    private readonly mailService: MailService,
    private readonly smsService: SmsService,
    public readonly redisService: RedisService,
    private readonly merchantEmployeeRepository: MerchantEmployeeRepository,
    public readonly settingService: SettingService,
    @Inject('ACTIVITIES') private readonly activitiesClient: ClientProxy,
    private readonly authService: AuthService,
    private readonly merchantRepository: MerchantRepository,
  ) {}

  private async _setOtp(data: Owner | MerchantEmployee, type: string): Promise<string> {
    const { _id, uuid, email, mobile } = data;
    const otp = generateOtp(uuid ?? _id, { digits: 6 });
    const ownerOtp: IOwnerOtp = {
      otp,
      email,
      mobile,
      numberOfTries: 3,
    };
    const key =
      type === 'email'
        ? createCacheKey({ partOne: _id.toString(), partTwo: email })
        : createCacheKey({ partOne: _id.toString(), partTwo: mobile });

    const isRedisEmailKey = await this.redisService
      .getClient(data.type == 'Owner' ? REDIS_OWNER_NAME_SPACE : REDIS_MERCHANT_EMPLOYEE_NAME_SPACE)
      .get(key);

    if (isRedisEmailKey) {
      throw new HttpException(ERROR_CODES.err_otp_request_exceeded, 429);
    }

    await this.redisService
      .getClient(data.type == 'Owner' ? REDIS_OWNER_NAME_SPACE : REDIS_MERCHANT_EMPLOYEE_NAME_SPACE)
      .set(key, JSON.stringify(ownerOtp), 'EX', 90);

    return otp;
  }

  private async setOtpToEmail(data: Owner | MerchantEmployee): Promise<{ success: boolean }> {
    const otp = await this._setOtp(data, 'email');
    return await this.mailService.otpEmail(data, otp);
  }

  private async setOtpToMobile(data: Owner | MerchantEmployee) {
    const otp = await this._setOtp(data, 'mobile');

    const smsData: ISendSMS = {
      CountryCode: data.countryCode,
      mobileno: data.mobile,
      msgtext: `This is the opt: ${otp}`,
    };

    return this.smsService.sendSms(smsData);
  }

  private async _verifyOtp(data: Owner | MerchantEmployee, otp: string, type: string) {
    const key =
      type === 'email'
        ? createCacheKey({
            partOne: data._id.toString(),
            partTwo: data.email,
          })
        : createCacheKey({
            partOne: data._id.toString(),
            partTwo: data.mobile,
          });

    const ownerObjectString = await this.redisService
      .getClient(data.type === 'Owner' ? REDIS_OWNER_NAME_SPACE : REDIS_MERCHANT_EMPLOYEE_NAME_SPACE)
      .get(key);

    if (_.isNil(ownerObjectString)) {
      throw new BadRequestException(ERROR_CODES.err_otp_expired);
    }

    let ownerOtp: IOwnerOtp = JSON.parse(ownerObjectString);

    const { numberOfTries } = ownerOtp;

    if (numberOfTries <= 0) {
      await this.redisService
        .getClient(data.type == 'Owner' ? REDIS_OWNER_NAME_SPACE : REDIS_MERCHANT_EMPLOYEE_NAME_SPACE)
        .del(key);
      throw new HttpException(ERROR_CODES.err_otp_request_exceeded, 429);
    } else if (ownerOtp.otp !== otp) {
      const updatedNumberOfTries = numberOfTries - 1;

      ownerOtp = {
        ...ownerOtp,
        numberOfTries: updatedNumberOfTries,
      };

      await this.redisService
        .getClient(data.type == 'Owner' ? REDIS_OWNER_NAME_SPACE : REDIS_MERCHANT_EMPLOYEE_NAME_SPACE)
        .set(key, JSON.stringify(ownerOtp));

      throw new BadRequestException(
        ERROR_CODES.err_wrong_otp_remaining.replace('_remaining', `, You have: ${updatedNumberOfTries}`),
      );
    }

    await this.redisService
      .getClient(data.type == 'Owner' ? REDIS_OWNER_NAME_SPACE : REDIS_MERCHANT_EMPLOYEE_NAME_SPACE)
      .del(key);

    return true;
  }

  private async verifyEmailOtp(data: Owner | MerchantEmployee, otp: string): Promise<boolean> {
    return await this._verifyOtp(data, otp, 'email');
  }

  private async verifyMobileOtp(data: Owner | MerchantEmployee, otp: string): Promise<boolean> {
    return await this._verifyOtp(data, otp, 'mobile');
  }

  async create(createOwnerDto: CreateOwnerDto) {
    const { password, email, mobile } = createOwnerDto;

    const isEmailExists = await this.ownerRepository.exists({
      email,
      isDeleted: false,
    });
    const isPhoneExists = await this.ownerRepository.exists({
      mobile,
      isDeleted: false,
    });

    const isEmailExists_merchant_employee = await this.merchantEmployeeRepository.exists({
      email,
      isDeleted: false,
    });
    const isPhoneExists_merchant_employee = await this.merchantEmployeeRepository.exists({
      mobile,
      isDeleted: false,
    });

    if (isEmailExists || isEmailExists_merchant_employee) {
      throw new ConflictException(ERROR_CODES.err_email_already_in_use);
    }

    if (isPhoneExists || isPhoneExists_merchant_employee) {
      throw new ConflictException(ERROR_CODES.err_phone_number_already_in_use);
    }

    if (!createOwnerDto?.uuid) {
      Object.assign(createOwnerDto, { uuid: uuidv() });
    }

    const owner = await this.ownerRepository.create({
      ...createOwnerDto,
      password: this.cryptoService.createHash(password),
    });

    const verificationType = (await this.settingService.checkVerificationSetting()) || {
      otp_verify_type: OTP_VERIFICATION_TYPE_MOBILE,
    };

    if (verificationType?.otp_verify_type === OTP_VERIFICATION_TYPE_MOBILE && !owner.mobileIsVerified) {
      await this.setOtpToMobile(owner);
    }

    if (verificationType?.otp_verify_type === OTP_VERIFICATION_TYPE_EMAIL && !owner.emailIsVerified) {
      await this.setOtpToEmail(owner);
    }

    const payload = _.omit(owner, [
      'password',
      'city',
      'country',
      'totalOrdersCount',
      'totalMerchantEmployeesCount',
      'createdAt',
      'updateAt',
    ]);

    const { accessToken, refreshToken } = this.authService.generateTokens(AuthUserType.OWNER, payload);

    return {
      ..._.omit(owner, ['password']),
      token: accessToken,
      refreshToken,
    };
  }

  async verifyMobile(verifyMobileOwnerDto: VerifyMobileOwnerDto) {
    const { countryCode, mobile, otp } = verifyMobileOwnerDto;
    let user;

    [user] = await this.ownerRepository.login(countryCode, mobile);
    if (!user) {
      user = await this.merchantEmployeeRepository.merchantEmployeeLogin(countryCode, mobile);
    }

    if (!user) {
      throw new NotFoundException(ERROR_CODES.err_user_not_found);
    }

    const result = await this.verifyMobileOtp(user, otp);

    user.type == 'Owner'
      ? await this.ownerRepository.updateOne(
          { mobile: user.mobile },
          { mobileIsVerified: true, uuid: verifyMobileOwnerDto.uuid ? verifyMobileOwnerDto.uuid : user.uuid },
        )
      : await this.merchantEmployeeRepository.updateOne(
          { mobile: user.mobile },
          { mobileIsVerified: true, uuid: verifyMobileOwnerDto.uuid ? verifyMobileOwnerDto.uuid : user.uuid },
        );

    const payload = _.omit(user, [
      'password',
      'city',
      'country',
      'totalOrdersCount',
      'totalMerchantEmployeesCount',
      'createdAt',
      'updateAt',
    ]);

    delete user?.password;

    const { accessToken, refreshToken } = this.authService.generateTokens(AuthUserType.OWNER, payload);

    return {
      ...user,
      mobileIsVerified: true,
      token: accessToken,
      refreshToken,
      success: result,
    };
  }

  async verifyEmail(confirmOwnerDto: BodyConfirmOwnerDto & ParamsConfirmOwnerDto) {
    const { email, otp } = confirmOwnerDto;
    let user = await this.ownerRepository.getOne({
      email,
    });

    if (!user) {
      user = await this.merchantEmployeeRepository.getOne({ email });
    }

    if (!user) {
      throw new NotFoundException(ERROR_CODES.err_user_not_found);
    }

    const result = (await this.verifyEmailOtp(user, otp)) || false;

    user.type == 'Owner'
      ? await this.ownerRepository.updateOne(
          { email: user.email },
          { emailIsVerified: true, uuid: confirmOwnerDto.uuid ? confirmOwnerDto.uuid : user.uuid },
        )
      : await this.merchantEmployeeRepository.updateOne(
          { email: user.email },
          { emailIsVerified: true, uuid: confirmOwnerDto.uuid ? confirmOwnerDto.uuid : user.uuid },
        );

    const payload = _.omit(user, [
      'password',
      'city',
      'country',
      'totalOrdersCount',
      'totalMerchantEmployeesCount',
      'createdAt',
      'updateAt',
    ]);

    const { accessToken, refreshToken } = await this.authService.generateTokens(AuthUserType.OWNER, payload);

    return {
      ...user,
      emailIsVerified: true,
      token: accessToken,
      refreshToken,
      success: result,
    };
  }

  async login(loginOwnerDto: LoginOwnerDto, isJwtLogin = true) {
    const { countryCode, mobile, password } = loginOwnerDto;
    let user: Owner | MerchantEmployee;

    [user] = await this.ownerRepository.login(countryCode, mobile);
    if (!user) {
      user = await this.merchantEmployeeRepository.merchantEmployeeLogin(countryCode, mobile);
    }

    if (!user) {
      throw new NotFoundException(ERROR_CODES.err_phone_number_not_found);
    }

    if (user?.isDeleted && loginOwnerDto?.isCancelDeleteAccount) {
      user = await this.ownersOrMerchantEmployeesCancelDeleteAccount(user);
    }

    if (user?.['merchant']?.['status'] == MERCHANT_STATUS.BANNED_STATUS) {
      throw new BadRequestException(ERROR_CODES.err_merchant_is_banned);
    }

    if (user?.type == 'MerchantEmployee' && user?.['merchant']?.['status'] == MERCHANT_STATUS.REJECTED_STATUS) {
      throw new BadRequestException(ERROR_CODES.err_merchant_is_rejected);
    }

    if (!user?.uuid || isValidUUID(loginOwnerDto?.uuid)) {
      const updatedUuid = isValidUUID(loginOwnerDto?.uuid) ? loginOwnerDto?.uuid : uuidv();
      user.type == 'Owner'
        ? await this.ownerRepository.updateOne({ countryCode, mobile }, { uuid: updatedUuid })
        : await this.merchantEmployeeRepository.updateOne({ countryCode, mobile }, { uuid: updatedUuid });
      user.uuid = updatedUuid;
    }

    const isPasswordMatch = isJwtLogin ? this.cryptoService.compareHash(password, user.password) : true;

    if (!isPasswordMatch) {
      throw new BadRequestException(ERROR_CODES.err_password_does_not_match);
    }
    const verificationType = await this.settingService.checkVerificationSetting();
    if (verificationType?.otp_verify_type === OTP_VERIFICATION_TYPE_MOBILE && !user.mobileIsVerified && isJwtLogin) {
      await this.setOtpToMobile(user);
      // return {
      //   success: false,
      //   message: ERROR_CODES.err_mobile_not_verified,
      //   verify_type: VERIFY_TYPE.MOBILE_NOT_VERIFIED,
      // };
      throw new BadRequestException(ERROR_CODES.err_mobile_not_verified);
    }

    if (verificationType?.otp_verify_type === OTP_VERIFICATION_TYPE_EMAIL && !user.emailIsVerified && isJwtLogin) {
      await this.setOtpToEmail(user);
      // return {
      //   success: false,
      //   message: ERROR_CODES.err_email_not_verified,
      //   verify_type: VERIFY_TYPE.EMAIL_NOT_VERIFIED,
      // };
      throw new BadRequestException(ERROR_CODES.err_email_not_verified);
    }

    // const payload = _.omit(user, [
    //   'password',
    //   'city',
    //   'country',
    //   'totalOrdersCount',
    //   'totalMerchantEmployeesCount',
    //   'createdAt',
    //   'updateAt',
    //   'branches',
    // ]);

    delete user?.password;

    const tokenPayload = _.pick(user, [
      '_id',
      'name',
      'email',
      'type',
      'countryCode',
      'mobile',
      'role',
      'merchantId',
      'branchesIds',
      'merchant._id',
      'merchant.name',
      // 'twoFactorAuthenticationSecret',
      'isTwoFactorAuthenticationEnabled',
    ]);

    const { accessToken, refreshToken } = this.authService.generateTokens(AuthUserType.OWNER, tokenPayload);

    const newLoginActivity = new Activity();
    newLoginActivity.scope = user.type === 'Owner' ? 'Owner' : 'MerchantEmployee';
    newLoginActivity.actor = user['_id'];
    this.activitiesClient.emit('login', newLoginActivity);

    return {
      ...user,
      token: accessToken,
      refreshToken,
    };
  }

  async requestForgetPassword(requestForgetPasswordOwnerDto: RequestForgetPasswordOwnerDto) {
    const { email } = requestForgetPasswordOwnerDto;
    let user = await this.ownerRepository.getOne({
      email,
    });

    if (!user) {
      user = await this.merchantEmployeeRepository.getOne({ email });
    }

    if (!user) {
      throw new NotFoundException(ERROR_CODES.err_phone_number_not_found);
    }

    const result = (await this.setOtpToEmail(user)) || false;

    return result;
  }

  async verifyForgetPassword(verifyForgetPasswordOwnerDto: VerifyForgetPasswordOwnerDto) {
    const { email, otp } = verifyForgetPasswordOwnerDto;
    let user = await this.ownerRepository.getOne({
      email,
    });

    if (!user) {
      user = await this.merchantEmployeeRepository.getOne({ email });
    }

    if (!user) {
      throw new NotFoundException(ERROR_CODES.err_email_not_found);
    }

    const result = (await this.verifyEmailOtp(user, otp)) || false;

    return { success: result };
  }

  async changePassword(changePasswordOwnerDto: ChangePasswordOwnerDto) {
    const { email, password } = changePasswordOwnerDto;
    let user = await this.ownerRepository.getOne({
      email,
    });

    if (!user) {
      user = await this.merchantEmployeeRepository.getOne({ email });
    }

    if (!user) {
      throw new NotFoundException(ERROR_CODES.err_email_not_found);
    }

    const hashedPassword = this.cryptoService.createHash(password);

    user =
      user.type == 'Owner'
        ? await this.ownerRepository.updateOne(
            { email },
            {
              password: hashedPassword,

              uuid: changePasswordOwnerDto.uuid ? changePasswordOwnerDto.uuid : user.uuid,
            },
          )
        : await this.merchantEmployeeRepository.updateOne(
            { email },
            { password: hashedPassword, uuid: changePasswordOwnerDto.uuid ? changePasswordOwnerDto.uuid : user.uuid },
          );

    if (user?.type == 'MerchantEmployee' && !user?.['isPasswordReset']) {
      await this.merchantEmployeeRepository.updateOne(
        { _id: new mongoose.Types.ObjectId(user._id.toString()) },
        { isPasswordReset: true },
      );
    }

    const payload = _.omit(user, [
      'password',
      'city',
      'country',
      'totalOrdersCount',
      'totalMerchantEmployeesCount',
      'createdAt',
      'updateAt',
    ]);

    let data;

    [data] = await this.ownerRepository.login(user.countryCode, user.mobile);
    if (!data) {
      data = await this.merchantEmployeeRepository.merchantEmployeeLogin(user.countryCode, user.mobile);
    }

    const { accessToken, refreshToken } = await this.authService.generateTokens(AuthUserType.OWNER, payload);

    return {
      ...data,
      token: accessToken,
      refreshToken,
    };
  }

  getForDashboard(filters: OwnerFiltersQuery) {
    return this.ownerRepository.getForDashboard(filters);
  }

  async getOwnerDetailsById(owner_id: string) {
    const owner = await this.ownerRepository.getOwnerDetailsById(owner_id);
    return owner;
  }

  async adminUpdateOwner(owner_id: string, adminUpdateOwnerDto: AdminUpdateOwnerDto) {
    const { email, mobile } = adminUpdateOwnerDto;

    const isEmailExists = email
      ? await this.ownerRepository.exists({
          email,
          isDeleted: false,
        })
      : false;

    if (isEmailExists) {
      throw new ConflictException(ERROR_CODES.err_email_already_in_use);
    }

    const isPhoneExists = mobile
      ? await this.ownerRepository.exists({
          mobile,
          isDeleted: false,
        })
      : false;

    if (isPhoneExists) {
      throw new ConflictException(ERROR_CODES.err_phone_number_already_in_use);
    }

    const owner = await this.ownerRepository.updateOne(
      { _id: owner_id, isDeleted: false },
      {
        ...adminUpdateOwnerDto,
      },
    );

    return owner;
  }

  async getByMobileOrEmail(query) {
    const { email, mobile } = query;
    let owner: Owner;

    !email
      ? (owner = await this.ownerRepository.getOne({ mobile }))
      : (owner = await this.ownerRepository.getOne({
          email,
        }));

    if (!owner) throw new NotFoundException(ERROR_CODES.err_user_not_found);
    return owner;
  }

  async getOwnerById(ownerId: string) {
    const owner = await this.ownerRepository.getOne(
      { _id: ownerId },
      { lean: true, populate: ['countryId', 'cityId'] },
    );
    if (!owner) throw new NotFoundException(ERROR_CODES.err_user_not_found);
    if (owner.isDeleted) throw new NotFoundException(ERROR_CODES.err_user_account_is_deleted);

    return owner;
  }

  async updateOwnerByItself(updateOwnerByItselfDto: UpdateOwnerByItselfDto, user: any) {
    const owner = await this.ownerRepository.getOne({ _id: user._id, isDeleted: false });

    if (!owner) throw new NotFoundException(ERROR_CODES.err_user_not_found);

    const { oldPassword, newPassword, ...updatedOwnerData } = updateOwnerByItselfDto;

    if (oldPassword && newPassword) {
      const isPasswordMatch = await this.cryptoService.compareHash(oldPassword, owner.password);

      if (!isPasswordMatch) {
        throw new BadRequestException(ERROR_CODES.err_password_does_not_match);
      }

      updatedOwnerData['password'] = await this.cryptoService.createHash(newPassword);
    }

    const updatedOwner = await this.ownerRepository.updateOne({ _id: user._id }, { ...updatedOwnerData });

    const ownerData = await this.ownerRepository.getOne(
      {
        _id: user._id,
      },
      {
        lean: true,
        populate: [
          {
            path: 'cityId',
          },
          {
            path: 'countryId',
          },
        ],
      },
    );

    return ownerData;
  }

  async requestChangeEmail(requestChangeEmailOwnerDto: RequestChangeEmailOwnerDto, user: any) {
    const { email } = requestChangeEmailOwnerDto;

    const owner = await this.ownerRepository.getOne({
      email,
    });

    if (owner) {
      throw new ConflictException(ERROR_CODES.err_email_already_in_use);
    }

    const merchant_employee = await this.merchantEmployeeRepository.getOne({ email });

    if (merchant_employee) {
      throw new ConflictException(ERROR_CODES.err_email_already_in_use);
    }

    const result = (await this.setOtpToEmail({ ...user, email })) || false;
    return {
      ...result,
      counter: 90,
    };
  }

  async verifyChangeEmail(verifyChangeEmailOwnerDto: VerifyChangeEmailOwnerDto, user: any) {
    await this._verifyOtp({ ...user, email: verifyChangeEmailOwnerDto.email }, verifyChangeEmailOwnerDto.otp, 'email');

    const updatedOwner = await this.ownerRepository.updateOne(
      { _id: user._id },
      { email: verifyChangeEmailOwnerDto.email },
    );

    return updatedOwner;
  }

  async requestChangeMobile(requestChangeMobileOwnerDto: RequestChangeMobileOwnerDto, user: any) {
    const { mobile, countryCode } = requestChangeMobileOwnerDto;

    const owner = await this.ownerRepository.getOne({
      mobile,
      countryCode,
    });

    if (owner) {
      throw new ConflictException(ERROR_CODES.err_phone_number_not_found);
    }

    const merchant_employee = await this.merchantEmployeeRepository.getOne({
      mobile,
      countryCode,
    });

    if (merchant_employee) {
      throw new ConflictException(ERROR_CODES.err_phone_number_not_found);
    }

    // let result;
    // const verificationType = await this.settingService.checkVerificationSetting();
    // if (verificationType?.otp_verify_type === OTP_VERIFICATION_TYPE_MOBILE && !owner.mobileIsVerified) {
    //   result = await this.setOtpToMobile(owner);
    //   return {
    //     success: false,
    //     message: ERROR_CODES.err_mobile_not_verified,
    //     verify_type: VERIFY_TYPE.MOBILE_NOT_VERIFIED,
    //   };
    // }

    // if (verificationType?.otp_verify_type === OTP_VERIFICATION_TYPE_EMAIL && !owner.emailIsVerified) {
    //   result = await this.setOtpToEmail(owner);
    //   return {
    //     success: false,
    //     message: ERROR_CODES.err_email_not_verified,
    //     verify_type: VERIFY_TYPE.EMAIL_NOT_VERIFIED,
    //   };
    // }

    const result = (await this.setOtpToMobile({ ...user, mobile, countryCode })) || false;

    return {
      ...result,
      counter: 90,
    };
  }

  async verifyChangeMobile(verifyChangeMobileOwnerDto: VerifyChangeMobileOwnerDto, user: any) {
    await this._verifyOtp(
      {
        ...user,
        mobile: verifyChangeMobileOwnerDto.mobile,
        countryCode: verifyChangeMobileOwnerDto.countryCode,
      },
      verifyChangeMobileOwnerDto.otp,
      'mobile',
    );

    const updatedOwner = await this.ownerRepository.updateOne(
      { _id: user._id },
      {
        mobile: verifyChangeMobileOwnerDto.mobile,
        countryCode: verifyChangeMobileOwnerDto.countryCode,
      },
    );

    return updatedOwner;
  }

  async findOwnerOrMerchantEmployeeById(id: string) {
    let user = await this.ownerRepository.getOne({ _id: id }, { lean: true, populate: ['countryId', 'cityId'] });

    if (user?.isDeleted) throw new NotFoundException(ERROR_CODES.err_user_account_is_deleted);

    if (!user) {
      user = await this.merchantEmployeeRepository.getOne(
        { _id: id },
        { lean: true, populate: ['countryId', 'cityId'] },
      );
    }

    if (user?.isDeleted) throw new NotFoundException(ERROR_CODES.err_user_account_is_deleted);

    return user;
  }

  async resendOtpOwner(resendOtpOwnerDto: ResendOtpOwnerDto) {
    const { countryCode, mobile } = resendOtpOwnerDto;
    let user;
    user = await this.ownerRepository.getOne({
      countryCode,
      mobile,
    });

    if (!user) {
      user = await this.merchantEmployeeRepository.getOne({ countryCode, mobile });
    }
    if (!user) {
      throw new NotFoundException(ERROR_CODES.err_user_not_found);
    }

    // let emailResult, mobileResult;
    let result;
    // if (!user.mobileIsVerified || !user.emailIsVerified) {
    //   mobileResult = await this.setOtpToMobile(user);
    //   emailResult = await this.setOtpToEmail(user);
    // }
    const verificationType = await this.settingService.checkVerificationSetting();

    if (verificationType?.otp_verify_type === OTP_VERIFICATION_TYPE_MOBILE && !user.mobileIsVerified) {
      result = await this.setOtpToMobile(user);
    }

    if (verificationType?.otp_verify_type === OTP_VERIFICATION_TYPE_EMAIL && !user.emailIsVerified) {
      result = await this.setOtpToEmail(user);
    }

    return {
      success: result?.success || false,
    };
  }

  async ownerOrMerchantemployeeRefreshToken(userData: any) {
    let user: Owner | MerchantEmployee;

    [user] = await this.ownerRepository.login(userData['countryCode'], userData['mobile']);
    if (!user) {
      user = await this.merchantEmployeeRepository.merchantEmployeeLogin(userData['countryCode'], userData['mobile']);
    }

    if (!user) {
      throw new NotFoundException(ERROR_CODES.err_phone_number_not_found);
    }

    const { accessToken, refreshToken } = this.authService.generateTokens(AuthUserType.OWNER, user);

    return {
      ...user,
      token: accessToken,
      refreshToken,
    };
  }

  async ownersOrMerchantEmployeesDeleteAccount(user: any) {
    const { _id } = user;
    const ownerOrMerchantEmployee =
      user?.type == 'Owner'
        ? (await this.ownerRepository.getOwnerDetailsById(_id.toString()))?.[0]
        : await this.merchantEmployeeRepository.getOne({
            _id,
          });

    if (!ownerOrMerchantEmployee) {
      throw new NotFoundException(ERROR_CODES.err_user_not_found);
    }

    if (ownerOrMerchantEmployee?.isDeleted) {
      throw new NotFoundException(ERROR_CODES.err_user_account_deleted);
    }

    const updatedOwnerOrMerchantEmployee =
      user?.type == 'Owner'
        ? await this.ownerRepository.updateById(
            _id,
            {
              isDeleted: true,
              deletedAt: new Date(),
            },
            { lean: true, new: true },
            {},
          )
        : await this.merchantEmployeeRepository.updateById(
            _id,
            {
              isDeleted: true,
              deletedAt: new Date(),
            },
            { lean: true, new: true },
            {},
          );

    if (user?.type == 'Owner' && ownerOrMerchantEmployee?.['merchant']) {
      await this.merchantRepository.updateOne(
        { ownerId: _id },
        {
          status: MERCHANT_STATUS.REJECTED_STATUS,
          status_before_deleted: ownerOrMerchantEmployee?.['merchant']?.status,
          deletedAt: new Date(),
        },
      );
      // await this.merchantEmployeeRepository.updateMany(
      //   {
      //     merchantId: ownerOrMerchantEmployee?.merchant?._id,
      //   },
      //   {
      //     isDeleted: true,
      //     deletedAt: new Date(),
      //   },
      //   { lean: true, new: true },
      //   {},
      // );
    }

    return { success: true };
  }

  async ownersOrMerchantEmployeesCancelDeleteAccount(user: any) {
    const { _id, deletedAt } = user;

    const diffDates = moment.duration(moment(new Date()).diff(moment(deletedAt)));

    if (Math.floor(diffDates.asDays()) >= 7) {
      throw new BadRequestException(ERROR_CODES.err_user_can_not_cancel_delete_account_after_one_week);
    }

    const updatedOwnerOrMerchantEmployee =
      user?.type == 'Owner'
        ? await this.ownerRepository.updateById(
            _id,
            {
              isDeleted: false,
              deletedAt: null,
            },
            { lean: true, new: true },
            {},
          )
        : await this.merchantEmployeeRepository.updateById(
            _id,
            {
              isDeleted: false,
              deletedAt: null,
            },
            { lean: true, new: true },
            {},
          );

    if (user?.type == 'Owner' && user?.merchant) {
      await this.merchantRepository.updateOne(
        { ownerId: _id },
        {
          status: user?.merchant?.status_before_deleted,
          status_before_deleted: null,
          deletedAt: null,
        },
      );
      // await this.merchantEmployeeRepository.updateMany(
      //   {
      //     merchantId: user?.merchant?._id,
      //   },
      //   {
      //     isDeleted: false,
      //     deletedAt: null,
      //   },
      //   { lean: true, new: true },
      //   {},
      // );
    }

    return {
      ...user,
      isDeleted: false,
      deletedAt: null,
      merchant: { ...user?.merchant, status: user?.merchant?.status_before_deleted },
    };
  }

  async ownersOrMerchantEmployeesRequestCancelDeleteAccount(
    requestCancelDeleteAccountOwnerDto: RequestCancelDeleteAccountOwnerDto,
  ) {
    const { mobile, countryCode } = requestCancelDeleteAccountOwnerDto;

    let ownerOrMerchantEmployee = await this.ownerRepository.getOne({
      mobile,
      countryCode,
    });

    if (!ownerOrMerchantEmployee) {
      ownerOrMerchantEmployee = await this.merchantEmployeeRepository.getOne({
        mobile,
        countryCode,
      });
    }

    if (!ownerOrMerchantEmployee) {
      throw new ConflictException(ERROR_CODES.err_phone_number_not_found);
    }

    if (!ownerOrMerchantEmployee?.isDeleted) {
      throw new ConflictException(ERROR_CODES.err_user_account_already_is_active);
    }

    // let result;
    // const verificationType = await this.settingService.checkVerificationSetting();
    // if (verificationType?.otp_verify_type === OTP_VERIFICATION_TYPE_MOBILE && !owner.mobileIsVerified) {
    //   result = await this.setOtpToMobile(owner);
    //   return {
    //     success: false,
    //     message: ERROR_CODES.err_mobile_not_verified,
    //     verify_type: VERIFY_TYPE.MOBILE_NOT_VERIFIED,
    //   };
    // }

    // if (verificationType?.otp_verify_type === OTP_VERIFICATION_TYPE_EMAIL && !owner.emailIsVerified) {
    //   result = await this.setOtpToEmail(owner);
    //   return {
    //     success: false,
    //     message: ERROR_CODES.err_email_not_verified,
    //     verify_type: VERIFY_TYPE.EMAIL_NOT_VERIFIED,
    //   };
    // }

    const result = (await this.setOtpToMobile({ ...ownerOrMerchantEmployee, mobile, countryCode })) || false;

    return {
      ...result,
      counter: 90,
    };
  }

  async ownersOrMerchantEmployeesVerifyCancelDeleteAccount(
    verifyCancelDeleteAccountOwnerDto: VerifyCancelDeleteAccountOwnerDto,
  ) {
    let ownerOrMerchantEmployee = await this.ownerRepository.getOne({
      mobile: verifyCancelDeleteAccountOwnerDto.mobile,
      countryCode: verifyCancelDeleteAccountOwnerDto.countryCode,
    });

    if (ownerOrMerchantEmployee)
      ownerOrMerchantEmployee = (
        await this.ownerRepository.getOwnerDetailsById(ownerOrMerchantEmployee._id.toString())
      )?.[0]; // for getting merchant

    if (!ownerOrMerchantEmployee) {
      ownerOrMerchantEmployee = await this.merchantEmployeeRepository.getOne({
        mobile: verifyCancelDeleteAccountOwnerDto.mobile,
        countryCode: verifyCancelDeleteAccountOwnerDto.countryCode,
      });
    }

    if (!ownerOrMerchantEmployee) {
      throw new ConflictException(ERROR_CODES.err_phone_number_not_found);
    }

    if (!ownerOrMerchantEmployee?.isDeleted) {
      throw new ConflictException(ERROR_CODES.err_user_account_already_is_active);
    }

    await this._verifyOtp(
      {
        ...ownerOrMerchantEmployee,
        mobile: verifyCancelDeleteAccountOwnerDto.mobile,
        countryCode: verifyCancelDeleteAccountOwnerDto.countryCode,
      },
      verifyCancelDeleteAccountOwnerDto.otp,
      'mobile',
    );

    const updatedOwnerOrMerchantEmployee =
      ownerOrMerchantEmployee?.type == 'Owner'
        ? await this.ownerRepository.updateById(
            ownerOrMerchantEmployee._id,
            {
              isDeleted: false,
              deletedAt: null,
            },
            { lean: true, new: true },
            {},
          )
        : await this.merchantEmployeeRepository.updateById(
            ownerOrMerchantEmployee._id,
            {
              isDeleted: false,
              deletedAt: null,
            },
            { lean: true, new: true },
            {},
          );

    if (ownerOrMerchantEmployee?.type == 'Owner' && ownerOrMerchantEmployee?.['merchant']) {
      await this.merchantRepository.updateOne(
        { ownerId: ownerOrMerchantEmployee._id },
        {
          status: MERCHANT_STATUS.PENDING_STATUS,
        },
      );
      await this.merchantEmployeeRepository.updateMany(
        {
          merchantId: ownerOrMerchantEmployee?.['merchant']?._id,
        },
        {
          isDeleted: false,
          deletedAt: null,
        },
        { lean: true, new: true },
        {},
      );
    }

    return updatedOwnerOrMerchantEmployee;
  }
}
