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
      html: `<h2>Перейдите на <a href="${resetLink}">страницу</a> установки нового пароля.</h2>`,
    });
  }

  async sendTwoFactorTokenEmail(email: string, token: string): Promise<void> {
    await this.resend.emails.send({
      from: 'Промышленный склад OnStock <onboarding@resend.dev>',
      to: email,
      subject: 'Код для входа',
      html: `<p>Код авторизации: <h2>${token}</a></p>`,
    });
  }
}
