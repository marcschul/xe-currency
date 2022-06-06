import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@SkipThrottle()
@Controller('auth')
export class AuthController {
  constructor(private authSerivce: AuthService) {}

  @Post('register')
  register(@Body() dto: AuthDto) {
    return this.authSerivce.register(dto);
  }

  @Post('login')
  login(@Body() dto: AuthDto) {
    return this.authSerivce.login(dto);
  }
}
