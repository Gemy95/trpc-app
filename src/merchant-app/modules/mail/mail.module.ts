import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { ConfigurationModule } from '../config/configuration.module';

@Module({
  imports: [
    ConfigurationModule,
    MailerModule.forRoot({
      // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
      // or
      transport: {
        host: 'smtp.eu.mailgun.org',
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAIL_SERVICE_USER,
          pass: process.env.MAIL_SERVICE_PASSWORD,
        },
      },
      defaults: {
        from: '"No Reply" <noreply@shoppex.next>',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService], // 👈 export for DI
})
export class MailModule {}
