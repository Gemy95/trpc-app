import { z } from 'zod';

import { ERROR_CODES } from '../../../../libs/utils/src';
import { DAYS } from '../../common/constants/branch.constants';
import { ChargesDto } from '../../order/dto/create-charges.dto';

export const Duration = z.object({
  startAt: z.string().regex(/^(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)$/, {
    message: ERROR_CODES.err_wrong_time_format,
  }),
  endAt: z.string().regex(/^(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)$/, {
    message: ERROR_CODES.err_wrong_time_format,
  }),
});

export const WorkingHour = z.object({
  day: z.nativeEnum(DAYS),
  durations: z.array(Duration),
});

export const ReservationHours = z.object({
  startAt: z.string().regex(/^(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)$/, {
    message: ERROR_CODES.err_wrong_time_format,
  }),
  endAt: z.string().regex(/^(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)$/, {
    message: ERROR_CODES.err_wrong_time_format,
  }),
  disabled: z.boolean().optional().default(false),
  capacity: z.number().optional(),
  avgClientLifeTime: z.number().optional(),
  capacityPerAverageClientTime: z.number().optional(),
});

export const ReservationTranslation = z.object({
  _lang: z.string(),
  name: z.string(),
  content: z.string(),
});

export const DayInstructions = z.object({
  content: z.string(),
  translation: z.array(ReservationTranslation),
});

export const BranchInstructions = z.object({
  content: z.string(),
  translation: z.array(ReservationTranslation),
});

export const CancelPolicyInstructions = z.object({
  content: z.string(),
  translation: z.array(ReservationTranslation),
});

export const ClientsInstructions = z.object({
  content: z.string(),
  translation: z.array(ReservationTranslation),
});

export const Feature = z.object({
  icon: z.string(),
  content: z.string(),
  translation: z.array(ReservationTranslation),
});

export const ReservationsDays = z.object({
  day: z.nativeEnum(DAYS),
  workingHours: z.array(ReservationHours),
  available: z.boolean().optional().default(false),
  disabled: z.boolean().optional().default(false),
  instructions: z.array(DayInstructions).optional(),
});

export const ReservationsSettings = z.object({
  enabled: z.boolean(),
  isEnabledWaitingList: z.boolean(),
  waitingListCapacity: z.number(),
  initialPrice: z.number(),
  averageReservationPeriod: z.number(),
  separationTimeBetweenEachReservation: z.number(),
  clientsInstructions: z.array(ClientsInstructions),
  branchInstructions: z.array(BranchInstructions),
  features: z.array(Feature),
  cancelPolicyInstructions: z.array(CancelPolicyInstructions),
  enableSharingReservation: z.boolean(),
  enableReservationForStore: z.boolean(),
  enableReservationForMobileClients: z.boolean(),
});

export const CreateBranchDto = z.object({
  nameArabic: z.string(),
  nameEnglish: z.string(),
  mobile: z.string(), //   @IsPhoneNumber('SA', { message: ERROR_CODES.err_mobile_must_be_valid_number })
  cityId: z.string(),
  longitude: z.number(),
  latitude: z.number(),
  longitudeDelta: z.number(),
  latitudeDelta: z.number(),
  workingHours: z.array(WorkingHour).optional(),
  reservationsInstructions: z.string().optional(),
  pickupInstructions: z.string().optional(),
  deliveryInstructions: z.string().optional(),
  products: z.string().optional(),
  branchGroup: z.string().optional(),
  self_delivery: z.boolean().optional(),
  // store_delivery_fee: ChargesDto, // as optional
  fees_delivery_per_kilometer: z.number().optional(),
  reservationsDays: z.array(ReservationsDays).optional(),
  reservationsSettings: ReservationsSettings,
});
