import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CarsService } from './cars.service';
import { ValidateObjectId } from '../common/validations';
import { CreateCarDto } from './dto/create-car.dto';
import { ApiBody, ApiParam } from '@nestjs/swagger';

@Controller('cars')
export class CarsController {
  constructor(private carService: CarsService) {
  }

  //Get All Cars
  @Get()
  async getCars() {
    return this.carService.findAllCars();
  }

  //Get Car by Id
  @Get(':id')
  @ApiParam({ name: 'id', type: 'string' })
  async getCar(@Param('id', new ValidateObjectId()) id) {
    let car = await this.carService.findCarById(id);
    return car ? car : new NotFoundException();
  }

  //Get Manufacturer
  @Get(':id/manufacturer')
  @ApiParam({ name: 'id', type: 'string' })
  async getCarManufacturer(@Param('id', new ValidateObjectId()) id) {
    let car = await this.carService.findCarManufacturer(id);
    return car ? car : new NotFoundException();
  }

  //Create new Car
  @Post()
  @ApiBody({ type: CreateCarDto })
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createCarDto: CreateCarDto): Promise<any> {
    try {
      return await this.carService.createCar(createCarDto);
    } catch (err) {
      return { message: err.message };
    }

  }

  //Update Car by Id
  @Patch(':id')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({ type: CreateCarDto })
  async updateCar(@Param('id', new ValidateObjectId()) id, @Body() createCarDto: CreateCarDto) {
    try {
      const car = await this.carService.updateCar(id, createCarDto);
      return car ? car : new NotFoundException();
    } catch (err) {
      return { message: err.message };
    }
  }

  //Delete Car by Id
  @Delete(':id')
  @ApiParam({ name: 'id', type: 'string' })
  async deleteCar(@Param('id', new ValidateObjectId()) id): Promise<any> {
    try {
      const deleteCar = await this.carService.deleteCar(id);
      return deleteCar ? { deleted: true } : new NotFoundException();
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
