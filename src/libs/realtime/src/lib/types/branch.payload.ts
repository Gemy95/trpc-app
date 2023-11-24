export class Duration {
  startAt: Date;
  endAt: Date;
}

export class WorkingHour {
  day: string;
  durations: Duration[];
}

export class ReservationHours {
  day: string;
  timeSeparation: number;
  capacity: number;
  durations: Duration[];
}

export class BranchPayload {
  nameArabic: string;
  nameEnglish: string;
  mobile: string;
  cityId: string;
  longitude: number;
  latitude: number;
  longitudeDelta: number;
  latitudeDelta: number;
  workingHours?: WorkingHour[];
  reservationHours?: ReservationHours[];
  reservationsInstructions?: string;
  pickupInstructions?: string;
  deliveryInstructions?: string;
  products?: string;
}
