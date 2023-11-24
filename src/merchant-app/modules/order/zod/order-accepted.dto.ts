import { z } from 'zod';

export const DashboardOrderAcceptedDto = z.object({
  estimatedPreparationTime: z.date().optional().nullish(),
  driverId: z.string().optional().nullish(),
});
