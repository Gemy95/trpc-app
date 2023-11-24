import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';

import { TagDto } from './tag.dto';

export const UpdateTagDto = z.object({}).merge(TagDto.partial());
