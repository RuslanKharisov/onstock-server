import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { Request } from 'express';
import { JwtPayload, Profile } from 'src/types/types';
import * as bcrypt from 'bcryptjs';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Patch()
  async updateUser(
    @Body() values: Partial<Profile>,
    @Req() req: Request & { user: JwtPayload },
  ) {
    const userId = req.user.userId;
    return await this.usersService.updateUser(values, userId);
  }

  @Patch('/update-password')
  async updatePassword(
    @Body() values: { oldPassword: string; newPassword: string },
    @Req() req: Request & { user: JwtPayload },
  ) {
    const userId = req.user.userId;
    const { newPassword, oldPassword } = values;
    const user = await this.usersService.findOneById(userId);

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return { message: 'Старый пароль указан не верно' };
    }
    const result = await this.usersService.updateUserPassword(
      userId,
      newPassword,
    );
    if (result.success) {
      return { message: result.success };
    } else {
      return { message: result.error };
    }
  }
}
