import { Injectable } from '@nestjs/common';
import * as otplib from 'otplib';
import { UsersService } from '../users/users.service';

@Injectable()
export class TwoFactorAuthService {
  constructor(private usersService: UsersService) {}

  generateSecret() {
    return otplib.authenticator.generateSecret();
  }

  async validateToken(userId: string, token: string) {
    const user = await this.usersService.findOneById(userId);
    return otplib.authenticator.check(token, user.twoFactorConfirmationId);
  }
}
