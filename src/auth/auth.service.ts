import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SafeUser } from 'src/generated/prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<SafeUser | undefined> {
    const user = await this.usersService.findOne({ email: username });
    if (user) {
      const isMatch = await bcrypt.compare(pass, user.passwordHash);
      if (isMatch) {
        const { passwordHash: _passwordHash, ...result } = user;
        return result;
      }
    }
  }

  async login(user: SafeUser) {
    const payload = {
      username: user.email,
      id: user.id,
      displayName: user.displayName,
    };
    const token = await this.jwtService.signAsync(payload);
    return {
      access_token: token,
    };
  }
}
