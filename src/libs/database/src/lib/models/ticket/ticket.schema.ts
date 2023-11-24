import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import {
  TicketPriority,
  TicketScope,
  TicketStatus,
  TICKET_LOW_PRIORITY,
  TICKET_PENDING_STATUS,
} from '../../common/constants/ticket.constants';

export type TicketDocument = Ticket & Document;

@Schema({
  timestamps: true,
})
export class Ticket {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'TicketTag', required: true })
  tag: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'TagReason', required: true })
  reason: string;

  @Prop({ type: String, required: false })
  description: string;

  @Prop({ type: [String], required: false })
  clientNotes: string[];

  @Prop({ type: [String], required: false })
  internalNotes: string[];

  @Prop({ type: String, enum: TicketStatus, default: TICKET_PENDING_STATUS, trim: true })
  status: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User', required: true })
  createdBy: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
  resolvedBy: string;

  @Prop({ type: String, enum: TicketPriority, default: TICKET_LOW_PRIORITY })
  priority: string;

  @Prop({ type: String, enum: TicketScope, required: true })
  scope: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Merchant', required: false })
  merchant: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
