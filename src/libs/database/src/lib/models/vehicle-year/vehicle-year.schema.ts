import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VehicleYearDocument = VehicleYear & Document;

@ObjectType()
@Schema({ _id: true, timestamps: true })
export class VehicleYear {
  @Field(() => String, { nullable: true })
  readonly _id: string;

  @Field(() => Number, { nullable: true })
  @Prop({ type: Number, required: true })
  year_number: number;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  year_description?: string;

  @Field(() => Date, { nullable: true })
  @Prop({ type: Date, required: false })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  @Prop({ type: Date, required: false })
  updatedAt?: Date;
}

export const VehicleYearSchema = SchemaFactory.createForClass(VehicleYear);
