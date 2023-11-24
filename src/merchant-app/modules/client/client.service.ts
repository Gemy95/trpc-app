import { RedisService } from '@liaoliaots/nestjs-redis';
import { InjectQueue } from '@nestjs/bull';
import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Queue } from 'bull';
import generateOtp from 'gen-totp';
import { isNil, omit } from 'lodash';
import * as _ from 'lodash';
import mongoose, { Types } from 'mongoose';

import { ERROR_CODES } from '../../../libs/utils/src';
import { AuthService } from '../auth/auth.service';
import { AuthUserType } from '../auth/shared/constants/auth.types.enum';
import { REDIS_CLIENT_NAME_SPACE } from '../common/constants/client.constants';
import { VERIFY_TYPE } from '../common/constants/owner.constants';
import { CHANGE_CLIENT_STATUS_PROCESSOR, CLIENT_QUEUE } from '../common/constants/queue.constants';
import { OTP_VERIFICATION_TYPE_EMAIL, OTP_VERIFICATION_TYPE_MOBILE } from '../common/constants/users.types';
import { ConfigurationService } from '../config/configuration.service';
import { CryptoService } from '../crypto/crypto.service';
import { ClientFiltersQuery } from '../dashboard/dto/client-filters.dto';
import { MerchantFiltersClientQuery } from '../dashboard/dto/merchant-filter-client.dto';
import { MailService } from '../mail/mail.service';
import { AddressRepository, BranchRepository, Client, ClientRepository } from '../models';
import { SettingService } from '../setting/setting.service';
import { SlackService } from '../slack/slack.service';
import ISendSMS from '../sms/interfaces/send-sms.interface';
import { SmsService } from '../sms/sms.service';
import { AdminUpdateClientDto } from './dto/admin-update-client.dto';
import { ChangePasswordClientDto } from './dto/change-password-client';
import { BodyConfirmClientDto, ParamsConfirmClientDto } from './dto/confirm-client';
import { CreateAddressDto } from './dto/create-address.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { LoginClientDto } from './dto/login-client';
import { RequestChangeEmailClientDto } from './dto/request-change-email.dto';
import { RequestChangeMobileVerifyDto } from './dto/request-change-mobile-verify.dto';
import { RequestChangeMobileRequestClientDto } from './dto/request-change-mobile.dto';
import { RequestChangeEmailClientVerifyDto } from './dto/request-change-verify.dto';
import { RequestForgetPasswordClientDto } from './dto/request-forget-password-client';
import { ResendOtpClientDto } from './dto/resend-otp-client.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { VerifyChangeMobileClientDto } from './dto/verify-change-mobile.dto';
import { VerifyForgetPasswordClientDto } from './dto/verify-forget-password-client';
import { createCacheKey } from './helpers/create-cache-key';
import IClientOtp from './interface/client-otp';

