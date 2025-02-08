import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SponsorRegisterDto } from './dto/sponsor.register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: LoginDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  signUp(@Body() signInDto: RegisterDto) {
    return this.authService.signUp(signInDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register/sponsor')
  signUpSponsor(@Body() sponsorRegisterDto: SponsorRegisterDto) {
    return this.authService.signUpSponsor(sponsorRegisterDto);
  }

  @HttpCode(HttpStatus.OK)
  @Put('onboarding')
  onboarding(
    @Body() { email, completed }: { email: string; completed: boolean },
  ) {
    return this.authService.onboarding(email, completed);
  }
}
