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
import { InjectConnection } from '@nestjs/mongoose';
import generateOtp from 'gen-totp';
import { isNil, omit } from 'lodash';
import * as _ from 'lodash';
import mongoose, { Types } from 'mongoose';

import { ERROR_CODES } from '../../../libs/utils/src';
import { AuthService } from '../auth/auth.service';
import { AuthUserType } from '../auth/shared/constants/auth.types.enum';
import { ADD_USER } from '../common/constants/activities.constant';
import { Activity } from '../common/constants/activities.event.constants';
import { MERCHANT_EMPLOYEE_JOB, REDIS_MERCHANT_EMPLOYEE_NAME_SPACE } from '../common/constants/merchant-employee';
import { GetAllDto } from '../common/dto/get-all.dto';
import { MERCHANT_EMPLOYEE_ROLE } from '../common/roles';
import { CryptoService } from '../crypto/crypto.service';
import { MailService } from '../mail/mail.service';
import {
  BranchRepository,
  MerchantEmployee,
  MerchantEmployeeRepository,
  MerchantRepository,
  OwnerRepository,
  User,
  UserRepository,
} from '../models';
import ISendSMS from '../sms/interfaces/send-sms.interface';
import { SmsService } from '../sms/sms.service';
import { ChangePasswordMerchantEmployeeDto } from './dto/change-password-merchant-employee';
import { CreateMerchantEmployeeDto } from './dto/create-merchant-employee.dto';
import { CreateMerchantEmployeesDto } from './dto/create-merchant-employees.dto';
import { FindAllMerchantEmployeeByMerchantIdDto } from './dto/find-all-merchant-employee-by-merchant-id.dto';
import { LoginMerchantEmployeeDto } from './dto/login-merchant-employee';
import { RequestChangeEmailMerchantEmployeeDto } from './dto/request-change-email-merchant-employee';
import { RequestChangeMobileMerchantEmployeeDto } from './dto/request-change-mobile-merchant-employee';
import { RequestForgetPasswordMerchantEmployeeDto } from './dto/request-forget-password-merchant-employee';
import { ResetPasswordMerchantEmployeeDto } from './dto/reset-password-merchant-employee';
import { UpdateMerchantEmployeeByItselfDto } from './dto/update-merchant-employee-by-itself';
import { UpdateMerchantEmployeeDto } from './dto/update-merchant-employee.dto';
import { VerifyChangeEmailMerchantEmployeeDto } from './dto/verify-change-email-merchant-employee';
import { VerifyChangeMobileMerchantEmployeeDto } from './dto/verify-change-mobile-merchant-employee';
import { VerifyForgetPasswordMerchantEmployeeDto } from './dto/verify-forget-password-merchant-employee';
import { createCacheKey } from './helpers/create-cache-key';
import IClientOtp from './interface/merchant-employee-otp';

