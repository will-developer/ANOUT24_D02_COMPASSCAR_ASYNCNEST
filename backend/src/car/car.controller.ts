import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { CarFilters } from './filters/carFilters';

@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  create(@Body() createCarDto: CreateCarDto) {
    return this.carService.create(createCarDto);
  }

  @Get()
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
  findOne(@Param('id') id: string) {
    return this.carService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    return this.carService.update(+id, updateCarDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carService.remove(+id);
  }
}
