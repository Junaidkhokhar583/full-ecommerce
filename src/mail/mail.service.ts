import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

  sendOtpEmail(email: string, name: string, otp: number) {
    return this.mailerService.sendMail({
      to:email,
      subject:"Your OTP Code",
      template:'otp',
      context:{
        name,
        otp,
      },
    });
  }

   sendWelcomeEmail(email: string, name: string) {
    return this.mailerService.sendMail({
      to:email,
      subject:"Welcome",
      template:'welcome',
      context:{
        name,
      },
    });
  }

  async sendOrderStatus(email: string, name: string,status:string) {
    const template = status=="CONFIRMED"?"orderConfirmed":"orderCancelled"
    return this.mailerService.sendMail({
      to:email,
      subject:"Order Status",
      template:template,
      context:{
        customerName:name,
      },
    });
  }
}
