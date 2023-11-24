import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';

import { ERROR_CODES } from '../../../../libs/utils/src';
import { DAYS } from '../../common/constants/branch.constants';
import { ChargesDto } from '../../order/dto/create-charges.dto';

export class Duration {
  // @ApiProperty()
  // @IsDate()
  // @Type(() => Date)
  // startAt: Date;

  // @ApiProperty()
  // @IsDate()
  // @Type(() => Date)
  // endAt: Date;

  @ApiProperty()
  @IsString()
  @Matches(/^(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)$/, {
    message: ERROR_CODES.err_wrong_time_format,
  })
  startAt: string;

  @ApiProperty()
  @IsString()
  @Matches(/^(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)$/, {
    message: ERROR_CODES.err_wrong_time_format,
  })
  endAt: string;
}

export class WorkingHour {
  @ApiProperty({ default: DAYS.SATURDAY, enum: DAYS })
  @IsEnum(DAYS)
  day: DAYS;

  @ApiProperty({ type: [Duration] })
  @ValidateNested({ each: true })
  @Type(() => Duration)
  durations: Duration[];
}

export class ReservationHours {
  @ApiProperty()
  @IsString()
  @Matches(/^(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)$/, {
    message: ERROR_CODES.err_wrong_time_format,
  })
  startAt: string;

  @ApiProperty()
  @IsString()
  @Matches(/^(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)$/, {
    message: ERROR_CODES.err_wrong_time_format,
  })
  endAt: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  disabled?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  capacity?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  avgClientLifeTime?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  capacityPerAverageClientTime?: number;
}

export class ReservationTranslation {
  @ApiProperty()
  @IsString()
  _lang: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  content: string;
}

export class DayInstructions {
  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({ type: [ReservationTranslation] })
  @ValidateNested({ each: true })
  @Type(() => ReservationTranslation)
  translation: ReservationTranslation[];
}

export class BranchInstructions {
  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({ type: [ReservationTranslation] })
  @ValidateNested({ each: true })
  @Type(() => ReservationTranslation)
  translation: ReservationTranslation[];
}

export class CancelPolicyInstructions {
  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({ type: [ReservationTranslation] })
  @ValidateNested({ each: true })
  @Type(() => ReservationTranslation)
  translation: ReservationTranslation[];
}

export class ClientsInstructions {
  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({ type: [ReservationTranslation] })
  @ValidateNested({ each: true })
  @Type(() => ReservationTranslation)
  translation: ReservationTranslation[];
}

export class Feature {
  @ApiProperty()
  @IsString()
  icon: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({ type: [ReservationTranslation] })
  @ValidateNested({ each: true })
  @Type(() => ReservationTranslation)
  translation: ReservationTranslation[];
}

export class ReservationsDays {
  @ApiProperty({ default: DAYS.SATURDAY, enum: DAYS })
  @IsEnum(DAYS)
  day: DAYS;

  @ApiProperty({ type: [ReservationHours] })
  @ValidateNested({ each: true })
  @Type(() => ReservationHours)
  workingHours: ReservationHours[];

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  available?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  disabled?: boolean;

  @ApiPropertyOptional({ type: [DayInstructions] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => DayInstructions)
  instructions?: DayInstructions[];
}

export class ReservationsSettings {
  @ApiProperty()
  @IsBoolean()
  enabled: boolean;

  @ApiProperty()
  @IsBoolean()
  isEnabledWaitingList: boolean;

  @ApiProperty()
  @IsNumber()
  waitingListCapacity: number;

  @ApiProperty()
  @IsNumber()
  initialPrice: number;

  @ApiProperty()
  @IsNumber()
  averageReservationPeriod: number;

  @ApiProperty()
  @IsNumber()
  separationTimeBetweenEachReservation: number;

  @ApiProperty({ type: [ClientsInstructions] })
  @ValidateNested({ each: true })
  @Type(() => ClientsInstructions)
  clientsInstructions: ClientsInstructions[];

  @ApiProperty({ type: [BranchInstructions] })
  @ValidateNested({ each: true })
  @Type(() => BranchInstructions)
  branchInstructions: BranchInstructions[];

  @ApiProperty({ type: [Feature] })
  @ValidateNested({ each: true })
  @Type(() => Feature)
  features: Feature[];

  @ApiProperty({ type: [CancelPolicyInstructions] })
  @ValidateNested({ each: true })
  @Type(() => CancelPolicyInstructions)
  cancelPolicyInstructions: CancelPolicyInstructions[];

  @ApiProperty()
  @IsBoolean()
  enableSharingReservation: boolean;

  @ApiProperty()
  @IsBoolean()
  enableReservationForStore: boolean;

  @ApiProperty()
  @IsBoolean()
  enableReservationForMobileClients: boolean;
}

export class CreateBranchDto {
  @ApiProperty()
  @IsString()
  @Length(1)
  nameArabic: string;

  @ApiProperty()
  @IsString()
  @Length(1)
  nameEnglish: string;

  @ApiProperty()
  // @IsPhoneNumber('SA', { each: true })
  @IsPhoneNumber('SA', { message: ERROR_CODES.err_mobile_must_be_valid_number })
  mobile: string;

  @ApiProperty()
  @IsMongoId()
  @IsString()
  cityId: string;

  @ApiProperty()
  @IsNumber()
  longitude: number;

  @ApiProperty()
  @IsNumber()
  latitude: number;

  @ApiProperty()
  @IsNumber()
  longitudeDelta: number;

  @ApiProperty()
  @IsNumber()
  latitudeDelta: number;

  @ApiPropertyOptional({ type: [WorkingHour] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => WorkingHour)
  workingHours?: WorkingHour[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(1)
  reservationsInstructions?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(1)
  pickupInstructions?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(1)
  deliveryInstructions?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ each: true })
  products?: string;

  @ApiProperty()
  @IsOptional()
  @IsMongoId()
  @IsString()
  branchGroup?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  self_delivery?: boolean;

  // @ApiPropertyOptional({ type: ChargesDto })
  // @IsOptional()
  // @ValidateNested({ each: true })
  // @Type(() => ChargesDto)
  // initial_store_fee?: ChargesDto;

  @ApiPropertyOptional({ type: ChargesDto })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ChargesDto)
  store_delivery_fee?: ChargesDto;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  fees_delivery_per_kilometer?: number;

  @ApiPropertyOptional({ type: [ReservationsDays] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ReservationsDays)
  reservationsDays?: ReservationsDays[];

  @ApiPropertyOptional({ type: ReservationsSettings })
  @IsOptional()
  reservationsSettings: ReservationsSettings;
}
