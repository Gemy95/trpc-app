import { PartialType } from '@nestjs/mapped-types';
import { z } from 'zod';

import { VerifyForgetPasswordClientDto } from './verify-forget-password-client';

// export class RequestChangeEmailClientVerifyDto extends PartialType(VerifyForgetPasswordClientDto) {}

export const RequestChangeEmailClientVerifyDto = z.object({}).merge(VerifyForgetPasswordClientDto.partial());
