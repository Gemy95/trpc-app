import { Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import {
  PROVIDER_EMPLOYEE_ACTIVE_STATUS,
  PROVIDER_EMPLOYEE_JOB,
  PROVIDER_EMPLOYEE_STATUS,
} from '../../common/constants/provider-employee';
import { Gender } from '../../common/constants/users.types';
import { IRole } from '../../common/interfaces/roles.interface';
import { PROVIDER_EMPLOYEE_ROLE } from '../../common/roles';

@Schema({ timestamps: true })
export class ProviderEmployee {
  @Field(() => String, { nullable: true })
  readonly _id: string;

  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  countryCode: string;

  @Field(() => String, { nullable: true })
  mobile: string;

  @Field(() => String, { nullable: true })
  email: string;

  @Field(() => String, { nullable: true })
  password: string;

  @Field(() => String, { nullable: true })
  cityId: string;

  @Field(() => String, { nullable: true })
  countryId: string;

  @Field(() => String, { nullable: true })
  uuid: string;

  @Field(() => Boolean, { nullable: true })
  mobileIsVerified: boolean;

  @Field(() => Boolean, { nullable: true })
  emailIsVerified: boolean;

  @Field(() => String, { nullable: true })
  type: string;

  @Field(() => Boolean, { nullable: true })
  isDeleted: boolean;

  @Field(() => String, { nullable: true })
  otp_verify_type?: string;

  // @Field(() => String, { nullable: true })
  @Prop({ type: Object, default: PROVIDER_EMPLOYEE_ROLE })
  readonly role: IRole;

  @Prop({
    type: String,
    default: PROVIDER_EMPLOYEE_ACTIVE_STATUS,
    enum: PROVIDER_EMPLOYEE_STATUS,
  })
  status: string;

  @Field(() => Date, { nullable: true })
  @Prop({ type: Date })
  dateOfBirth: Date;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, default: Gender.MALE, enum: Gender, required: false })
  gender?: string;

  @Field(() => Date, { nullable: true })
  @Prop({ type: Date, required: false, default: null })
  deletedAt: Date;

  @Field({ nullable: true })
  @Prop({ type: String })
  image: string;

  @Field({ nullable: true })
  @Prop({ type: String, enum: PROVIDER_EMPLOYEE_JOB, required: false })
  job: string;

  @Field({ nullable: true })
  @Prop({ required: true, type: Types.ObjectId, ref: 'DeliveryProvider' })
  deliveryProviderId: string;

  // @Prop({ required: true, type: [Types.ObjectId], ref: 'Branch' })
  // branchesIds: Branch[] | string[];

  @Field(() => Date, { nullable: true })
  @Prop({ type: Date, required: false })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  @Prop({ type: Date, required: false })
  updatedAt?: Date;

  @Prop({ type: String })
  twoFactorAuthenticationSecret?: string;

  @Prop({ type: Boolean, default: false })
  isTwoFactorAuthenticationEnabled?: boolean;
}

export const ProviderEmployeeSchema = SchemaFactory.createForClass(ProviderEmployee);
