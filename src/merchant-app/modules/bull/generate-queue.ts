import { BullAdapter } from '@bull-board/api/bullAdapter';
import { Injectable } from '@nestjs/common';
import Bull from 'bull';

import { AddQueue } from '../../../main';
import { ConfigurationService } from '../config/configuration.service';

// import { AddQueue } from '../main';

// export enum JobStatus {
//   waiting = 'waiting',
//   delayed = 'delayed',
//   active = 'active',
//   completed = 'completed',
//   failed = 'failed',
// }

@Injectable()
export class QueuesManagerService {
  constructor(private configService: ConfigurationService) {}

  async generateQueue(name: string, data: any): Promise<Bull.Queue> {
    const redisOptions = {
      host: this.configService.redis.REDIS_HOST,
    };
    const queue: Bull.Queue = new Bull(name, { redis: redisOptions });
    AddQueue(new BullAdapter(new Bull(name, { redis: redisOptions })));
    await queue.add({ data }, { delay: 3600 * 1000 });
    this.processQueue(queue);
    return queue;
  }

  async getAllJobsFromQueue(name: string, status: Array<Bull.JobStatus>): Promise<Bull.Job[]> {
    const jobStatuses: Bull.JobStatus[] = status;
    const queue: Bull.Queue = new Bull(name);
    const jobs: Bull.Job[] = await queue.getJobs(jobStatuses);
    return jobs;
  }

  async processQueue(queue) {
    queue.process(function (job, done) {
      // console.log("job=", job);

      // job.data contains the custom data passed when the job was created
      // job.id contains id of this job.

      // transcode video asynchronously and report progress
      job.progress(42);

      // call done when finished
      done();

      // or give an error if error
      done(new Error('error transcoding'));

      // or pass it a result
      done(null, { framerate: 29.5 /* etc... */ });

      // If the job throws an unhandled exception it is also handled correctly
      throw new Error('some unexpected error');
    });
  }
}
