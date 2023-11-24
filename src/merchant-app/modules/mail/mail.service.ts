import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { join } from 'path';
import { Client, MerchantEmployee, Owner, ShoppexEmployee } from '../models';
import { IRejectMail } from './interfaces/reject-mail.interface';
import { ConfigurationService } from '../config/configuration.service';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService, private configService: ConfigurationService) {}

  async otpEmail(user: Partial<Owner> | Partial<Client>, otp: string) {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        from: '"Support Team" <support@shoppex.com>',
        subject: 'Welcome to Shoppex! Confirm your Email',
        template: join(__dirname, 'mail', 'templates', `otp.hbs`),
        context: {
          username: user.name,
          otp,
        },
      });
      return { success: true };
    } catch (e) {
      console.log('error in sendMail:', e);
      //return { success: false };
      throw new BadRequestException(e);
      // throw new BadRequestException(ERROR_CODES.err_failed_to_send_email);
    }
  }

  async shoppexEmployeeRegisterationEmail(shoppexEmployeeDto: Partial<ShoppexEmployee>) {
    try {
      await this.mailerService.sendMail({
        to: shoppexEmployeeDto.email,
        from: '"Support Team" <support@shoppex.com>',
        subject: 'Welcome to Shoppex!',
        template: join(__dirname, 'mail', 'templates', `shoppex-employee.hbs`),
        context: {
          countryCode: shoppexEmployeeDto.countryCode,
          mobile: shoppexEmployeeDto.mobile,
          password: shoppexEmployeeDto.password,
        },
      });
    } catch (e) {
      console.log('error in sendMail:', e);
    }
  }

  async employeeInvitation(employee: Partial<MerchantEmployee>) {
    try {
      await this.mailerService.sendMail({
        to: employee.email,
        from: '"Support Team" <support@shoppex.com>',
        subject: `Invitation to ${employee['merchantName']}!`,
        template: join(__dirname, 'mail', 'templates', `employee-invitation.hbs`),
        context: {
          userName: employee.name,
          merchantName: employee['merchantName'],
          merchantLogo: employee['merchantLogo'],
          countryCode: employee.countryCode,
          phoneNumber: employee.mobile,
          password: employee.password,
          userJob: employee.job,
          merchantWebsiteUrl: this.configService.merchantWebsiteUrl,
        },
      });
    } catch (e) {
      console.log('error in sendMail:', e);
    }
  }

  async createMerchant(user: Partial<Owner>) {
    await this.mailerService.sendMail({
      to: user.email,
      from: '"Shoppex Team" <shoppex@shoppex.com>',
      subject: 'Welcome to Shoppex!',
      template: join(__dirname, 'mail', 'templates', `create-merchant.hbs`),
      context: {
        name: user.name,
      },
    });
  }

  async rejectEmail(notes: string[], type: IRejectMail) {
    const commonFields = {
      template: join(__dirname, 'mail', 'templates', `reject.hbs`),
      from: '"Shoppex Team" <shoppex@shoppex.com>',
      subject: 'Request update!',
    };

    if (type.merchant) {
      await this.mailerService.sendMail({
        to: type.merchant.ownerId['email'],
        ...commonFields,
        context: {
          emailTitle: 'تم رفض طلب تسجيل متجركم',
          username: type.merchant.ownerId['name'],
          merchantName: type.merchant.name,
          notes,
          merchantWebsiteUrl: this.configService.merchantWebsiteUrl,
        },
      });
    }
    if (type.product) {
      await this.mailerService.sendMail({
        to: type.product.merchantId['ownerId']['email'],
        ...commonFields,
        context: {
          emailTitle: 'تم رفض طلب تسجيل الصنف',
          merchantName: type.product.merchantId['name'],
          username: type.product.merchantId['ownerId']['name'],
          productName: type.product.name,
          notes,
          merchantWebsiteUrl: this.configService.merchantWebsiteUrl,
        },
      });
    }
    if (type.branch) {
      await this.mailerService.sendMail({
        to: type.branch.ownerId['email'],
        ...commonFields,
        context: {
          emailTitle: 'تم رفض طلب تسجيل الفرع',
          merchantName: type.branch.merchantId['name'],
          username: type.branch.ownerId['name'],
          branchName: type.branch.name,
          notes,
          merchantWebsiteUrl: this.configService.merchantWebsiteUrl,
        },
      });
    }
  }

  async sendInvoiceToClient(
    user: Partial<Client>,
    attachments: [{ filename: string; content: Buffer; contentType: string }],
  ) {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        from: '"Support Team" <support@shoppex.com>',
        subject: 'Welcome to Shoppex! Order Delivered',
        template: join(__dirname, 'mail', 'templates', `send-invoice-to-client.hbs`),
        context: {
          name: user.name,
        },
        attachments: attachments,
      });
      return { success: true };
    } catch (e) {
      console.log('error in sendMail:', e);
      return { success: false };
    }
  }

  async reservationAction(user: Partial<Owner>, reservationRefId: string, reservationAction: 'accepted' | 'rejected') {
    await this.mailerService.sendMail({
      to: user.email,
      from: '"Shoppex Team" <shoppex@shoppex.com>',
      subject: 'Welcome to Shoppex!',
      template: join(__dirname, 'mail', 'templates', `reservation-action.hbs`),
      context: {
        name: user.name,
        reservationRefId: reservationRefId,
        reservationAction: reservationAction,
      },
    });
  }
}
