import { PartialType } from '@nestjs/mapped-types';
import { CreateRatingScaleDto } from './create-rating-scale.dto';

export class UpdateRatingScaleDto extends PartialType(CreateRatingScaleDto) {}
