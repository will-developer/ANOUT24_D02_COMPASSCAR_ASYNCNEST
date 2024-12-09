import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../application/services/auth.services';
import { SignInDto } from '../application/dtos/sign-in.dto';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}