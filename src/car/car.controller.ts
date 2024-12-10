import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { CarFilters } from './filters/carFilters';
import { JwtAuthGuard } from 'src/auth/infrastructure/guards/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Cars')
@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new car entry' })
  @ApiResponse({
    status: 201,
    description: 'Car successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, validation error.',
  })
  @ApiForbiddenResponse({
    description: 'Access denied.',
  })
  create(@Body() createCarDto: CreateCarDto) {
    return this.carService.create(createCarDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of cars' })
  @ApiResponse({
    status: 200,
    description: 'List of cars successfully retrieved.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters.',
  })
  @ApiForbiddenResponse({
    description: 'Access denied.',
  })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('brand') brand?: string,
    @Query('km') km?: number,
    @Query('year') year?: number,
    @Query('status') status?: boolean,
    @Query('dailyPrice') dailyPrice?: number,
  ) {
    if (isNaN(page)) {
      page = 1;
    }

    if (isNaN(limit)) {
      limit = 10;
    }

    const filters: CarFilters = {
      page,
      limit,
      brand,
      km,
      year,
      status,
      dailyPrice,
    };

    return await this.carService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a car by its ID' })
  @ApiResponse({
    status: 200,
    description: 'Car successfully retrieved.',
  })
  @ApiResponse({
    status: 404,
    description: 'Car not found.',
  })
  @ApiForbiddenResponse({
    description: 'Access denied.',
  })
  findOne(@Param('id') id: string) {
    return this.carService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a car by its ID' })
  @ApiResponse({
    status: 200,
    description: 'Car successfully updated.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input, failed validation.',
  })
  @ApiResponse({
    status: 404,
    description: 'Car not found.',
  })
  @ApiForbiddenResponse({
    description: 'Access denied.',
  })
  update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    return this.carService.update(+id, updateCarDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a car by its ID' })
  @ApiResponse({
    status: 200,
    description: 'Car successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Car not found.',
  })
  @ApiForbiddenResponse({
    description: 'Access denied.',
  })
  remove(@Param('id') id: string) {
    return this.carService.remove(+id);
  }
}
