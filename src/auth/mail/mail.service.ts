import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendEmailConfifirmationLink(
    email: string,
    confirmLink: string,
  ): Promise<void> {
    await this.resend.emails.send({
      from: 'Промышленный склад OnStock <onboarding@resend.dev>',
      to: email,
      subject: 'Подтвердите вашу почту',
      html: `<p>Нажмите <a href="${confirmLink}">здесь</a>, чтобы подтвердить почту</p>`,
    });
  }

  async sendResetPasswordLink(email: string, resetLink: string): Promise<void> {
    await this.resend.emails.send({
      from: 'Промышленный склад OnStock <onboarding@resend.dev>',
      to: email,
      subject: 'Сброс пароля',
      html: `<p>Нажмите <a href="${resetLink}">здесь</a>, чтобы сбросить пароль</p>`,
    });
  }
}
