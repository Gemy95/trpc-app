import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { CLIENT_ADDRESS_HOME_TYPE, CLIENT_ADDRESS_TYPE } from '../../common/constants/client.constants';

export class CreateAddressDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  name: string;

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

  @ApiPropertyOptional({ default: CLIENT_ADDRESS_HOME_TYPE, enum: CLIENT_ADDRESS_TYPE })
  @IsNotEmpty()
  @IsEnum(CLIENT_ADDRESS_TYPE)
  type: CLIENT_ADDRESS_TYPE;

  @ApiPropertyOptional({ type: String })
  @IsNotEmpty()
  @IsString()
  street: string;

  @ApiProperty()
  @IsOptional()
  @IsMongoId()
  city?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  floor?: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  note?: string;

  readonly client: string;
}
