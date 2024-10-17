import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtTokenService } from '../jwt/jwt.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class SessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtTokenService: JwtTokenService,
    private jwtService: JwtService,
  ) {}

  async createSession(user: User) {
    const payload = { sub: user.id, username: user.name };

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.image,
        role: user.role,
      },
      backendTokens: {
        accessToken: await this.jwtService.signAsync(payload, {
          expiresIn: '1h',
          secret: process.env.JWT_SECRET,
        }),
        refreshToken: await this.jwtService.signAsync(payload, {
          expiresIn: '7d',
          secret: process.env.JWT_REFRESH_SECRET,
        }),
      },
    };
  }

  async refreshSession(user: any) {
    const payload = { sub: user.sub, name: user.username };
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
        secret: process.env.JWT_SECRET,
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_SECRET,
      }),
    };
  }

  async findSessionByToken(token: string) {
    return this.prisma.session.findUnique({
      where: { accessToken: token },
    });
  }

  // async findSessionByUserId(userId: string) {
  //   return this.prisma.session.findFirst({
  //     where: {
  //       userId: userId,
  //       expires: {
  //         gte: new Date(), // Находим сессию, срок действия которой еще не истек
  //       },
  //     },
  //   });
  // }

  async deleteSession(token: string) {
    return this.prisma.session.delete({
      where: { accessToken: token },
    });
  }
}
