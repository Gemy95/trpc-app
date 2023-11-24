// import { Prop, Schema, SchemaFactory } from '../../../../../../delivery-provider-app/common/constants/driver.constants';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { User } from '../../..';
import { Gender, OTP_VERIFICATION_TYPE, OTP_VERIFICATION_TYPE_MOBILE } from '../../common/constants/users.types';
import { IRole } from '../../common/interfaces/roles.interface';
import { DRIVER_ROLE } from '../../common/roles';
import { Location } from '../location/location.schema';
import { Vehicle } from '../vehicle/vehicle.schema';

const { Types } = mongoose.Schema;

@Schema({ timestamps: true, discriminatorKey: 'type' })
export class Driver {
  readonly _id: string;

  @Prop({ type: Types.ObjectId, ref: 'DeliveryProvider' })
  deliveryProviderId: string;

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

  @Prop({ type: Object, default: DRIVER_ROLE })
  role: IRole;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({
    type: String,
    default: OTP_VERIFICATION_TYPE_MOBILE,
    enum: OTP_VERIFICATION_TYPE,
  })
  otp_verify_type: string;

  @Prop({ type: [mongoose.Types.ObjectId], required: true, ref: 'Vehicle' })
  vehiclesIds: Vehicle[] | string[];

  @Prop({ type: String, trim: true })
  nationality: string;

  @Prop({ type: String, trim: true })
  national_id: string;

  @Prop({
    type: String,
    // enum: DRIVER_STATUS.pending,
    // default: DRIVER_STATUS.pending,
  })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  approvedBy: User | mongoose.Types.ObjectId;

  @Prop({ type: Boolean, default: true, required: false })
  inReview: boolean;

  @Prop({ type: [String], required: false })
  notes?: string[];

  @Prop({ type: Location })
  location: Location;

  @Prop({ type: String })
  twoFactorAuthenticationSecret?: string;

  @Prop({ type: Boolean, default: false })
  isTwoFactorAuthenticationEnabled?: boolean;

  @Prop({
    type: String,
    default: 'Driver',
  })
  type?: string;
}

export const DriverSchema = SchemaFactory.createForClass(Driver);
