import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { OWNER_ACTIVE_STATUS, OWNER_STATUS } from '../../common/constants/owner.constants';
import { Gender } from '../../common/constants/users.types';
import { IRole } from '../../common/interfaces/roles.interface';
import { PROVIDER_OWNER_ROLE } from '../../common/roles';

@ObjectType()
@Schema({ timestamps: true })
export class ProviderOwner {
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
  @Prop({ type: Object, default: PROVIDER_OWNER_ROLE })
  readonly role: IRole;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, default: OWNER_ACTIVE_STATUS, enum: OWNER_STATUS })
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

export const ProviderOwnerSchema = SchemaFactory.createForClass(ProviderOwner);
