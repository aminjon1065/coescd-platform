import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt.guard';
import { CurrentUser } from '../shared/decorators/current-user.decorator';
import { AuthUser } from './interfaces/auth-user.interface';
import { Response } from 'express';
import { RequestWithCookies } from '../shared/interfaces/request-with-cookies.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    const { accessToken, refreshToken } = await this.authService.login(user);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    res.cookie('is_logged_in', 'true', {
      httpOnly: false, // нужно для middleware на фронте
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000, // 15 минут
    });

    return { access_token: accessToken };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@CurrentUser() user: AuthUser) {
    return user;
  }

  @Post('refresh')
  async refresh(@Req() req: RequestWithCookies) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) throw new UnauthorizedException('Token missing');
    return this.authService.refreshWithCookie(refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @CurrentUser() user: AuthUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie('refresh_token', { path: '/auth/refresh' });
    res.clearCookie('is_logged_in', { path: '/' });
    await this.authService.logout(user.userId);
    return { message: 'Logged out' };
  }
}
