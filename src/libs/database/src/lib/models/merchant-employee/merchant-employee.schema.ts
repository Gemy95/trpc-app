import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import {
  MERCHANT_EMPLOYEE_ACTIVE_STATUS,
  MERCHANT_EMPLOYEE_JOB,
  MERCHANT_EMPLOYEE_STATUS,
} from '../../common/constants/merchant-employee';
import { IRole } from '../../common/interfaces/roles.interface';
import { MERCHANT_EMPLOYEE_ROLE } from '../../common/roles';
import { Branch } from '../branch/branch.schema';

const { Types } = mongoose.Schema;

@Schema({ timestamps: true })
export class MerchantEmployee {
  readonly _id: string;

  @Prop({
    type: String,
    default: MERCHANT_EMPLOYEE_ACTIVE_STATUS,
    enum: MERCHANT_EMPLOYEE_STATUS,
  })
  status: string;

  @Prop({ type: Date })
  dateOfBirth: Date;

  @Prop({ type: String })
  image: string;

  @Prop({ type: String, enum: MERCHANT_EMPLOYEE_JOB, required: false })
  job: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Merchant' })
  merchantId: string;

  @Prop({ required: true, type: [Types.ObjectId], ref: 'Branch' })
  branchesIds: Branch[] | string[];

  @Prop({ type: Object, default: MERCHANT_EMPLOYEE_ROLE })
  readonly role: IRole;

  name: string;
  countryCode: string;
  mobile: string;
  email: string;
  password: string;
  uuid: string;
  cityId: string;
  countryId: string;
  mobileIsVerified: boolean;
  emailIsVerified: boolean;
  @Prop({ type: Boolean, default: false })
  isPasswordReset?: boolean;
  type: string;
  isDeleted: boolean;
  otp_verify_type?: string;

  @Prop({ type: Date, required: false, default: null })
  deletedAt: Date;

  @Prop({ type: Boolean, default: false })
  allowReadTemplate?: boolean;

  @Prop({ type: Boolean, default: false })
  allowCreateTemplate?: boolean;

  @Prop({ type: Boolean, default: false })
  allowUpdateTemplate?: boolean;

  @Prop({ type: String })
  twoFactorAuthenticationSecret?: string;

  @Prop({ type: Boolean, default: false })
  isTwoFactorAuthenticationEnabled?: boolean;

  @Prop({ type: Boolean, default: false })
  isStoreFrontLoginEnabled?: boolean;
}

export const MerchantEmployeeSchema = SchemaFactory.createForClass(MerchantEmployee);
