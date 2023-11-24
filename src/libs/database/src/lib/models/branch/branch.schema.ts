import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';
import {
  BRANCH_STATUS,
  BRANCH_STATUS_TAGS,
  DAYS,
  BRANCH_RESERVATION_STATUS,
  VISIBILITY_STATUS,
} from '../../common/constants/branch.constants';
import { Location } from '../location/location.schema';
import { Merchant } from '../merchant/merchant.schema';
import { Owner } from '../owner/owner.schema';
import { City } from '../city/city.schema';
import { BranchGroup } from '../branch-group/branch-group.schema';
import { ChargeDetails } from '../order/invoice.schema';
const { Types } = mongoose.Schema;

export type BranchDocument = Branch & Document;

@Schema({ _id: false })
export class BranchTranslation {
  @Prop()
  _lang: string;
  @Prop({ trim: true })
  name: string;
}

@Schema({ _id: false })
export class BranchDuration {
  /**
  @Prop({ type: Date })
  startAt: Date;

  @Prop({ type: Date })
  endAt: Date;
   */
  @Prop({ type: String })
  startAt: string;

  @Prop({ type: String })
  endAt: string;
}

@Schema({})
export class BranchWorkingHours {
  @Prop({ type: String, enum: DAYS, default: DAYS.SATURDAY })
  day: string;

  @Prop([BranchDuration])
  durations: BranchDuration[];
}

@Schema({})
export class ReservationsDays {
  @Prop({ type: String, enum: DAYS, default: DAYS.SATURDAY })
  day: string;

  @Prop({ type: Array<ReservationHours>, required: true })
  workingHours: ReservationHours[];

  @Prop({ type: Boolean, default: true })
  available?: boolean;

  @Prop({ type: Boolean, default: false })
  disabled?: boolean;

  @Prop({ type: Boolean, required: false })
  full_reserved?: boolean;

  @Prop({ type: Array<DaysInstructions>, required: false })
  instructions?: DaysInstructions[];
}

@Schema({})
export class ReservationHours {
  @Prop({ type: String })
  startAt: string;

  @Prop({ type: String })
  endAt: string;

  @Prop({ type: Boolean, default: false })
  disabled?: boolean;

  @Prop({ type: Number })
  capacity?: number;

  @Prop({ type: Number })
  avgClientLifeTime?: number;

  @Prop({ type: Number })
  capacityPerAverageClientTime?: number;
}

@Schema({ _id: false, timestamps: false })
export class ReservationTranslation {
  @Prop({ type: String })
  _lang: string;

  @Prop({ trim: true, type: String })
  name: string;

  @Prop({ trim: true, type: String })
  content: string;
}

@Schema({})
export class Feature {
  @Prop({ type: String })
  icon: string;

  @Prop({ type: String })
  content: string;

  @Prop({ type: Array<ReservationTranslation> })
  translation: ReservationTranslation[];
}

export class DaysInstructions {
  @Prop({ type: String })
  content: string;

  @Prop({ type: Array<ReservationTranslation> })
  translation: ReservationTranslation[];
}
export class ClientsInstructions {
  @Prop({ type: String })
  content: string;

  @Prop({ type: Array<ReservationTranslation> })
  translation: ReservationTranslation[];
}

export class BranchInstructions {
  @Prop({ type: String })
  content: string;

  @Prop({ type: Array<ReservationTranslation> })
  translation: ReservationTranslation[];
}

export class CancelPolicyInstructions {
  @Prop({ type: String })
  content: string;

  @Prop({ type: Array<ReservationTranslation> })
  translation: ReservationTranslation[];
}

@Schema({})
export class ReservationsSettings {
  @Prop({ type: Boolean, default: false })
  enabled: boolean;

  @Prop({ type: Boolean })
  isEnabledWaitingList: boolean;

  @Prop({ type: Number })
  waitingListCapacity: number;

  @Prop({ type: Number })
  initialPrice: number;

  @Prop({ type: Number })
  averageReservationPeriod: number;

  @Prop({ type: Number })
  separationTimeBetweenEachReservation: number;

  @Prop({ type: Array<ClientsInstructions> })
  clientsInstructions: ClientsInstructions[];