@Injectable()
export class ClientService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly cryptoService: CryptoService,
    private readonly mailService: MailService,
    private readonly smsService: SmsService,
    private readonly addressRepository: AddressRepository,
    public readonly redisService: RedisService,
    public readonly settingService: SettingService,
    @InjectQueue(CLIENT_QUEUE) private readonly clientQueue: Queue,
    private readonly authService: AuthService,
    private configService: ConfigurationService,
    private readonly slackService: SlackService,
    private readonly branchRepository: BranchRepository,
  ) {}
  private logger = new Logger(ClientService.name);

  private async _setOtp(
    data: Client,
    type: string,
    isRegister = false,
  ): Promise<{ success: boolean; otp?: string; expirationInSeconds?: number }> {
    const { uuid, email, mobile, _id } = data;
    let key: string;

    if (type === 'email') key = createCacheKey({ partOne: _id.toString(), partTwo: email });
    if (type === 'mobile') key = createCacheKey({ partOne: _id.toString(), partTwo: mobile });

    const isRedisKeyExists = await this.redisService.getClient(REDIS_CLIENT_NAME_SPACE).get(key);

    if (isRedisKeyExists /*&& isRedisKeyExists?.numberOfTries === 3*/) {
      throw new HttpException(ERROR_CODES.err_otp_request_exceeded, 429);
    }

    const otp = generateOtp(uuid ?? _id, { digits: 6 });
    const clientOtp: IClientOtp = {
      otp,
      email,
      mobile,
      numberOfTries: 3,
    };
    // 3 minutes in all cases except
    // 3 days in case send otp to email after registeration
    // const expirationInSeconds: number = isRegister ? 259200 : 180;
    const expirationInSeconds = 180;

    try {
      await this.redisService
        .getClient(REDIS_CLIENT_NAME_SPACE)
        .set(key, JSON.stringify(clientOtp), 'EX', expirationInSeconds);

      return { success: true, otp, expirationInSeconds };
    } catch (error) {
      this.logger.error(error);
      return {
        success: false,
      };
    }
  }

  private async setOtpToEmail(data: Client, isRegister = false) {
    const { otp, expirationInSeconds } = await this._setOtp(data, 'email', isRegister);

    const result = await this.mailService.otpEmail(data, otp);

    if (this.configService.env == 'local' || this.configService.env == 'development') {
      await this.slackService.sendEmailOtp(data.email, otp);
    }

    return { ...result, expirationInSeconds };
  }

  private async setOtpToMobile(data: Client) {
    const { otp, expirationInSeconds } = await this._setOtp(data, 'mobile');

    const smsData: ISendSMS = {
      CountryCode: data.countryCode,
      mobileno: data.mobile,
      msgtext: `This is the otp: ${otp}`,
    };

    const result = await this.smsService.sendSms(smsData);
    return { ...result, expirationInSeconds };
  }

  private async _verifyOtp(data: Client, otp, type: string) {
    let redisKey: string;

    if (type === 'email') {
      redisKey = createCacheKey({
        partOne: data._id.toString(),
        partTwo: data.email,
      });
    }

    if (type === 'mobile') {
      redisKey = createCacheKey({
        partOne: data._id.toString(),
        partTwo: data.mobile,
      });
    }

    const clientObjectString: string = await this.redisService.getClient(REDIS_CLIENT_NAME_SPACE).get(redisKey);

    if (isNil(clientObjectString)) {
      throw new BadRequestException(ERROR_CODES.err_otp_expired);
    }

    let clientOtp: IClientOtp = JSON.parse(clientObjectString);
    const { numberOfTries } = clientOtp;

    if (numberOfTries <= 0) {
      await this.redisService.getClient(REDIS_CLIENT_NAME_SPACE).del(redisKey);

      throw new HttpException(ERROR_CODES.err_otp_request_exceeded, 429);
    } else if (clientOtp.otp !== otp) {
      const updatedNumberOfTries = numberOfTries - 1;

      clientOtp = {
        ...clientOtp,
        numberOfTries: updatedNumberOfTries,
      };

      const remianingExpirationInSeconds = await this.redisService.getClient(REDIS_CLIENT_NAME_SPACE).ttl(redisKey);

      await this.redisService
        .getClient(REDIS_CLIENT_NAME_SPACE)
        .set(redisKey, JSON.stringify(clientOtp), 'EX', remianingExpirationInSeconds);

      throw new BadRequestException(
        ERROR_CODES.err_wrong_otp_remaining.replace('_remaining', `, You have: ${updatedNumberOfTries}`),
      );
    }

    return (
      (await this.redisService.getClient(REDIS_CLIENT_NAME_SPACE).del(redisKey)) && {
        success: true,
      }
    );
  }

  private async verifyEmailOtp(data: Client, otp: string) {
    const verify = await this._verifyOtp(data, otp, 'email');
    return verify;
  }

  private async verifyMobileOtp(data: Client, otp: string) {
    await this._verifyOtp(data, otp, 'mobile');
  }

  async create(createClientDto: CreateClientDto | any) {
    const { password, email, mobile } = createClientDto;

    const isEmailExists = await this.clientRepository.exists({
      email,
      isDeleted: false,
    });

    const isPhoneExists = await this.clientRepository.exists({
      mobile,
      isDeleted: false,
    });

    if (isEmailExists) {
      throw new ConflictException(ERROR_CODES.err_email_already_in_use);
    }

    if (isPhoneExists) {
      throw new ConflictException(ERROR_CODES.err_phone_number_already_in_use);
    }

    const client = await this.clientRepository.create({
      ...createClientDto,
      password: this.cryptoService.createHash(password),
    });

    const verificationType = await this.settingService.checkVerificationSetting();
    let verificationResponse;
    if (verificationType?.otp_verify_type === OTP_VERIFICATION_TYPE_MOBILE && !client.mobileIsVerified) {
      verificationResponse = await this.setOtpToMobile(client);
    }

    if (verificationType?.otp_verify_type === OTP_VERIFICATION_TYPE_EMAIL && !client.emailIsVerified) {
      verificationResponse = await this.setOtpToEmail(client, true);
    }

    return {
      ...omit(client, ['password']),
      expirationInSeconds: verificationResponse?.['expirationInSeconds'],
    };
  }

  async verifyMobile(verifyChangeMobileClientDto: VerifyChangeMobileClientDto | any) {
    const { mobile, countryCode, otp } = verifyChangeMobileClientDto;
    let client = await this.clientRepository.getOne({ countryCode, mobile });

    if (!client) {
      throw new NotFoundException(ERROR_CODES.err_user_not_found);
    }

    await this.verifyMobileOtp(client, otp);

    client = await this.clientRepository.updateOne(
      { mobile: client.mobile },
      {
        mobileIsVerified: true,
        uuid: verifyChangeMobileClientDto.uuid ? verifyChangeMobileClientDto.uuid : client.uuid,
      },
    );

    const { accessToken, refreshToken } = this.authService.generateTokens(AuthUserType.CLIENT, { ...client });

    return {
      ...omit(client, ['password']),
      token: accessToken,
      refreshToken,
    };
  }

  async verifyEmail(confirmClientDto: (BodyConfirmClientDto & ParamsConfirmClientDto) | any) {
    const { email, otp } = confirmClientDto;
    let client = await this.clientRepository.getOne({ email });

    if (!client) {
      throw new NotFoundException(ERROR_CODES.err_user_not_found);
    }

    await this.verifyEmailOtp(client, otp);

    client = await this.clientRepository.updateOne(
      { email: client.email },
      {
        emailIsVerified: true,
        uuid: confirmClientDto.uuid ? confirmClientDto.uuid : client.uuid,
      },
    );

    const { accessToken, refreshToken } = this.authService.generateTokens(AuthUserType.CLIENT, { ...client });

    return {
      ...omit(client, ['password']),
      token: accessToken,
      refreshToken,
    };
  }

  async login(loginClientDto: LoginClientDto | any) {
    const { mobile, password, countryCode } = loginClientDto;

    let [client] = await this.clientRepository._model.aggregate([
      {
        $match: { mobile, countryCode },
      },
      {
        $lookup: {
          from: 'addresses',
          let: { client: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$client', '$$client'] }, { $eq: ['$active', true] }],
                },
              },
            },
          ],
          as: 'address',
        },
      },
    ]);

    if (!client) {
      throw new NotFoundException(ERROR_CODES.err_phone_number_not_found);
    }

    const isPasswordMatch = this.cryptoService.compareHash(password, client.password);

    if (!isPasswordMatch) {
      throw new BadRequestException(ERROR_CODES.err_password_does_not_match);
    }

    let verifyResult = {};
    const verificationType = await this.settingService.checkVerificationSetting();
    if (!client.mobileIsVerified && verificationType?.otp_verify_type === OTP_VERIFICATION_TYPE_MOBILE) {
      verifyResult = await this.setOtpToMobile(client);
      return {
        ...verifyResult,
        success: false,
        message: ERROR_CODES.err_mobile_not_verified,
        verify_type: VERIFY_TYPE.MOBILE_NOT_VERIFIED,
      };
    }

    if (!client.emailIsVerified && verificationType?.otp_verify_type === OTP_VERIFICATION_TYPE_EMAIL) {
      verifyResult = await this.setOtpToEmail(client, false);
      return {
        ...verifyResult,
        success: false,
        message: ERROR_CODES.err_email_not_verified,
        verify_type: VERIFY_TYPE.EMAIL_NOT_VERIFIED,
      };
    }

    loginClientDto.uuid
      ? (client = await this.clientRepository.updateOne(
          { countryCode, mobile },
          {
            uuid: loginClientDto.uuid,
          },
        ))
      : 0;

    delete client?.password;

    const tokenPayload = _.pick(client, ['_id', 'name', 'email', 'type', 'countryCode', 'mobile', 'role']);

    const { accessToken, refreshToken } = this.authService.generateTokens(AuthUserType.CLIENT, tokenPayload);

    return {
      ...client,
      token: accessToken,
      refreshToken,
    };
  }

  async requestForgetPassword(requestForgetPasswordClientDto: RequestForgetPasswordClientDto | any) {
    const { email } = requestForgetPasswordClientDto;
    const client = await this.clientRepository.getOne({ email });

    if (!client) {
      throw new NotFoundException(ERROR_CODES.err_email_not_found);
    }

    const result = await this.setOtpToEmail(client);
    return result;
  }

  async verifyForgetPassword(verifyForgetPasswordClientDto: VerifyForgetPasswordClientDto | any) {
    const { email, otp } = verifyForgetPasswordClientDto;
    const client = await this.clientRepository.getOne({ email });

    if (!client) {
      throw new NotFoundException(ERROR_CODES.err_email_not_found);
    }

    const isVerified = await this.verifyEmailOtp(client, otp);
    if (isVerified && isVerified instanceof HttpException) throw isVerified;
    return isVerified;
  }

  async changePassword(changePasswordClientDto: ChangePasswordClientDto | any) {
    const { email, password, oldPassword } = changePasswordClientDto;
    let client = await this.clientRepository.getOne({ email });

    if (!client) {
      throw new NotFoundException(ERROR_CODES.err_email_not_found);
    }

    const isPasswordMatch = await this.cryptoService.compareHash(oldPassword, client.password);

    if (!isPasswordMatch) {
      throw new HttpException(ERROR_CODES.err_password_does_not_match, HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await this.cryptoService.createHash(password);

    client = await this.clientRepository.updateOne(
      { email },
      { password: hashedPassword, uuid: changePasswordClientDto.uuid ? changePasswordClientDto.uuid : client.uuid },
    );

    const { accessToken, refreshToken } = this.authService.generateTokens(AuthUserType.CLIENT, { ...client });

    return {
      ...omit(client, ['password']),
      token: accessToken,
      refreshToken,
    };
  }

  /** REQUEST CHANGE CLIENT EMAIL */
  async requestChangeEmail(requestChangeEmailClient: RequestChangeEmailClientDto, user: any) {
    const { _id } = user;
    const { email } = requestChangeEmailClient;

    const isEmailExist = await this.clientRepository.getOne({ email });

    if (isEmailExist) {
      throw new NotFoundException(ERROR_CODES.err_email_already_in_use);
    }

    const client = await this.clientRepository.getOne({ _id });

    if (!client) {
      throw new NotFoundException(ERROR_CODES.err_user_not_found);
    }

    const result = await this.setOtpToEmail({ ...client, email });

    return result;
  }

  async requestChangeEmailVerify(requestChangeEmailVerify: RequestChangeEmailClientVerifyDto, user: any) {
    const { otp, email } = requestChangeEmailVerify;
    const { _id } = user;

    const client = await this.clientRepository.getOne({ _id });

    if (!client) {
      throw new NotFoundException(ERROR_CODES.err_user_not_found);
    }

    await this.verifyEmailOtp({ ...client, email }, otp);

    await this.clientRepository.updateById(
      _id,
      {
        emailIsVerified: true,
        email,
      },
      { new: true },
      {},
    );

    return { success: true, client: { ...client, email, emailIsVerified: true } };
  }

  /** REQUEST CHANGE CLIENT MOBILE */
  async changeMobileRequest(requestChangeMobile: RequestChangeMobileRequestClientDto, user: any) {
    const { _id } = user;
    const { countryCode, mobile } = requestChangeMobile;

    const isMobileExist = await this.clientRepository.getOne({
      countryCode,
      mobile,
    });

    if (isMobileExist) {
      throw new ConflictException(ERROR_CODES.err_phone_number_already_in_use);
    }

    const client = await this.clientRepository.getOne({ _id });

    if (!client) {
      throw new NotFoundException(ERROR_CODES.err_user_not_found);
    }

    const result = await this.setOtpToMobile({ ...client, mobile, countryCode });

    return result;
  }

  async changeMobileVerify(requestChangeMobileVerify: RequestChangeMobileVerifyDto, user: any) {
    const { _id } = user;

    const { countryCode, mobile, otp } = requestChangeMobileVerify;

    const client = await this.clientRepository.getOne({ _id });

    if (!client) {
      throw new NotFoundException(ERROR_CODES.err_user_not_found);
    }

    await this.verifyMobileOtp({ ...client, countryCode, mobile }, otp);

    await this.clientRepository.updateById(
      _id,
      {
        mobile,
        countryCode,
      },
      { new: true },
      {},
    );

    return { success: true, client: { ...client, countryCode, mobile } };
  }

  async update(updateClientDto: UpdateClientDto, user: any) {
    const { _id } = user;

    const client = await this.clientRepository.getOne({
      _id,
      isDeleted: false,
    });

    if (!client) {
      throw new NotFoundException(ERROR_CODES.err_user_not_found);
    }

    return this.clientRepository.updateOne({ _id, isDeleted: false }, { ...updateClientDto });
  }

  getForDashboard(filters: ClientFiltersQuery) {
    return this.clientRepository.getForDashboard(filters);
  }

  getClientsForMerchant(filters: MerchantFiltersClientQuery) {
    return this.clientRepository.getClientsForMerchant(filters);
  }

  async getClientDetailsById(client_id: string) {
    const client = await this.clientRepository.getClientDetailsById(client_id);
    return client;
  }

  async adminUpdateClient(_id: string, adminUpdateClientDto: AdminUpdateClientDto, user) {
    const { email, mobile } = adminUpdateClientDto;

    const isEmailExists = email
      ? await this.clientRepository.exists({
          email,
          isDeleted: false,
        })
      : false;

    if (isEmailExists) {
      throw new ConflictException(ERROR_CODES.err_email_already_in_use);
    }

    const isPhoneExists = mobile
      ? await this.clientRepository.exists({
          mobile,
          isDeleted: false,
        })
      : false;

    if (isPhoneExists) {
      throw new ConflictException(ERROR_CODES.err_phone_number_already_in_use);
    }

    const client = await this.clientRepository.updateOne({ _id, isDeleted: false }, { ...adminUpdateClientDto });

    if (adminUpdateClientDto?.status) {
      await this.clientQueue.add(
        CHANGE_CLIENT_STATUS_PROCESSOR,
        { client, user },
        {
          attempts: 3,
        },
      );
    }

    return client;
  }

  async addAddress(user: any, createAddressDto: CreateAddressDto | any) {
    const client = new Types.ObjectId(user?._id);
    const clientHasAddresses = await this.addressRepository._model.find({
      client,
    });
    if (clientHasAddresses) {
      clientHasAddresses.map(async (address) => {
        if (address.active) {
          await this.addressRepository.updateOne(
            {
              _id: address._id,
            },
            {
              active: false,
            },
          );
        }
      });
    }

    const data = {
      ...createAddressDto,
      client,
      locationDelta: [createAddressDto.longitudeDelta, createAddressDto.latitudeDelta],
      location: {
        type: 'Point',
        coordinates: [createAddressDto.longitude, createAddressDto.latitude],
      },
    };
    try {
      return await this.addressRepository.create(data);
    } catch (error) {
      throw new BadRequestException(error);
      // throw new BadRequestException(ERROR_CODES.err_failed_to_create_address);
    }
  }

  async listAddresses(user: any) {
    const client = new Types.ObjectId(user?._id);
    try {
      return await this.addressRepository.getAll(
        {
          client,
          isDeleted: false,
        },
        {
          page: 0,
          limit: 10,
          sort: {},
          paginate: true,
          populate: [
            {
              path: 'client',
              select: '_id name mobile email',
            },
          ],
        },
      );
    } catch (error) {
      throw new BadRequestException(error);
      // throw new BadRequestException(ERROR_CODES.err_failed_to_list_addresses);
    }
  }

  async updateAddress(user: any, addressId: string, updateAddressDto: UpdateAddressDto) {
    const client = new Types.ObjectId(user?._id);
    const clientHasAddresses = await this.addressRepository._model.find({
      client,
    });
    if (clientHasAddresses.length <= 0) throw new NotFoundException(ERROR_CODES.err_address_not_found);

    if (updateAddressDto?.active) {
      clientHasAddresses.map(async (address) => {
        if (address.active) {
          await this.addressRepository.updateOne(
            {
              _id: address._id,
            },
            {
              active: false,
            },
          );
        }
      });
    }

    const { longitudeDelta, latitudeDelta, longitude, latitude, ...data } = updateAddressDto || {};
    const updateAddress = {
      ...data,
      locationDelta: longitudeDelta && latitudeDelta ? [longitudeDelta, latitudeDelta] : undefined,
      location:
        longitude && latitude
          ? {
              type: 'Point',
              coordinates: [longitude, latitude],
            }
          : undefined,
    };

    try {
      return await this.addressRepository.updateOne(
        {
          _id: new Types.ObjectId(addressId),
        },
        updateAddress,
        { new: true, lean: true },
      );
    } catch (error) {
      throw new BadRequestException(error);
      // throw new BadRequestException(ERROR_CODES.err_failed_to_update.replace('{{item}}', 'address'));
    }
  }

  async removeAddress(user: any, addressId: string) {
    try {
      return await this.addressRepository.updateOne(
        {
          _id: new Types.ObjectId(addressId),
          client: new Types.ObjectId(user?._id),
          isDeleted: false,
        },
        { isDeleted: true },
        { new: true, lean: true },
      );
    } catch (error) {
      throw new BadRequestException(error);
      // throw new BadRequestException(ERROR_CODES.err_failed_to_delete.replace('{{item}}', 'address'));
    }
  }

  async resendOtpClient(resendOtpClientDto: ResendOtpClientDto | any) {
    try {
      const { countryCode, mobile } = resendOtpClientDto;

      const client: Client = await this.clientRepository.getOne({
        countryCode,
        mobile,
      });

      if (!client) {
        throw new NotFoundException(ERROR_CODES.err_user_not_found);
      }

      let result;
      const verificationType = await this.settingService.checkVerificationSetting();
      if (verificationType?.otp_verify_type === OTP_VERIFICATION_TYPE_MOBILE && !client.mobileIsVerified) {
        result = await this.setOtpToMobile(client);
      }

      if (verificationType?.otp_verify_type === OTP_VERIFICATION_TYPE_EMAIL && !client.emailIsVerified) {
        result = await this.setOtpToEmail(client, false);
      }

      return {
        success: result?.success || false,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async clientRefreshToken(user: any) {
    const [client] = await this.clientRepository._model.aggregate([
      {
        $match: { mobile: user['mobile'], countryCode: user['countryCode'] },
      },
      {
        $lookup: {
          from: 'addresses',
          let: { client: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$client', '$$client'] }, { $eq: ['$active', true] }],
                },
              },
            },
          ],
          as: 'address',
        },
      },
    ]);

    if (!client) {
      throw new NotFoundException(ERROR_CODES.err_phone_number_not_found);
    }

    const { accessToken, refreshToken } = this.authService.generateTokens(AuthUserType.CLIENT, user);

    return {
      ...client,
      token: accessToken,
      refreshToken,
    };
  }

  async dashboardClientsStatistics() {
    return this.clientRepository.dashboardClientsStatistics();
  }

  // async dashboardFindAllClientsByBranchId(branchId: string) {
  //   const branch =  await this.branchRepository.getOne(
  //     {
  //       isDeleted: false,
  //       _id: new mongoose.Types.ObjectId(branchId),
  //     },
  //     { lean: true },
  //   );
  //   return this.addressRepository.dashboardFindAllClientsByBranchId(branch);
  // }
}
