import { Module } from '@nestjs/common';

import { AttachmentsController } from './attachments.controller';
import { AttachmentsResolver } from './attachments.resolver';
import { AttachmentsService } from './attachments.service';

@Module({
  controllers: [AttachmentsController],
  providers: [AttachmentsService, AttachmentsResolver],
  exports: [AttachmentsService],
})
export class AttachmentsModule {}
