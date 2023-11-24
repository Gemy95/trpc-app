import { RedisService } from '@liaoliaots/nestjs-redis';
import {
  BadRequestException,
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
// import * as generateOtp from 'gen-totp';
import generateOtp from 'gen-totp';
import * as _ from 'lodash';
import { omit } from 'lodash';
import mongoose, { Types } from 'mongoose';

import { ERROR_CODES } from '../../../libs/utils/src';
import { AuthService } from '../auth/auth.service';
import { AuthUserType } from '../auth/shared/constants/auth.types.enum';
import { ADD_USER } from '../common/constants/activities.constant';
import { Activity } from '../common/constants/activities.event.constants';
import { REDIS_SHOPPEX_EMPLOYEE_NAME_SPACE } from '../common/constants/shoppex.employee.constants';
import { SHOPPEX_EMPLOYEE_ROLE } from '../common/roles';
import { CryptoService } from '../crypto/crypto.service';
import { MailService } from '../mail/mail.service';
import { ShoppexEmployee, ShoppexEmployeeRepository } from '../models';
import { AdminRepository } from '../models/admin/admin.repository';
import { ChangePasswordShoppexEmployeeDto } from './dto/change-password-shoppex-employee';
import { BodyConfirmShoppexEmployeeDto, ParamsConfirmShoppexEmployeeDto } from './dto/confirm-shoppex-employee';
import { CreateShoppexEmployeeDto } from './dto/create-shoppex-employee.dto';
import { getShoppexEmployeesDto } from './dto/get-shoppex-employee.dto';
import { LoginShoppexEmployeeDto } from './dto/login-shoppex-employee';
import { RequestForgetPasswordShoppexEmployeeDto } from './dto/request-forget-password-shoppex-employee';
import { UpdateShoppexEmployeeDto } from './dto/update-shoppex-employee.dto';
import { VerifyForgetPasswordShoppexEmployeeDto } from './dto/verify-forget-password-shoppex-employee';
import { createCacheKey } from './helpers/create-cache-key';
import IShoppexEmployeeOtp from './interface/shoppex-employee-otp';

@Injectable()
export class ShoppexEmployeeService {
  constructor(
    private readonly shoppexEmployeeRepository: ShoppexEmployeeRepository,
    private readonly cryptoService: CryptoService,
    private readonly mailService: MailService,
    public readonly redisService: RedisService,
    @Inject('ACTIVITIES') private readonly activitiesClient: ClientProxy,
    public readonly authService: AuthService,
    private readonly adminRepository: AdminRepository,
  ) {}

  async getAll(query: getShoppexEmployeesDto) {
    const { limit = 10, page = 0, employeeName, employeeEmail, employeeMobile, departments, status } = query || {};
    const matchQuery = {};
    if (employeeName) {
      matchQuery['name'] = employeeName;
    }
    if (employeeEmail) {
      matchQuery['email'] = employeeEmail;
    }
    if (employeeMobile) {
      matchQuery['mobile'] = employeeMobile;
    }
    if (status) {
      matchQuery['status'] = status;
    }
    if (departments) {
      matchQuery['departments._id'] = {
        $in: departments.map((id) => new Types.ObjectId(id)),
      };
    }
    return this.shoppexEmployeeRepository.aggregate(
      [
        {
          $lookup: {
            from: 'departments',
            localField: 'departments',
            foreignField: '_id',
            as: 'departments',
          },
        },
        {
          $match: matchQuery,
        },
        {
          $project: {
            password: 0,
            role: 0,
          },
        },
      ],
      {
        page,
        limit,
        sort: {},
        paginate: true,
      },
    );
  }

  private async _setOtp(data: ShoppexEmployee, type: string): Promise<string> {
    const { uuid, email, mobile, _id } = data;

    const otp = generateOtp(uuid ?? _id, { digits: 6 });
    const clientOtp: IShoppexEmployeeOtp = {
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

    const isRedisEmailKey = await this.redisService.getClient(REDIS_SHOPPEX_EMPLOYEE_NAME_SPACE).get(key);

    if (isRedisEmailKey) {
      throw new HttpException(ERROR_CODES.err_otp_request_exceeded, 429);
    }

    await this.redisService.getClient(REDIS_SHOPPEX_EMPLOYEE_NAME_SPACE).set(key, JSON.stringify(clientOtp), 'EX', 30);

    return otp;
  }

  private async setOtpToEmail(data: ShoppexEmployee) {
    const otp: string = await this._setOtp(data, 'email');

    await this.mailService.otpEmail(data, otp);
  }

  private async _verifyOtp(data: ShoppexEmployee, otp, type: string) {
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
      .getClient(REDIS_SHOPPEX_EMPLOYEE_NAME_SPACE)
      .get(redisKey);

    if (_.isNil(clientObjectString)) {
      throw new BadRequestException(ERROR_CODES.err_otp_expired);
    }

    let clientOtp: IShoppexEmployeeOtp = JSON.parse(clientObjectString);

    const { numberOfTries } = clientOtp;

    if (numberOfTries <= 0) {
      await this.redisService.getClient(REDIS_SHOPPEX_EMPLOYEE_NAME_SPACE).del(redisKey);
      throw new HttpException(ERROR_CODES.err_otp_request_exceeded, 429);
    } else if (clientOtp.otp !== otp) {
      const updatedNumberOfTries = numberOfTries - 1;

      clientOtp = {
        ...clientOtp,
        numberOfTries: updatedNumberOfTries,
      };

      await this.redisService.getClient(REDIS_SHOPPEX_EMPLOYEE_NAME_SPACE).set(redisKey, JSON.stringify(clientOtp));

      throw new BadRequestException(
        ERROR_CODES.err_wrong_otp_remaining.replace('_remaining', `, You have: ${updatedNumberOfTries}`),
      );
    }

    await this.redisService.getClient(REDIS_SHOPPEX_EMPLOYEE_NAME_SPACE).del(redisKey);
  }

  private async verifyEmailOtp(data: ShoppexEmployee, otp: string) {
    await this._verifyOtp(data, otp, 'email');
  }

  private async verifyMobileOtp(data: ShoppexEmployee, otp: string) {
    await this._verifyOtp(data, otp, 'mobile');
  }

  async create(user: any, createShoppexEmployeeDto: CreateShoppexEmployeeDto) {
    const { password, email, mobile } = createShoppexEmployeeDto;

    const isEmailExists = await this.shoppexEmployeeRepository.exists({
      email,
      isDeleted: false,
    });

    const isPhoneExists = await this.shoppexEmployeeRepository.exists({
      mobile,
      isDeleted: false,
    });

    if (isEmailExists) {
      throw new ConflictException(ERROR_CODES.err_email_already_in_use);
    }

    if (isPhoneExists) {
      throw new ConflictException(ERROR_CODES.err_phone_number_already_in_use);
    }

    const employee = await this.shoppexEmployeeRepository.create({
      ...omit(createShoppexEmployeeDto, ['permissions']),
      role:
        Array.isArray(createShoppexEmployeeDto?.permissions) && createShoppexEmployeeDto?.permissions.length > 0
          ? { ...SHOPPEX_EMPLOYEE_ROLE, permissions: createShoppexEmployeeDto.permissions }
          : SHOPPEX_EMPLOYEE_ROLE,
      password: this.cryptoService.createHash(password),
    });

    if (employee) {
      const employeeData = {
        email: createShoppexEmployeeDto.email,
        countryCode: createShoppexEmployeeDto.countryCode,
        mobile: createShoppexEmployeeDto.mobile,
        password: createShoppexEmployeeDto.password,
      };
      await this.mailService.shoppexEmployeeRegisterationEmail(employeeData);
    }

    const addUserActivity = new Activity();
    addUserActivity.user = employee['_id'];
    addUserActivity.scope = 'Shoppex';
    addUserActivity.actor = user['_id'];
    this.activitiesClient.emit(ADD_USER, addUserActivity);

    return _.omit(employee, ['password']);
  }

  async verifyMobile(mobileDto: BodyConfirmShoppexEmployeeDto & ParamsConfirmShoppexEmployeeDto) {
    const { email, otp } = mobileDto;
    let employee = await this.shoppexEmployeeRepository.getOne({ email });

    if (!employee) {
      throw new NotFoundException(ERROR_CODES.err_phone_number_not_found);
    }

    await this.verifyMobileOtp(employee, otp);

    employee = await this.shoppexEmployeeRepository.updateOne(
      { mobile: employee.mobile },
      { mobileIsVerified: true, uuid: mobileDto.uuid ? mobileDto.uuid : employee.uuid },
    );

    const { accessToken, refreshToken } = this.authService.generateTokens(AuthUserType.ADMIN, { ...employee });

    return {
      ..._.omit(employee, ['password']),
      token: accessToken,
      refreshToken,
    };
  }

  async verifyEmail(emailDto: BodyConfirmShoppexEmployeeDto & ParamsConfirmShoppexEmployeeDto) {
    const { email, otp } = emailDto;
    let employee = await this.shoppexEmployeeRepository.getOne({ email });

    if (!employee) {
      throw new NotFoundException(ERROR_CODES.err_email_not_found);
    }

    await this.verifyEmailOtp(employee, otp);

    employee = await this.shoppexEmployeeRepository.updateOne(
      { email: employee.email },
      { emailIsVerified: true, uuid: emailDto.uuid ? emailDto.uuid : employee.uuid },
    );

    const { accessToken, refreshToken } = this.authService.generateTokens(AuthUserType.ADMIN, { ...employee });

    return {
      ..._.omit(employee, ['password']),
      token: accessToken,
      refreshToken,
    };
  }

  async login(loginShoppexEmployeeDto: LoginShoppexEmployeeDto, isJwtLogin = true) {
    const { mobile, password, countryCode } = loginShoppexEmployeeDto;

    let employee = await this.shoppexEmployeeRepository.getOne(
      {
        mobile,
        countryCode,
        type: 'ShoppexEmployee',
        isDeleted: false,
      },
      { lean: true },
    );

    if (!employee) {
      employee = await this.adminRepository.getOne(
        {
          mobile,
          countryCode,
          type: 'Admin',
          isDeleted: false,
        },
        { lean: true },
      );
    }

    if (!employee) {
      throw new NotFoundException(ERROR_CODES.err_phone_number_not_found);
    }

    const isPasswordMatch = isJwtLogin ? this.cryptoService.compareHash(password, employee.password) : true;

    if (!isPasswordMatch) {
      throw new BadRequestException(ERROR_CODES.err_password_does_not_match);
    }
    loginShoppexEmployeeDto.uuid
      ? (employee = await this.shoppexEmployeeRepository.updateOne(
          { countryCode, mobile },
          {
            uuid: employee.uuid,
          },
        ))
      : 0;

    delete employee?.password;

    const tokenPayload = _.pick(employee, [
      '_id',
      'name',
      'email',
      'type',
      'countryCode',
      'mobile',
      'role',
      'countryCode',
      'mobile',
      'isTwoFactorAuthenticationEnabled',
      'job',
    ]);

    const { accessToken, refreshToken } = this.authService.generateTokens(AuthUserType.ADMIN, tokenPayload);

    const newLoginActivity = new Activity();

    // newLoginActivity.scope = employee.type;
    newLoginActivity.actor = employee['_id'];

    this.activitiesClient.emit('login', newLoginActivity);

    return {
      ...employee,
      token: accessToken,
      refreshToken,
    };
  }

  async requestForgetPassword(requestForgetPasswordOwnerDto: RequestForgetPasswordShoppexEmployeeDto) {
    try {
      const { email } = requestForgetPasswordOwnerDto;
      const employee = await this.shoppexEmployeeRepository.getOne({ email });

      if (!employee) {
        throw new NotFoundException(ERROR_CODES.err_email_not_found);
      }

      await this.setOtpToEmail(employee);
      return { message: 'success', success: true };
    } catch (error) {
      return { message: error?.message ?? ERROR_CODES.unknow_error, success: false };
    }
  }

  async verifyForgetPassword(verifyForgetPasswordShoppexDto: VerifyForgetPasswordShoppexEmployeeDto) {
    const { email, otp } = verifyForgetPasswordShoppexDto;
    const employee = await this.shoppexEmployeeRepository.getOne({ email });

    if (!employee) {
      throw new NotFoundException(ERROR_CODES.err_email_not_found);
    }

    await this.verifyEmailOtp(employee, otp);
  }

  async changePassword(changePasswordShoppexEmployeeDto: ChangePasswordShoppexEmployeeDto) {
    const { email, password, oldPassword } = changePasswordShoppexEmployeeDto;
    const employee = await this.shoppexEmployeeRepository.getOne({ email });

    if (!employee) {
      throw new NotFoundException(ERROR_CODES.err_email_not_found);
    }
    const compareHash = this.cryptoService.compareHash(oldPassword, employee.password);

    if (!compareHash) throw new UnauthorizedException(ERROR_CODES.err_password_does_not_match);

    const hashedPassword = this.cryptoService.createHash(password);

    const updatedEmployee = await this.shoppexEmployeeRepository.updateOne(
      { email },
      {
        password: hashedPassword,
        uuid: changePasswordShoppexEmployeeDto.uuid ? changePasswordShoppexEmployeeDto.uuid : employee.uuid,
      },
    );

    const { accessToken, refreshToken } = this.authService.generateTokens(AuthUserType.ADMIN, { ...updatedEmployee });

    return {
      updatedEmployee,
      token: accessToken,
      refreshToken,
    };
  }

  async update(id: string, updateEmployeeDto: UpdateShoppexEmployeeDto) {
    const shoppexEmployee = this.shoppexEmployeeRepository._model.findById(id);
    if (!shoppexEmployee) throw new NotFoundException(ERROR_CODES.err_user_not_found);

    return this.shoppexEmployeeRepository.updateById(
      id,
      {
        ...omit(updateEmployeeDto, ['permissions']),
        role:
          Array.isArray(updateEmployeeDto?.permissions) && updateEmployeeDto?.permissions.length > 0
            ? { ...SHOPPEX_EMPLOYEE_ROLE, permissions: updateEmployeeDto.permissions }
            : SHOPPEX_EMPLOYEE_ROLE,
      },
      { new: true },
      {},
    );
  }

  async delete(id: string) {
    const shoppexEmployee = this.shoppexEmployeeRepository.getById(id, {});
    if (!shoppexEmployee) throw new NotFoundException(ERROR_CODES.err_user_not_found);

    return this.shoppexEmployeeRepository.updateById(
      id,
      {
        isDeleted: true,
      },
      { new: true },
      {},
    );
  }
  async findOne(id: string) {
    const shoppexEmployee = this.shoppexEmployeeRepository.getOne(
      {
        _id: new mongoose.Types.ObjectId(id),
        isDeleted: false,
      },
      { populate: ['countryId', 'cityId', 'departments'] },
    );

    if (!shoppexEmployee) throw new NotFoundException(ERROR_CODES.err_user_not_found);

    return shoppexEmployee;
  }

  async shoppexEmployeeRefreshToken(user: any) {
    const employee = await this.shoppexEmployeeRepository.getOne(
      {
        mobile: user['mobile'],
        countryCode: user['countryCode'],
        type: 'ShoppexEmployee',
      },
      { lean: true },
    );

    if (!employee) {
      throw new NotFoundException(ERROR_CODES.err_phone_number_not_found);
    }

    const { accessToken, refreshToken } = this.authService.generateTokens(AuthUserType.ADMIN, user);

    return {
      ...employee,
      token: accessToken,
      refreshToken,
    };
  }
}
