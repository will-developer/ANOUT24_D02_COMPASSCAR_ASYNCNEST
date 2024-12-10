import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../application/services/auth.services';
import { SignInDto } from '../application/dtos/sign-in.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Sign in user' })
  @ApiResponse({
    status: 200,
    description: 'Returns JWT access token',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post('signin')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
