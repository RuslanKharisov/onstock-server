import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
// import { JwtService } from '@nestjs/jwt';
// import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    // private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    console.log('🚀 ~ AuthService ~ validateUser ~ email:', email);

    const user = await this.usersService.findOneByEmail(email);
    console.log('🚀 ~ user from db:', user);
    // if (user && user.password === pass) {
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // async validateUser(email: string, password: string): Promise<any> {
  //   const user = await this.usersService.findOneByEmail(email);
  //   if (user && user.password === password) {
  //     if (!user || !user.password) return null;
  //     const passwordsMatch = await bcrypt.compare(password, user.password);
  //     if (passwordsMatch) return user;
  //   }
  //   return null;
  // }

  async login(user: any) {
    const payload = { username: user.email, sub: user.id };
    return {
      payload,
      // access_token: this.jwtService.sign(payload),
    };
  }
}
