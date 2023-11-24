import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Gender } from '../../common/constants/users.types';
import { OWNER_STATUS, OWNER_ACTIVE_STATUS } from '../../common/constants/owner.constants';
import { IRole } from '../../common/interfaces/roles.interface';
import { OWNER_ROLE } from '../../common/roles';

@Schema({ timestamps: true })
export class Owner {
  readonly _id: string;
  name: string;
  countryCode: string;
  mobile: string;
  email: string;
  password: string;
  cityId: string;
  countryId: string;
  uuid: string;
  mobileIsVerified: boolean;
  emailIsVerified: boolean;
  type: string;
  isDeleted: boolean;
  otp_verify_type?: string;

  @Prop({ type: Object, default: OWNER_ROLE })
  readonly role: IRole;

  @Prop({ type: String, default: OWNER_ACTIVE_STATUS, enum: OWNER_STATUS })
  status: string;

  @Prop({ type: Date })
  dateOfBirth: Date;

  @Prop({ type: String, default: Gender.MALE, enum: Gender, required: false })
  gender?: string;

  @Prop({ type: Date, required: false, default: null })
  deletedAt: Date;
}

export const OwnerSchema = SchemaFactory.createForClass(Owner);
