import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { SEND_EMAIL_PROCESSOR } from '../common/constants/queue.constants';

@Processor('Owner')
export class OwnerProcessor {
  constructor() {}

  @Process(SEND_EMAIL_PROCESSOR)
  async handleCreateEmail(job: Job) {
    console.log(job);
  }
}
