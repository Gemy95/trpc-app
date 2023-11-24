import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { Gender, OTP_VERIFICATION_TYPE, OTP_VERIFICATION_TYPE_MOBILE } from '../../common/constants/users.types';
import { IRole } from '../../common/interfaces/roles.interface';
import { Admin } from '../admin/admin.schema';
import { Client } from '../client/client.schema';
import { Owner } from '../owner/owner.schema';
import { ShoppexEmployee } from '../shoppex-employee/shoppex-employee.schema';

const { Types } = mongoose.Schema;

@Schema({ timestamps: true, discriminatorKey: 'type' })
export class User {
  readonly _id: string;

  @Prop({ type: String, trim: true, lowercase: true })
  name: string;

  @Prop({ type: String, trim: true })
  countryCode: string;

  @Prop({ type: String, trim: true })
  mobile: string;

  @Prop({ type: String, trim: true, unique: false })
  email: string;

  @Prop({ type: String, trim: true })
  password: string;

  @Prop({ type: Types.ObjectId, ref: 'City' })
  cityId: string;

  @Prop({ type: Types.ObjectId, ref: 'Country' })
  countryId: string;

  @Prop({ type: String })
  uuid: string;

  @Prop({ type: Boolean, default: false })
  mobileIsVerified: boolean;

  @Prop({ type: Boolean, default: false })
  emailIsVerified: boolean;

  @Prop({ type: String })
  imageUrl: string;

  @Prop({ type: String, required: false, enum: Gender })
  gender: string;

  @Prop({ type: Object })
  role: IRole;

  @Prop({
    type: String,
    enum: [Owner.name, Client.name, ShoppexEmployee.name, Admin.name],
  })
  type: string;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({
    type: String,
    default: OTP_VERIFICATION_TYPE_MOBILE,
    enum: OTP_VERIFICATION_TYPE,
  })
  otp_verify_type: string;

  @Prop({ type: String })
  twoFactorAuthenticationSecret: string;

  @Prop({ type: Boolean, default: false })
  isTwoFactorAuthenticationEnabled: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
