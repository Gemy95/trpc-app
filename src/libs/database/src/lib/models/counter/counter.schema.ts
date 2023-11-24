import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: false,
})
export class Counter {
  @Prop({ trim: true })
  name: string;

  @Prop()
  seq: number;
}

export const CounterSchema = SchemaFactory.createForClass(Counter);
