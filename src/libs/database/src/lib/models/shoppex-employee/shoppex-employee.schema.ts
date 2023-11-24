import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { IRole } from '../../common/interfaces/roles.interface';
import { SHOPPEX_EMPLOYEE_ROLE } from '../../common/roles';

// import { EMPLOYEE_STATUS } from '../../shoppex-employee/interface/status.enum';

const { Types } = mongoose.Schema;

@Schema({ timestamps: true })
export class ShoppexEmployee {
  readonly _id: string;

  @Prop({ type: Object, default: SHOPPEX_EMPLOYEE_ROLE })
  readonly role: IRole;

  @Prop({ type: [String] })
  permissions: string[];

  @Prop({ required: true, type: [{ type: Types.ObjectId, ref: 'Department' }] })
  departments: string[];

  // @Prop({ type: String, default: EMPLOYEE_STATUS.ACTIVE })
  // status: EMPLOYEE_STATUS;

  @Prop({ type: Boolean, default: true })
  mobileIsVerified: boolean;

  @Prop({ type: Boolean, default: true })
  emailIsVerified: boolean;

  @Prop({ type: Boolean, default: false })
  notifyOnOrders: boolean;

  @Prop({ type: Boolean, default: false })
  notifyOnReservations: boolean;

  @Prop({ type: Boolean, default: false })
  notifyOnRatings: boolean;

  @Prop({ type: Boolean, default: false })
  notifyOnTransactions: boolean;

  @Prop({ type: Boolean, default: false })
  notifyOnRequests: boolean;

  @Prop({ trim: true, type: String })
  name: string;
  @Prop({ trim: true, type: String })
  countryCode: string;
  @Prop({ trim: true, type: String })
  mobile: string;
  @Prop({ trim: true, type: String })
  email: string;
  @Prop({ trim: true, type: String })
  password: string;
  @Prop({ trim: true, type: String })
  uuid: string;
  @Prop({ trim: true, type: String })
  cityId: string;
  @Prop({ trim: true, type: String })
  countryId: string;
  // @Prop({ trim: true, type: String })
  // type: string;
  @Prop()
  isDeleted: boolean;

  @Prop({ type: String })
  twoFactorAuthenticationSecret?: string;

  @Prop({ type: Boolean, default: false })
  isTwoFactorAuthenticationEnabled?: boolean;

  @Prop({ type: String, required: false })
  job?: string;
}

export const ShoppexEmployeeSchema = SchemaFactory.createForClass(ShoppexEmployee);
