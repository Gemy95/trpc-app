import mongoose from 'mongoose';

export class Ticket {
  tag: mongoose.Types.ObjectId;
  reason: mongoose.Types.ObjectId;
  description?: string;
  clientNotes?: string[];
  internalNotes?: string[];
  status?: string;
  createdBy: mongoose.Types.ObjectId;
  resolvedBy?: mongoose.Types.ObjectId;
  priority?: string;
  scope: string;
  merchant?: mongoose.Types.ObjectId;
}