  @Prop({ type: Array<BranchInstructions> })
  branchInstructions: BranchInstructions[];

  @Prop({ type: Array<Feature> })
  features: Feature[];

  @Prop({ type: Array<CancelPolicyInstructions> })
  cancelPolicyInstructions: CancelPolicyInstructions[];

  @Prop({ type: Boolean, default: false })
  enableSharingReservation: boolean;

  @Prop({ type: Boolean, default: false })
  enableReservationForStore: boolean;

  @Prop({ type: Boolean, default: false })
  enableReservationForMobileClients: boolean;
}

@Schema({ timestamps: true })
export class Branch {
  public readonly _id: string;

  @Prop({ trim: true })
  name: string;

  @Prop()
  search: string[];

  @Prop({ trim: true })
  mobile: string;

  @Prop({ type: String })
  address: string;

  @Prop({ required: false, type: Types.ObjectId || String, ref: 'City' }) // required false in case menu template merchant
  cityId: string | City | mongoose.Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Merchant' })
  merchantId: string | Merchant | mongoose.Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Owner' })
  ownerId: string | Owner | mongoose.Types.ObjectId;

  @Prop({ type: Boolean, default: true })
  visibleToClients: boolean;

  // @Prop({ type: String, enum: BUILD_STATUS, default: BUILD_STATUS.APPROVED_STATUS })
  // build_status: string;

  // @Prop({ type: String, enum: RELEASE_STATUS, default: RELEASE_STATUS.ACTIVE_STATUS })
  // release_status: string;

  @Prop({
    type: String,
    enum: BRANCH_STATUS,
    default: BRANCH_STATUS.PENDING_STATUS,
  })
  status: string;

  @Prop({
    type: String,
    enum: BRANCH_STATUS_TAGS,
    default: BRANCH_STATUS_TAGS.UNDER_REVIEW_STATUS,
    required: false,
  })
  status_tags?: string;

  @Prop({
    type: String,
    enum: VISIBILITY_STATUS,
    default: VISIBILITY_STATUS.OFFLINE_STATUS,
  })
  visibility_status: string;

  @Prop({ type: [String] })
  notes?: string[];

  @Prop({ type: Boolean, default: false })
  isFreezing: boolean;

  @Prop({ type: Location })
  location: Location;

  @Prop({ type: [Number] })
  locationDelta: number[];

  @Prop({ type: Array<BranchWorkingHours>, required: false })
  workingHours: BranchWorkingHours[];

  @Prop({ type: String, required: false })
  reservationsInstructions: string;

  @Prop({ type: String, required: false })
  pickupInstructions: string;

  @Prop({ type: String, required: false })
  deliveryInstructions: string;

  @Prop([BranchTranslation])
  translation: BranchTranslation[];

  @Prop({ default: false, type: Boolean })
  isDeleted: boolean;

  @Prop({ type: Number, default: 0 })
  client_visits: number;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  approvedBy: string | mongoose.Types.ObjectId;

  @Prop(ReservationsSettings)
  reservationsSettings: ReservationsSettings;

  @Prop({ type: Array<ReservationsDays>, required: false })
  reservationsDays: ReservationsDays[];

  @Prop({
    type: String,
    enum: BRANCH_RESERVATION_STATUS,
    default: BRANCH_RESERVATION_STATUS.NONE_STATUS,
    required: false,
  })
  reservation_status: string;

  @Prop({ type: Boolean, default: false })
  inReview: boolean;

  @Prop({ type: Date, required: false })
  start_subscription_date: Date;

  @Prop({ required: false, type: Types.ObjectId || String, ref: 'BranchGroup' })
  branchGroup: string | BranchGroup | mongoose.Types.ObjectId;

  @Prop({ type: Boolean, default: false, required: false })
  self_delivery?: boolean;

  // @Prop(ChargeDetails)
  // initial_store_fee: ChargeDetails;

  @Prop(ChargeDetails)
  store_delivery_fee: ChargeDetails;

  @Prop({ type: Number, default: 0 })
  fees_delivery_per_kilometer: number;
}

// TODO: Floors AND TABLES
// receiving_orders: Boolean receiving_reservations:Boolean

export const BranchSchema = SchemaFactory.createForClass(Branch);

BranchSchema.index({ location: '2dsphere' });
