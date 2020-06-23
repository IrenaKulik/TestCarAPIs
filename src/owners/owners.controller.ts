import { Controller, Get, Param, Post, Body, Delete, ValidationPipe, NotFoundException, Patch } from '@nestjs/common';
import { OwnersService } from './owners.service';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { ValidateObjectId } from '../common/validations';
import { ApiBody, ApiParam } from '@nestjs/swagger';

@Controller('owners')
export class OwnersController {
  constructor(private ownersService: OwnersService) { }

  //Get All Owners
  @Get()
  async getOwners() {
    return await this.ownersService.findAllOwners();
  }

  //Get Owner by Id
  @Get(':id')
  @ApiParam({ name: 'id', type: 'string' })
  async getOwnerById(@Param('id', new ValidateObjectId()) id) {
    const owner = await this.ownersService.findOwnerById(id);
    return owner ? owner : new NotFoundException();
  }

  //Create new Owner
  @Post()
  @ApiBody({ type: CreateOwnerDto })
  async createOwner(@Body(new ValidationPipe()) createOwnerDto: CreateOwnerDto) {
    try {
      return await this.ownersService.createOwner(createOwnerDto);
    } catch (err) {
      return { message: err.message };
    }
  }

  //Update Owner by Id
  @Patch(':id')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({ type: CreateOwnerDto })
  async updateOwner(@Param('id', new ValidateObjectId()) id, @Body() createOwnerDto: CreateOwnerDto) {
    try {
      const owner = await this.ownersService.updateOwner(id, createOwnerDto);
      return owner ? owner : new NotFoundException();
    } catch (err) {
      return { message: err.message };
    }
  }

  //Delete Owner by Id
  @Delete(':id')
  @ApiParam({ name: 'id', type: 'string' })
  async deleteOwner(@Param('id', new ValidateObjectId()) id) {
    try {
      const deleteCar = await this.ownersService.deleteOwner(id);
      return deleteCar ?  {deleted :  true }: new NotFoundException();
    } catch (err) {
      return {  deleted: false , message: err.message };
    }
  }
}
