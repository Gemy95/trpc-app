import { PartialType } from '@nestjs/mapped-types';

import { VerifyForgetPasswordClientDto } from './verify-forget-password-client';

export class RequestChangeEmailClientVerifyDto extends PartialType(VerifyForgetPasswordClientDto) {}
