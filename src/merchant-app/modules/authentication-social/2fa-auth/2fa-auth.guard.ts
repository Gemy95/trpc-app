import { AuthGuard } from '@nestjs/passport';

export class TFAAuthGuard extends AuthGuard('jwt-2fa') {}
