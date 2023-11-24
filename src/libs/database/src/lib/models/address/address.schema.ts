import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Location } from '../../../lib/models/location/location.schema';
import { CLIENT_ADDRESS_HOME_TYPE, CLIENT_ADDRESS_TYPE } from '../../common/constants/client.constants';
import { Client } from '../client/client.schema';

export type AddressDocument = Address & Document;

@Schema({ _id: true, timestamps: true })
export class Address {
  readonly _id?: string;

  @Prop({ trim: true, required: true })
  name?: string;

  @Prop({
    type: String,
    default: CLIENT_ADDRESS_HOME_TYPE,
    enum: CLIENT_ADDRESS_TYPE,
  })
  type?: string;

  @Prop({ trim: true })
  street?: string;

  @Prop({ type: Types.ObjectId, ref: Client.name, required: true })
  client?: string;

  @Prop({ type: Location })
  location?: Location;

  @Prop({ type: [Number] })
  locationDelta?: number[];

  @Prop({ type: Boolean, default: false })
  isDeleted?: boolean;

  @Prop()
  floor?: number;

  @Prop({ trim: true })
  note?: string;

  @Prop({ type: Types.ObjectId, ref: 'City', required: false })
  city?: string;

  @Prop({ type: Boolean, default: true })
  active?: boolean;
}

export const AddressSchema = SchemaFactory.createForClass(Address);

AddressSchema.index({ location: '2dsphere' });
