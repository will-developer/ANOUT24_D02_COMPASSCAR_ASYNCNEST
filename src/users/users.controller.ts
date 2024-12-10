import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
  Request,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDTO } from './dto/update-user.dto';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/infrastructure/guards/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  
  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'client created successfully',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'user already registered',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'internal server error',
  })
  @ApiOperation({
    summary: 'create a new user',
    description:
      'Creates a new user by providing the necessary user information in the request body. If the user is already registered, a conflict error is returned. If the input data is invalid, a bad request error is returned.',
  })
  async create(@Body(new ValidationPipe()) dto: CreateUserDTO) {
    return this.usersService.createUser(dto);
  }

  
  @Patch(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'client uptated successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'user not found' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'internal server error',
  })
  @ApiBody({
    description: 'request body to update some user data',
    required: true,
    examples: {
      allData: {
        description: 'update all user data',
        value: {
          type: UpdateUserDTO,
          name: 'John',
          email: 'joe@email.com',
          password: 'newpassword123',
        },
      },
      justTwoData: {
        description: 'update only name and email',
        value: {
          name: 'John',
          email: 'john@email.com',
        },
      },
      justOneData: {
        description: 'update only password',
        value: {
          password: 'newpassword123',
        },
      },
    },
  })
  @ApiOperation({
    summary: 'update user information by ID',
    description:
      'Uses the provided user ID to update user data based on the given request body. You can update individual fields or all fields of the user.',
  })
  async update(
    @Param('id') id: number,
    @Body(new ValidationPipe()) dto: UpdateUserDTO,
  ) {
    return this.usersService.updateUser(+id, dto);
  }

  
  @Get()
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'number of items per page (default: 10)',
  })
  @ApiQuery({
    name: 'name',
    type: String,
    required: false,
    description: 'part of the user name for filtering',
  })
  @ApiQuery({
    name: 'email',
    type: String,
    required: false,
    description: 'part of the user email for filtering',
  })
  @ApiQuery({
    name: 'status',
    type: Boolean,
    required: false,
    description: 'filter by active or inactive status',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'users retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'internal server error',
  })
  @ApiOperation({
    summary: 'retrieve a paginated list of users',
    description:
      'Fetches a paginated list of users based on optional query parameters like page, limit, name, email, and status. Returns user data if found or an error if not.',
  })
  async findAll(@Query() query) {
    return this.usersService.findAll(query, query.page, query.limit);
  }

  
  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'user found successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'user not found' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'internal server error',
  })
  @ApiOperation({
    summary: 'retrieve user by ID',
    description:
      'Fetches the details of a user based on the provided unique user ID. If the user is found, their data is returned. If no user is found, a 404 error is returned. In case of an internal server error, a 500 error is returned.',
  })
  async findById(@Param('id') id: number) {
    return this.usersService.findById(+id);
  }

  
  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'user deactivated successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'user not found' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'internal server error',
  })
  @ApiOperation({
    summary: 'deactivate a user by ID',
    description:
      'Deactivates the user identified by the provided ID. The user will not be deleted, but marked as inactive. If the user is not found, a 404 error will be returned.',
  })
  async delete(@Param('id') id: number) {
    return this.usersService.inativateUser(+id);
  }

  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns the user profile'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing token'
  })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
