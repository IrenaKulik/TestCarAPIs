import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { ManufacturersService } from './manufacturers.service';
import { ManufacturersController } from './manufacturers.controller';
import { ManufacturerSchema } from './schemas/manufacturer.schema';
import { IManufacturer } from './interfaces/manufacturer.interface';
import { SERVER_CONFIG } from '../server.constants';

const manufacturer = { 'phone': '30992944737', 'name': 'Manufacturer', 'siret': 920848284 } as IManufacturer;
const newManufacturerDto: CreateManufacturerDto = {
  'phone': '30992944737',
  'name': 'newManufacturer',
  'siret': 920848284
};
const newManufacturer = {
  id: '5eeb281204edc50d5c67ee22',
  ...newManufacturerDto
} as IManufacturer;
const updateManufacturerDto: CreateManufacturerDto = {
  'phone': '30992944737',
  'name': 'updateManufacturer',
  'siret': 984828674
};
const updateManufacturer = {
  id: '5eeb281204edc50d5c67ee22',
  ...updateManufacturerDto
} as IManufacturer;

class ManufacturerModel {
  static find = jest.fn().mockImplementationOnce(() => ({
    exec: jest.fn().mockResolvedValueOnce([manufacturer]),
  }));
  static findById = jest.fn().mockImplementationOnce(() => ({
    exec: jest.fn().mockResolvedValueOnce(manufacturer),
  }));
  static exec = jest.disableAutomock();
  static findByIdAndUpdate = jest.fn().mockImplementationOnce(() => ({
    exec: jest.fn().mockResolvedValueOnce(updateManufacturer),
  }));
  static findByIdAndDelete = jest.fn().mockImplementationOnce(() => ({
    exec: jest.fn().mockResolvedValueOnce({ deleted: true }),
  }));
  save = jest.fn().mockResolvedValue(newManufacturer);

  constructor(private manufacturer) { }
}

describe('Manufacturer Service', () => {
  let manufacturerService: ManufacturersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ManufacturersController],
      providers: [ManufacturersService,
        {
          provide: getModelToken('Manufacturer'),
          useValue: ManufacturerModel,
        }],
      imports: [MongooseModule.forRoot(SERVER_CONFIG.db),
        MongooseModule.forFeature([{ name: 'Manufacturer', schema: ManufacturerSchema }]),
      ],
    }).compile();

    manufacturerService = moduleRef.get<ManufacturersService>(ManufacturersService);
  });

  describe('Get all Manufacturers', () => {
    it('should return an array of manufacturer', async () => {
      expect(await manufacturerService.findAllManufacturers()).toEqual([manufacturer]);
    });
  });

  describe('Get Manufacturer by Id', () => {
    it('should return manufacturer', async () => {
      expect(await manufacturerService.findManufacturerById('5eea2b1210294f2ce8124ea8')).toEqual(manufacturer);
    });
  });

  describe('Create new Manufacturer', () => {
    it('should return create manufacturer', async () => {
      expect(await manufacturerService.createManufacturer(newManufacturerDto)).toEqual(newManufacturer);
    });
  });

  describe('Update Manufacturer by Id', () => {
    it('should return updated manufacturer', async () => {
      expect(await manufacturerService.updateManufacturer('5eea2b1210294f2ce8124ea8', updateManufacturerDto)).toEqual(updateManufacturer);
    });
  });

  describe('Delete Manufacturer by Id', () => {
    it('should return status', async () => {
      expect(await manufacturerService.deleteManufacturer('5eea2b1210294f2ce8124ea8')).toEqual({ deleted: true });
    });
  });

  it('should be defined', () => {
    expect(manufacturerService).toBeDefined();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
