import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/types/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    console.log('🚀 ~ JwtStrategy ~ validate ~ payload:', payload);
    console.log('JwtStrategy JWT Payload:', payload);
    if (!payload || !payload.sub) {
      throw new UnauthorizedException();
    }
    return { ...payload };
  }
}
