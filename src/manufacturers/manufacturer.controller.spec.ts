import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { IManufacturer } from './interfaces/manufacturer.interface';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { ManufacturersService } from './manufacturers.service';
import { ManufacturersController } from './manufacturers.controller';
import { ManufacturerSchema } from './schemas/manufacturer.schema';
import { SERVER_CONFIG } from '../server.constants';

const manufacturer = { 'phone': '30992944737', 'name': 'Manufacturer', 'siret': 920848284 } as IManufacturer;
const newManufacturerDto: CreateManufacturerDto = { 'phone': '30992944737', 'name': 'newManufacturer', 'siret': 920848284 };
const newManufacturer = {
  id: '5eeb281204edc50d5c67ee22',
  ...newManufacturerDto
} as IManufacturer;
const updateManufacturerDto: CreateManufacturerDto = {
  'phone': '30992944737', 'name': 'updateManufacturer', 'siret': 984828674
};
const updateManufacturer = {
  id: '5eeb281204edc50d5c67ee22',
  ...updateManufacturerDto
} as IManufacturer;

class ManufacturersServiceMock extends ManufacturersService {
  async findAllManufacturers(): Promise<IManufacturer[]> { return [manufacturer]; };
  async getManufacturer(): Promise<IManufacturer> { return manufacturer; };
  async create(): Promise<IManufacturer> { return newManufacturer; };
  async updateManufacturer(): Promise<IManufacturer> { return updateManufacturer; };
  async deleteManufacturer(): Promise<any> { return {"deleted": true} };
}

const manufacturersProvidersMock = [
  {
    provide: 'IManufacturer',
    useValue: ManufacturersServiceMock,
  },
];

describe('Manufacturers Controller', () => {
  let manufacturersController: ManufacturersController;
  let manufacturersService: ManufacturersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManufacturersController],
      providers: [ManufacturersService, ...manufacturersProvidersMock],
      imports: [MongooseModule.forRoot(SERVER_CONFIG.db),
        MongooseModule.forFeature(
          [{ name: 'Manufacturer', schema: ManufacturerSchema }]),
      ],
    }).compile();

    manufacturersController = module.get<ManufacturersController>(ManufacturersController);
    manufacturersService = module.get<ManufacturersService>(ManufacturersService);
  });

  describe('Get all Manufacturers', () => {
    it('should return an array of manufactures', async () => {
      jest.spyOn(manufacturersService, 'findAllManufacturers').mockResolvedValue([manufacturer]);
      expect(await manufacturersController.findAllManufacturers()).toEqual([manufacturer]);
    });
  });

  describe('Get Manufacturer by Id', () => {
    it('should return manufacturer', async () => {
      jest.spyOn(manufacturersService, 'findManufacturerById').mockResolvedValue(manufacturer);
      expect(await manufacturersController.getManufacturer({ 'id': '5eeb281204edc50d5c67ee52' })).toEqual(manufacturer);
    });
  });

  describe('Create new Manufacturer', () => {
    it('should create a new manufacturer', () => {
      jest.spyOn(manufacturersService, 'createManufacturer').mockResolvedValue(newManufacturer);
      expect(manufacturersController.create(newManufacturerDto)).resolves.toEqual(newManufacturer);
    });
  });

  describe('Update Manufacturer', () => {
    it('should return updated manufacturer', () => {
      jest.spyOn(manufacturersService, 'updateManufacturer').mockResolvedValue(updateManufacturer);
      expect(manufacturersController.updateManufacturer({ id: '5eeb281204edc50d5c67ee22' }, updateManufacturerDto)).resolves.toEqual({
        id: '5eeb281204edc50d5c67ee22',
        ...updateManufacturerDto,
      });
    });
  });

  describe('Delete Manufacturer', () => {
    it('should return that it deleted a manufacturer', () => {
      jest.spyOn(manufacturersService, 'deleteManufacturer').mockResolvedValue({ deleted: true });
      expect(manufacturersController.deleteManufacturer({ id: '5eeb281204edc50d5c67ee22' })).resolves.toEqual({ deleted: true });
    });

    it('should return that it did not delete a manufacturer', () => {
      jest.spyOn(manufacturersService, 'deleteManufacturer').mockRejectedValue({ deleted: false, message:'' });
      expect(manufacturersController.deleteManufacturer({ id: '5eeb281204edc50d5c67ee22' })).resolves.toEqual({ deleted: false, message: ''});
    });
  });

  it('should be defined', () => {
    expect(manufacturersController).toBeDefined();
  });
});
