import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body: { phone: string; otp: string }) {
    const user = await this.authService.validateUser(body.phone, body.otp);
    if (!user) {
      throw new UnauthorizedException('Invalid OTP');
    }
    return this.authService.login(user);
  }
}
