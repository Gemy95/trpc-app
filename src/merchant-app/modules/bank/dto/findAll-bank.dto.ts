import { PartialType } from '@nestjs/mapped-types';
import { GetAllDto } from '../../common/input/get-all.dto';

export class FindAllBankDto extends PartialType(GetAllDto) {}