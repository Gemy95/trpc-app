import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const UpdateSerial = z.object({
  id: z.string(),
  newSerialNumber: z.number().optional().nullish(),
});

export const ReorderSerialNumberDto = z.object({
  serials: z.array(UpdateSerial),
});
