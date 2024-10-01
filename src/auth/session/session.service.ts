import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtTokenService } from '../jwt/jwt.service';

@Injectable()
export class SessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async createSession(userId: string, email: string): Promise<string> {
    const sessionToken = await this.jwtTokenService.generateSessionToken(
      userId,
      email,
    );
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // Сессия истекает через 7 дней

    await this.prisma.session.create({
      data: {
        sessionToken,
        userId,
        expires,
      },
    });
    return sessionToken;
  }

  async findSession(token: string) {
    return this.prisma.session.findUnique({
      where: { sessionToken: token },
    });
  }

  async deleteSession(token: string) {
    return this.prisma.session.delete({
      where: { sessionToken: token },
    });
  }
}
