import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  constructor(private readonly _mailService: MailerService) {}

  async sendVerficationOtp(email: string, otp: string): Promise<void> {
    try {
      await this._mailService.sendMail({
        to: email,
        subject: 'Your Account Activation Code',
        template: './otp',
        context: { confirmEmailOTP: otp },
      });
    } catch (error: any) {
      this.logger.error(
        `Faild to send verification OTP to ${email}:${error.message}`,
      );
    }
  }
}
