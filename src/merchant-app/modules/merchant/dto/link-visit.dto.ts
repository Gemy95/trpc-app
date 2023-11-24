import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { LINK_VISIT } from '../../common/constants/link-visit.constant';

export class LinkVisitDto {
  @ApiProperty()
  @IsEnum(LINK_VISIT)
  link: string;
}
