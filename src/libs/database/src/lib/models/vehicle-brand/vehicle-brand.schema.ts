import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VehicleBrandDocument = VehicleBrand & Document;

@ObjectType()
@Schema({ _id: true, timestamps: true })
export class VehicleBrand {
  @Field(() => String, { nullable: true })
  readonly _id: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: true })
  brand_name: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  brand_description?: string;

  @Field(() => Date, { nullable: true })
  @Prop({ type: Date, required: false })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  @Prop({ type: Date, required: false })
  updatedAt?: Date;
}

export const VehicleBrandSchema = SchemaFactory.createForClass(VehicleBrand);
