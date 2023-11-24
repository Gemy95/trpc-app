import { PartialType } from '@nestjs/swagger';
import { GetAllDto } from '../../common/dto/get-all.dto';

export class FindAllPaytabsTransactionsDto extends PartialType(GetAllDto) {}
