import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CLIENT_ACTIVE_STATUS, CLIENT_STATUS } from '../../common/constants/client.constants';
import { IRole } from '../../common/interfaces/roles.interface';
import { CLIENT_ROLE } from '../../common/roles';

@Schema({ timestamps: true })
export class Client {
  readonly _id: string;

  @Prop({ type: Date })
  dateOfBirth: Date;

  @Prop({ type: Number, default: 0 })
  balance: number;

  @Prop({ type: String, default: CLIENT_ACTIVE_STATUS, enum: CLIENT_STATUS })
  status: string;

  @Prop({ type: Object, default: CLIENT_ROLE })
  readonly role: IRole;

  imageUrl: string;
  mobileIsVerified: boolean;
  emailIsVerified: boolean;
  name: string;
  countryCode: string;
  mobile: string;
  email: string;
  password: string;
  cityId: string;
  countryId: string;
  uuid: string;
  gender: string;
  isDeleted: boolean;
  otp_verify_type?: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
