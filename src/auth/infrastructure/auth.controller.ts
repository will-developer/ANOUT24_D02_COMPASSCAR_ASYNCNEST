import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../application/services/auth.services';
import { SignInDto } from '../application/dtos/sign-in.dto';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Sign in user' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns JWT access token'
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post('signin')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully created'
  })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  @UseGuards(JwtAuthGuard)
  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDTO) {
    return this.authService.signUp(createUserDto);
  }
}