import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt.guard';
import { CurrentUser } from '../shared/decorators/current-user.decorator';
import { AuthUser } from './interfaces/auth-user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    console.log('initial login');
    const user = await this.authService.validateUser(dto.email, dto.password);
    console.log('user', user);
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@CurrentUser() user: AuthUser) {
    return user;
  }

  @Post('refresh')
  async refresh(@Body() body: { userId: number; refresh_token: string }) {
    return this.authService.refresh(body.userId, body.refresh_token);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUser() user: AuthUser) {
    return this.authService.logout(user.userId);
  }
}
