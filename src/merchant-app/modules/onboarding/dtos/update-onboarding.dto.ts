import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Max, Min, ValidateNested } from 'class-validator';
import { Translation } from '../../common/dto/Translation.dto';
import { DeviceTypeEnum } from '../enums/device-type.enum';
import { UserTypeEnum } from '../enums/user-type.enum';
import { OnBoardingDto } from './onboarding.dto';

export class UpdateOnBoardingDto extends PartialType(OnBoardingDto) {}
