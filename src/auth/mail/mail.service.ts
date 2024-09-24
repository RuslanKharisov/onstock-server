import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const confirmLink = `${process.env.RESEND_CONFIRM_URL}?token=${token}`;

    await this.resend.emails.send({
      from: 'Промышленный склад OnStock <onboarding@resend.dev>',
      to: email,
      subject: 'Подтвердите вашу почту',
      html: `<p>Нажмите <a href="${confirmLink}">здесь</a>, чтобы подтвердить почту</p>`,
    });
  }
}
