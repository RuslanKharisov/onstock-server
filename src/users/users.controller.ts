import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { Request } from 'express';
import { JwtPayload, Profile } from 'src/types/types';

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
    @Body('newPassword') newPassword: string,
    @Req() req: Request & { user: JwtPayload },
  ) {
    // to do : настроить получение текущего пароля и проверку его на совпадение перед отправкой на измененеие,
    const userId = req.user.userId;
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
