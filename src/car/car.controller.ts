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
  ValidationPipe,
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
import { CarFiltersDto } from './dto/filters-car.dto';
import { filter } from 'rxjs';

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
  create(@Body(new ValidationPipe()) createCarDto: CreateCarDto) {
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
  async findAll(@Query() filters: CarFiltersDto) {
    const carFilters: CarFilters = {
      page: filters.page,
      limit: filters.limit,
      brand: filters.brand,
      km: filters.km,
      year: filters.year,
      dailyPrice: filters.dailyPrice,
    };

    return await this.carService.findAll(carFilters);
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
    return this.carService.findOne(parseInt(id, 10));
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
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateCarDto: UpdateCarDto,
  ) {
    return this.carService.update(parseInt(id, 10), updateCarDto);
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
    return this.carService.remove(parseInt(id, 10));
  }
}