@Injectable()
export class MerchantEmployeeService {
  constructor(
    private readonly merchantEmployeeRepository: MerchantEmployeeRepository,
    private readonly merchantRepository: MerchantRepository,
    private readonly cryptoService: CryptoService,
    private readonly mailService: MailService,
    private readonly smsService: SmsService,
    public readonly redisService: RedisService,
    private readonly ownerRepository: OwnerRepository,
    @Inject('ACTIVITIES') private readonly activitiesClient: ClientProxy,
    private authService: AuthService,
    private readonly branchRepository: BranchRepository,
    private readonly userRepository: UserRepository,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  private async _setOtp(data: MerchantEmployee, type: string): Promise<string> {
    const { uuid, email, mobile, _id } = data;

    const otp = generateOtp(uuid ?? _id, { digits: 6 });
    const clientOtp: IClientOtp = {
      otp,
      email,
      mobile,
      numberOfTries: 3,
    };

    let key: string;
    if (type === 'email') {
      key = createCacheKey({ partOne: _id.toString(), partTwo: email });
    }

    if (type === 'mobile') {
      key = createCacheKey({ partOne: _id.toString(), partTwo: mobile });
    }

    const isRedisEmailKey = await this.redisService.getClient(REDIS_MERCHANT_EMPLOYEE_NAME_SPACE).get(key);
    //const isRedisEmailKey = await this.cacheManager.get(key);

    if (isRedisEmailKey) {
      throw new HttpException('You try lots of requests to change password', 429);
    }

    await this.redisService.getClient(REDIS_MERCHANT_EMPLOYEE_NAME_SPACE).set(key, JSON.stringify(clientOtp), 'EX', 30);
    //await this.cacheManager.set(key, JSON.stringify(clientOtp));

    return otp;
  }

  private async setOtpToEmail(data: MerchantEmployee): Promise<any> {
    const otp: string = await this._setOtp(data, 'email');

    return await this.mailService.otpEmail(data, otp);
  }

  private async setOtpToMobile(data: MerchantEmployee) {
    const otp: string = await this._setOtp(data, 'mobile');

    const smsData: ISendSMS = {
      CountryCode: data.countryCode,
      mobileno: data.mobile,
      msgtext: `This is the opt: ${otp}`,
    };

    this.smsService.sendSms(smsData);
  }

  private async _verifyOtp(data: MerchantEmployee, otp, type: string) {
    let redisKey: string;

    if (type === 'email') {
      redisKey = createCacheKey({
        partOne: data.uuid,
        partTwo: data.email,
      });
    }

    if (type === 'mobile') {
      redisKey = createCacheKey({
        partOne: data.uuid,
        partTwo: data.mobile,
      });
    }

    const clientObjectString: string = await this.redisService
      .getClient(REDIS_MERCHANT_EMPLOYEE_NAME_SPACE)
      .get(redisKey);
    //const clientObjectString: string = await this.cacheManager.get(redisKey);

    if (isNil(clientObjectString)) {
      throw new BadRequestException(ERROR_CODES.err_otp_expired);
    }

    let clientOtp: IClientOtp = JSON.parse(clientObjectString);

    const { numberOfTries } = clientOtp;

    if (numberOfTries <= 0) {
      await this.redisService.getClient(REDIS_MERCHANT_EMPLOYEE_NAME_SPACE).del(redisKey);
      //await this.cacheManager.del(redisKey);
      throw new HttpException('You try more than 3 times', 429);
    } else if (clientOtp.otp !== otp) {
      const updatedNumberOfTries = numberOfTries - 1;

      clientOtp = {
        ...clientOtp,
        numberOfTries: updatedNumberOfTries,
      };

      await this.redisService.getClient(REDIS_MERCHANT_EMPLOYEE_NAME_SPACE).set(redisKey, JSON.stringify(clientOtp));
      //await this.cacheManager.set(redisKey, JSON.stringify(clientOtp));

      throw new BadRequestException(
        ERROR_CODES.err_wrong_otp_remaining.replace('_remaining', `, You have: ${updatedNumberOfTries}`),
      );
    }

    await this.redisService.getClient(REDIS_MERCHANT_EMPLOYEE_NAME_SPACE).del(redisKey);
    //await this.cacheManager.del(redisKey);
  }

  private async verifyEmailOtp(data: MerchantEmployee, otp: string) {
    await this._verifyOtp(data, otp, 'email');
  }

  private async verifyMobileOtp(data: MerchantEmployee, otp: string) {
    await this._verifyOtp(data, otp, 'mobile');
  }

  async create(user: any, createMerchantEmployeeDto: CreateMerchantEmployeeDto) {
    const { password, email, mobile } = createMerchantEmployeeDto;

    const isEmailExists = await this.merchantEmployeeRepository.exists({
      email,
      isDeleted: false,
    });

    const isPhoneExists = await this.merchantEmployeeRepository.exists({
      mobile,
      isDeleted: false,
    });

    const isEmailExists_owner = await this.ownerRepository.exists({
      email,
      isDeleted: false,
    });
    const isPhoneExists_owner = await this.ownerRepository.exists({
      mobile,
      isDeleted: false,
    });

    if (isEmailExists || isEmailExists_owner) {
      throw new ConflictException(ERROR_CODES.err_email_already_in_use);
    }

    if (isPhoneExists || isPhoneExists_owner) {
      throw new ConflictException(ERROR_CODES.err_phone_number_already_in_use);
    }

    const merchantEmployee = await this.merchantEmployeeRepository.create({
      ...omit(createMerchantEmployeeDto, ['permissions']),
      role:
        Array.isArray(createMerchantEmployeeDto?.permissions) && createMerchantEmployeeDto?.permissions.length > 0
          ? { ...MERCHANT_EMPLOYEE_ROLE, permissions: createMerchantEmployeeDto.permissions }
          : MERCHANT_EMPLOYEE_ROLE,
      password: this.cryptoService.createHash(password),
    });

    if (merchantEmployee) {
      const merchant = await this.merchantRepository.getById(
        new mongoose.Types.ObjectId(createMerchantEmployeeDto.merchantId),
        {},
      );
      const merchantEmployeeData = {
        merchantName: merchant.name,
        merchantLogo: merchant.logo,
        name: createMerchantEmployeeDto.name,
        countryCode: createMerchantEmployeeDto.countryCode,
        mobile: createMerchantEmployeeDto.mobile,
        password: createMerchantEmployeeDto.password,
        email: createMerchantEmployeeDto.email,
        otp_verify_type: createMerchantEmployeeDto.otp_verify_type,
        userJob: createMerchantEmployeeDto.job || 'cashier',
      };
      await this.mailService.employeeInvitation(merchantEmployeeData);
    }
    const addUserActivity = new Activity();
    addUserActivity.user = merchantEmployee['_id'];
    addUserActivity.scope = 'Owner';
    addUserActivity.actor = user['_id'];
    this.activitiesClient.emit(ADD_USER, addUserActivity);
    return omit(merchantEmployee, ['password']);
  }

  async login(loginOwnerDto: LoginMerchantEmployeeDto) {
    const { mobile, password, countryCode } = loginOwnerDto;

    const merchantEmployee = await this.merchantEmployeeRepository.getOne({
      mobile,
      countryCode,
    });

    if (!merchantEmployee) {
      throw new NotFoundException(ERROR_CODES.err_phone_number_not_found);
    }

    const isPasswordMatch = await this.cryptoService.compareHash(password, merchantEmployee.password);

    if (!isPasswordMatch) {
      throw new BadRequestException(ERROR_CODES.err_password_does_not_match);
    }

    if (!merchantEmployee.mobileIsVerified) {
      await this.setOtpToMobile(merchantEmployee);
      await this.setOtpToEmail(merchantEmployee);
      throw new HttpException('mobile was not verified', 403);
    }

    const { accessToken, refreshToken } = this.authService.generateTokens(AuthUserType.OWNER, { ...merchantEmployee });

    return {
      ...omit(merchantEmployee, ['password']),
      token: accessToken,
      refreshToken,
    };
  }

  async requestForgetPassword(requestForgetPasswordOwnerDto: RequestForgetPasswordMerchantEmployeeDto) {
    const { email } = requestForgetPasswordOwnerDto;
    const merchantEmployee = await this.merchantEmployeeRepository.getOne({
      email,
    });

    if (!merchantEmployee) {
      throw new NotFoundException(ERROR_CODES.err_phone_number_not_found);
    }

    await this.setOtpToEmail(merchantEmployee);
  }

  async verifyForgetPassword(verifyForgetPasswordOwnerDto: VerifyForgetPasswordMerchantEmployeeDto) {
    const { email, otp } = verifyForgetPasswordOwnerDto;
    const merchantEmployee = await this.merchantEmployeeRepository.getOne({
      email,
    });

    if (!merchantEmployee) {
      throw new NotFoundException(ERROR_CODES.err_email_not_found);
    }

    await this.verifyEmailOtp(merchantEmployee, otp);
  }

  async changePassword(changePasswordOwnerDto: ChangePasswordMerchantEmployeeDto) {
    const { email, password } = changePasswordOwnerDto;
    let merchantEmployee = await this.merchantEmployeeRepository.getOne({
      email,
    });

    if (!merchantEmployee) {
      throw new NotFoundException(ERROR_CODES.err_email_not_found);
    }

    const hashedPassword = this.cryptoService.createHash(password);

    merchantEmployee = await this.merchantEmployeeRepository.updateOne({ email }, { password: hashedPassword });

    const { accessToken, refreshToken } = this.authService.generateTokens(AuthUserType.OWNER, { ...merchantEmployee });

    return {
      ...omit(merchantEmployee, ['password']),
      token: accessToken,
      refreshToken,
    };
  }

  async getMerchantEmployeesByMerchantId(merchantId: string, params: FindAllMerchantEmployeeByMerchantIdDto) {
    const { limit, page, paginate, sortBy, order, job = [] } = params;
    const merchantEmployeeQuery = {};
    if (job?.length > 0) merchantEmployeeQuery['job'] = job;
    const merchantEmployees = await this.merchantEmployeeRepository.getAll(
      {
        merchantId: new Types.ObjectId(merchantId),
        isDeleted: false,
        ...merchantEmployeeQuery,
      },
      { limit, page, paginate, sort: { [sortBy]: order }, populate: ['branchesIds'] },
    );

    if (merchantEmployees?.['users']?.length) {
      merchantEmployees['users'] = merchantEmployees?.['users']?.map((ele) => {
        let { password, ...data } = ele?._doc;
        return data;
      });
    }

    if (!merchantEmployees) throw new NotFoundException(ERROR_CODES.err_merchant_employee_not_found);
    return merchantEmployees;
  }

  findOne(employeeId: string) {
    return this.merchantEmployeeRepository.getOne(
      {
        _id: new Types.ObjectId(employeeId),
        isDeleted: false,
      },
      {
        populate: ['branchesIds', 'merchantId'],
      },
    );
  }

  async update(employeeId: string, updateMerchantEmployeeDto: UpdateMerchantEmployeeDto) {
    const employee = await this.merchantEmployeeRepository.getById(employeeId, {});
    if (!employee) throw new NotFoundException(ERROR_CODES.err_merchant_employee_not_found);

    if (updateMerchantEmployeeDto?.email) {
      const checkEmployeeEmailExists = await this.merchantEmployeeRepository.getOne(
        { email: updateMerchantEmployeeDto.email },
        {},
      );
      const checkOwnerEmailExists = await this.ownerRepository.getOne({ email: updateMerchantEmployeeDto.email }, {});

      if (checkEmployeeEmailExists || checkOwnerEmailExists) {
        throw new ConflictException(ERROR_CODES.err_email_already_in_use);
      }
    }

    if (updateMerchantEmployeeDto?.mobile && updateMerchantEmployeeDto?.countryCode) {
      const checkEmployeeMobileExists = await this.merchantEmployeeRepository.getOne(
        { countryCode: updateMerchantEmployeeDto.countryCode, mobile: updateMerchantEmployeeDto.mobile },
        {},
      );
      const checkOwnerMobileExists = await this.ownerRepository.getOne(
        { countryCode: updateMerchantEmployeeDto.countryCode, mobile: updateMerchantEmployeeDto.mobile },
        {},
      );

      if (checkEmployeeMobileExists || checkOwnerMobileExists) {
        throw new ConflictException(ERROR_CODES.err_phone_number_already_in_use);
      }
    }

    return this.merchantEmployeeRepository.updateOne(
      {
        _id: new Types.ObjectId(employeeId),
      },
      {
        ...omit(updateMerchantEmployeeDto, ['permissions']),
        role:
          Array.isArray(updateMerchantEmployeeDto?.permissions) && updateMerchantEmployeeDto?.permissions.length > 0
            ? { ...MERCHANT_EMPLOYEE_ROLE, permissions: updateMerchantEmployeeDto.permissions }
            : employee.role,
      },
    );
  }

  async remove(employeeId: string) {
    const employee = this.merchantEmployeeRepository.getById(employeeId, {});
    if (!employee) throw new NotFoundException(ERROR_CODES.err_merchant_employee_not_found);

    return this.merchantEmployeeRepository.updateOne(
      {
        _id: new Types.ObjectId(employeeId),
      },
      {
        isDeleted: true,
      },
    );
  }

  async updateMerchantEmployeeByItself(
    updateMerchantEmployeeByItselfDto: UpdateMerchantEmployeeByItselfDto,
    user: any,
  ) {
    const merchant_employee = await this.merchantEmployeeRepository.getOne({
      _id: user._id,
      isDeleted: false,
    });

    if (!merchant_employee) throw new NotFoundException(ERROR_CODES.err_merchant_employee_not_found);

    const { oldPassword, newPassword, ...updatedMerchantEmployeeData } = updateMerchantEmployeeByItselfDto;

    if (oldPassword && newPassword) {
      const isPasswordMatch = await this.cryptoService.compareHash(oldPassword, merchant_employee.password);

      if (!isPasswordMatch) {
        throw new BadRequestException(ERROR_CODES.err_password_does_not_match);
      }

      updatedMerchantEmployeeData['password'] = await this.cryptoService.createHash(newPassword);
    }

    const updatedMerchantEmployee = await this.merchantEmployeeRepository.updateOne(
      { _id: user._id },
      { ...updatedMerchantEmployeeData },
    );

    const merchantEmployee = await this.merchantEmployeeRepository.getOne(
      {
        _id: user._id,
      },
      {
        lean: true,
        populate: [
          {
            path: 'cityId',
            populate: {
              path: 'country',
            },
          },
        ],
      },
    );

    merchantEmployee['countryId'] = merchantEmployee?.['cityId']?.['country'];
    merchantEmployee['cityId']['country'] = merchantEmployee?.['cityId']?.['country']?.['_id'];

    return merchantEmployee;
  }

  async requestChangeEmail(requestChangeEmailMerchantEmployeeDto: RequestChangeEmailMerchantEmployeeDto, user: any) {
    const { email } = requestChangeEmailMerchantEmployeeDto;

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

    return result;
  }

  async verifyChangeEmail(verifyChangeEmailMerchantEmployeeDto: VerifyChangeEmailMerchantEmployeeDto, user: any) {
    const result = await this._verifyOtp(
      { ...user, email: verifyChangeEmailMerchantEmployeeDto.email },
      verifyChangeEmailMerchantEmployeeDto.otp,
      'email',
    );

    const updatedMerchantEmployee = await this.merchantEmployeeRepository.updateOne(
      { _id: user._id },
      { email: verifyChangeEmailMerchantEmployeeDto.email },
    );

    return updatedMerchantEmployee;
  }

  async requestChangeMobile(requestChangeMobileMerchantDto: RequestChangeMobileMerchantEmployeeDto, user: any) {
    const { mobile, countryCode } = requestChangeMobileMerchantDto;

    const owner = await this.ownerRepository.getOne({
      mobile,
      countryCode,
    });

    if (owner) {
      throw new ConflictException(ERROR_CODES.err_phone_number_already_in_use);
    }

    const merchant_employee = await this.merchantEmployeeRepository.getOne({
      mobile,
      countryCode,
    });

    if (merchant_employee) {
      throw new ConflictException(ERROR_CODES.err_phone_number_already_in_use);
    }

    const result = await this.setOtpToMobile({ ...user, mobile, countryCode });

    return result;
  }

  async verifyChangeMobile(verifyChangeMobileMerchantEmployeeDto: VerifyChangeMobileMerchantEmployeeDto, user: any) {
    const result = await this._verifyOtp(
      {
        ...user,
        mobile: verifyChangeMobileMerchantEmployeeDto.mobile,
        countryCode: verifyChangeMobileMerchantEmployeeDto.countryCode,
      },
      verifyChangeMobileMerchantEmployeeDto.otp,
      'mobile',
    );

    const updatedMerchantEmployee = await this.merchantEmployeeRepository.updateOne(
      { _id: user._id },
      {
        mobile: verifyChangeMobileMerchantEmployeeDto.mobile,
        countryCode: verifyChangeMobileMerchantEmployeeDto.countryCode,
      },
    );

    return updatedMerchantEmployee;
  }

  async getNotificationIncludedUsers(branch: string, job: string) {
    const branchData = await this.branchRepository.getOne({ _id: new mongoose.Types.ObjectId(branch) }, { lean: true });
    const users = await this.merchantEmployeeRepository._model
      .find({
        branchesIds: new mongoose.Types.ObjectId(branch),
        // job,
      })
      .select({ _id: 1, uuid: 1 })
      .lean(true)
      .exec();

    const owner = await this.ownerRepository.getOne({ _id: branchData.ownerId }, { lean: true });
    if (owner) {
      users.unshift({
        ...owner,
        image: '',
        job: '',
        merchantId: '',
        branchesIds: [],
      });
    }
    return users?.filter((ele) => {
      return ele?.uuid != '';
    });
  }

  getNotificationIncludedUsersByBranches(branches: Array<string>) {
    return this.merchantEmployeeRepository._model
      .find({
        branchesIds: {
          $in: branches.map((id) => {
            return new mongoose.Types.ObjectId(id);
          }),
        },
      })
      .select({ _id: 1, uuid: 1 })
      .lean(true)
      .exec();
  }

  async updateNotificationUnSubscribedUsers(users: any[], errors: any) {
    if (errors && errors?.['invalid_player_ids']?.length > 0) {
      await Promise.all(
        errors?.['invalid_player_ids']?.map(async (ele) => {
          await this.userRepository.updateOne(
            {
              uuid: ele,
            },
            {
              uuid: '',
            },
          );
        }),
      );
    } else if (errors && errors?.[0] == 'All included players are not subscribed' && users?.length > 0) {
      await Promise.all(
        users?.map(async (ele) => {
          await this.userRepository.updateOne(
            {
              _id: new mongoose.Types.ObjectId(ele?._id.toString()),
            },
            {
              uuid: '',
            },
          );
        }),
      );
    }
  }

  async createMerchantEmployees(user: any, createMerchantEmployeesDto: CreateMerchantEmployeesDto) {
    const session = await this.merchantEmployeeRepository._model.startSession();
    session.startTransaction();
    try {
      const merchantEmployees = await Promise.all(
        await createMerchantEmployeesDto.merchantEmployees?.map(async (createMerchantEmployeeDto) => {
          const { password, email, mobile } = createMerchantEmployeeDto;

          const isEmailExists = await this.merchantEmployeeRepository.exists({
            email,
            isDeleted: false,
          });

          const isPhoneExists = await this.merchantEmployeeRepository.exists({
            mobile,
            isDeleted: false,
          });

          const isEmailExists_owner = await this.ownerRepository.exists({
            email,
            isDeleted: false,
          });
          const isPhoneExists_owner = await this.ownerRepository.exists({
            mobile,
            isDeleted: false,
          });

          if (isEmailExists || isEmailExists_owner) {
            throw new ConflictException(ERROR_CODES.err_email_already_in_use, {
              description: email,
            });
          }

          if (isPhoneExists || isPhoneExists_owner) {
            throw new ConflictException(ERROR_CODES.err_phone_number_already_in_use, {
              description: mobile,
            });
          }

          const branch = await this.branchRepository.merchantFirstBranch(createMerchantEmployeeDto.merchantId);

          const merchantEmployee = await this.merchantEmployeeRepository.create(
            {
              ...omit(createMerchantEmployeeDto, ['permissions']),
              role:
                Array.isArray(createMerchantEmployeeDto?.permissions) &&
                createMerchantEmployeeDto?.permissions.length > 0
                  ? { ...MERCHANT_EMPLOYEE_ROLE, permissions: createMerchantEmployeeDto.permissions }
                  : MERCHANT_EMPLOYEE_ROLE,
              password: this.cryptoService.createHash(password),
              branchesIds: branch ? [branch._id.toString()] : [],
              job: MERCHANT_EMPLOYEE_JOB.EMPLOYEE,
            },
            session,
          );

          if (merchantEmployee) {
            const merchant = await this.merchantRepository.getById(
              new mongoose.Types.ObjectId(createMerchantEmployeeDto.merchantId),
              {},
            );
            const merchantEmployeeData = {
              merchantName: merchant.name,
              merchantLogo: merchant.logo,
              name: createMerchantEmployeeDto.name,
              countryCode: createMerchantEmployeeDto.countryCode,
              mobile: createMerchantEmployeeDto.mobile,
              password: createMerchantEmployeeDto.password,
              email: createMerchantEmployeeDto.email,
              otp_verify_type: createMerchantEmployeeDto.otp_verify_type,
              userJob: createMerchantEmployeeDto?.job || 'cashier',
            };
            await this.mailService.employeeInvitation(merchantEmployeeData);
          }
          const addUserActivity = new Activity();
          addUserActivity.user = merchantEmployee['_id'];
          addUserActivity.scope = 'Owner';
          addUserActivity.actor = user['_id'];
          this.activitiesClient.emit(ADD_USER, addUserActivity);
          return omit(merchantEmployee, ['password']);
        }),
      );
      await session.commitTransaction();
      return { merchantEmployees };
    } catch (error) {
      // Rollback any changes made in the database
      await session.abortTransaction();

      // logging the error
      console.error(error);

      // Rethrow the error
      throw error;
    } finally {
      // Ending the session
      session.endSession();
    }
  }

  async merchantEmployeesResetPassword(
    resetPasswordMerchantEmployeeDto: ResetPasswordMerchantEmployeeDto,
    currentUser: any,
  ) {
    const { _id } = currentUser;
    const { tempPassword, newPassword, uuid } = resetPasswordMerchantEmployeeDto;

    let user = await this.merchantEmployeeRepository.getOne({
      _id: new mongoose.Types.ObjectId(_id.toString()),
    });

    if (!user) {
      throw new NotFoundException(ERROR_CODES.err_user_not_found);
    }

    if (user?.['isPasswordReset']) {
      // check if temp password is reset from before
      throw new BadRequestException(ERROR_CODES.err_user_reset_temp_password_from_before);
    }

    const isTempPasswordMatch = this.cryptoService.compareHash(tempPassword, user.password);

    if (!isTempPasswordMatch) {
      throw new BadRequestException(ERROR_CODES.err_temp_password_does_not_match);
    }

    const hashedPassword = this.cryptoService.createHash(newPassword);

    user = await this.merchantEmployeeRepository.updateOne(
      { _id: new mongoose.Types.ObjectId(_id.toString()) },
      { isPasswordReset: true, password: hashedPassword, uuid: uuid ? uuid : user.uuid },
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

    const data = await this.merchantEmployeeRepository.merchantEmployeeLogin(user.countryCode, user.mobile);

    const { accessToken, refreshToken } = await this.authService.generateTokens(AuthUserType.OWNER, payload);

    return {
      ...data,
      token: accessToken,
      refreshToken,
      success: true,
    };
  }
}
