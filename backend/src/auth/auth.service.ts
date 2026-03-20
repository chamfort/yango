import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(phone: string, otp: string): Promise<any> {
    const user = await this.usersService.findByPhone(phone);
    if (user && otp === '123456') { // Placeholder for real OTP verification
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { phone: user.phone, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        phone: user.phone,
        role: user.role,
        nom: user.nom,
      },
    };
  }

  async register(data: any) {
    // Check if user already exists
    const existing = await this.usersService.findByPhone(data.phone);
    if (existing) {
      throw new UnauthorizedException('User already exists');
    }
    const user = await this.usersService.create(data);
    return this.login(user);
  }
}
