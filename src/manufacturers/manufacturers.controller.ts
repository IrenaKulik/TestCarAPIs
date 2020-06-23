import { Body, Controller, Delete, Get, NotFoundException, Param, Post, ValidationPipe, Patch } from '@nestjs/common';
import { ManufacturersService } from './manufacturers.service';
import { ValidateObjectId } from '../common/validations';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { ApiBody, ApiParam } from '@nestjs/swagger';

@Controller('manufacturers')
export class ManufacturersController {
  constructor(private manufacturersService: ManufacturersService) { }

  //Get All Manufacturers
  @Get()
  async findAllManufacturers() {
    return this.manufacturersService.findAllManufacturers();
  }

  //Get Manufacturer by Id
  @Get(':id')
  @ApiParam({ name: 'id', type: 'string' })
  async getManufacturer(@Param('id', new ValidateObjectId()) id) {
    const manufacturer = await this.manufacturersService.findManufacturerById(id);
    return manufacturer ? manufacturer : new NotFoundException();
  }

  //Create new Manufacturer
  @Post()
  @ApiBody({ type: CreateManufacturerDto })
  async create(@Body(new ValidationPipe()) createManufacturerDto: CreateManufacturerDto) {
    try {
      return await this.manufacturersService.createManufacturer(createManufacturerDto);
    } catch (err) {
      return { message: err.message };
    }
  }

  //Update Manufacturer by Id
  @Patch(':id')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({ type: CreateManufacturerDto })
  async updateManufacturer(@Param('id', new ValidateObjectId()) id, @Body() createManufacturerDto: CreateManufacturerDto) {
    try {
      const manufacturer = await this.manufacturersService.updateManufacturer(id, createManufacturerDto);
      return manufacturer ? manufacturer : new NotFoundException();
    } catch (err) {
      return { message: err.message };
    }
  }

  //Delete Manufacturer by Id
  @Delete(':id')
  @ApiParam({ name: 'id', type: 'string' })
  async deleteManufacturer(@Param('id', new ValidateObjectId()) id) {
    try {
      const deleteManufacturer = await this.manufacturersService.deleteManufacturer(id);
      return deleteManufacturer ? { deleted: true } : new NotFoundException();
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
