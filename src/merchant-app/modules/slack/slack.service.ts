import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebClient } from '@slack/web-api';
import { ConfigurationService } from '../config/configuration.service';

interface SendMessageArgs {
  channel: string;
  text: string;
}

@Injectable()
export class SlackService {
  private readonly web: WebClient;

  constructor(private readonly configService: ConfigService, private configurationService: ConfigurationService) {
    this.web = new WebClient(this.configService.get('slack.token'));
  }

  async sendEmailToken(email, token) {
    const channel = this.configService.get('slack.channels.registration');
    const text = `Token: ${token} code has been sent to ${email}`;
    return this.sendMessage({ channel, text });
  }

  async sendOtp(mobile: string, otp) {
    const NODE_ENV = this.configurationService.env;
    const channel = this.configService.get('slack.channels.registration');
    const text = `A new account with mobile ${mobile} has registered on ${NODE_ENV}. OTP: ${otp}`;

    return this.sendMessage({
      channel,
      text,
    });
  }

  async sendEmailOtp(email: string, otp) {
    const channel = this.configService.get('slack.channels.registration');
    const text = `A new account with email ${email} has registered. OTP: ${otp}`;

    return this.sendMessage({
      channel,
      text,
    });
  }

  private async sendMessage({ channel, text }: SendMessageArgs) {
    return this.web.chat.postMessage({
      channel,
      text,
    });
  }
}
