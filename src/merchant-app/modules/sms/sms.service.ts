import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import ISendSMS from './interfaces/send-sms.interface';
import { SlackService } from '../slack/slack.service';
import { ConfigurationService } from '../config/configuration.service';
@Injectable()
export class SmsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly slackService: SlackService,
    private configService: ConfigurationService,
  ) {}
  private logger = new Logger(SmsService.name);

  async sendSms(sendSMS: ISendSMS) {
    const api = process.env.SMS_API;
    const user = process.env.SMS_USER;
    const pwd = process.env.SMS_PASSWORD;
    const senderid = process.env.SMS_SENDER_ID;

    const { CountryCode, mobileno, msgtext } = sendSMS;

    const NODE_ENV = this.configService.env;

    try {
      if (NODE_ENV !== 'production') {
        await this.slackService.sendOtp(mobileno, msgtext);
        return { success: true };
      } else {
        await this.slackService.sendOtp(mobileno, msgtext); // need to remove it for production in the future
        this.httpService
          .get(api, {
            params: {
              user: user,
              senderid: 'Kayan Code', // need to read it from .env in the future
              pwd: pwd,
              CountryCode,
              mobileno,
              msgtext,
              priority: 'High',
            },
          })
          .subscribe({
            next: (res) => console.log('---RESPONSE---', res),
            error: (error) => console.error('---ERROR---', error),
            complete: () => console.info('-- COMPLETE --'),
          });
        return { success: true };
      }
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
      // throw new BadRequestException(ERROR_CODES.err_failed_to_send_sms);
    }
  }
}
