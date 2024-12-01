import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userServices: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string) {
    const user = await this.userServices.findOneByEmail(email);
    console.log(user);
    if (!user) {
      throw new UnauthorizedException();
    }

    if (!bcrypt.compare(pass, user.password)) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(email: string, pass: string) {
    try {
      const hashPassword = await bcrypt.hash(pass, 10);

      const user = this.userServices.create({ email, password: hashPassword });

      if (!user) {
        throw new InternalServerErrorException();
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
