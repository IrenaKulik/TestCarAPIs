import { Test, TestingModule } from '@nestjs/testing';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { CarSchema } from './schemas/car.schema';
import { ManufacturerSchema } from '../manufacturers/schemas/manufacturer.schema';
import { ICar } from './interfaces/car.interface';
import { OwnerSchema } from '../owners/schemas/owner.schema';
import { CreateCarDto } from './dto/create-car.dto';
import { SERVER_CONFIG } from '../server.constants';

const car = {
  'owners': [{
    purchaseDate: new Date('2020-06-10T00:00:00.000Z'),
    name: 'Tim',
    id: '5eeb281204edc50d5c67ee52',
  }],
  'price': 20000,
  'name': 'Toyota',
  'manufacturer': {
    'phone': '82738377626',
    'name': 'Manufacturer',
    'siret': 920848284,
    'id': '5eea2b1210294f2ce8124ea9',
  },
  'firstRegistrationDate': new Date('2020-06-20T19:01:02.852Z'),
  'id': '5eea2b1210294f2ce8124ea8',
} as ICar;
const newCarDto: CreateCarDto = {
  'owners': ['5eeb281204edc50d5c67ee52'],
  'price': 20000,
  'name': 'Toyota',
  'manufacturer': '5eea2b1210294f2ce8124ea9',
  'firstRegistrationDate': new Date('2020-06-20T19:01:02.852Z'),
};
const newCar = {
  id: '5eeb281204edc50d5c67ee22',
  ...newCarDto,
} as ICar;
const updateCarDto: CreateCarDto = {
  'owners': ['5eeb281204edc50d5c67ee52'],
  'price': 53452,
  'name': 'Toyota',
  'manufacturer': '5eea2b1210294f2ce8124ea9',
  'firstRegistrationDate': new Date('2020-06-20T19:01:02.852Z'),
};
const updateCar = {
  id: '5eeb281204edc50d5c67ee22',
  ...updateCarDto,
} as ICar;
const carManufacturer ={
    'phone': '82738377626',
    'name': 'Manufacturer',
    'siret': 920848284,
    'id': '5eea2b1210294f2ce8124ea9',
  };

class CarModel {
  static find = jest.fn().mockImplementationOnce(() => ({
    populate: jest.fn().mockImplementationOnce(() => ({
      populate: jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValueOnce([car]),
      })),
    })),
  }));
  static findById = jest.fn().mockImplementationOnce(() => ({
    populate: jest.fn().mockImplementationOnce(() => ({
      populate: jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValueOnce(car),
      })),
    })),
  }));
   static exec = jest.disableAutomock();
  static findByIdAndUpdate = jest.fn().mockImplementationOnce(() => ({
    exec: jest.fn().mockResolvedValueOnce(updateCar),
  }));
  static findByIdAndDelete = jest.fn().mockImplementationOnce(() => ({
    exec: jest.fn().mockResolvedValueOnce({ deleted: true }),
  }));
  static findOne =jest.fn().mockImplementationOnce(() => ({
      populate: jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValueOnce(car)}))
  }));
  save = jest.fn().mockResolvedValue(newCar);

  constructor(private car) {
  }
}

describe('Cars Service', () => {
  let carsService: CarsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CarsController],
      providers: [CarsService,
        {
          provide: getModelToken('Car'),
          useValue: CarModel,
        }],
      imports: [MongooseModule.forRoot(SERVER_CONFIG.db),
        MongooseModule.forFeature([{ name: 'Car', schema: CarSchema },
          { name: 'Owners', schema: OwnerSchema },
          { name: 'Manufacturer', schema: ManufacturerSchema },
        ]),
      ],
    }).compile();

    carsService = moduleRef.get<CarsService>(CarsService);
  });

  describe('Get all Cars', () => {
    it('should return an array of cars', async () => {
      expect(await carsService.findAllCars()).toEqual([car]);
    });
  });

  describe('Get Car by Id', () => {
    it('should return car', async () => {
      expect(await carsService.findCarById('5eea2b1210294f2ce8124ea8')).toEqual(car);
    });
  });

  describe('Get Manufacturer', () => {
    it('should return car manufacturer', async () => {
      expect(await carsService.findCarManufacturer('5eea2b1210294f2ce8124ea8')).toEqual(carManufacturer);
    });
  });

  describe('Create new Car', () => {
    it('should return create car', async () => {
      expect(await carsService.createCar(newCarDto)).toEqual(newCar);
    });
  });

  describe('Update Car by Id', () => {
    it('should return updated car', async () => {
      expect(await carsService.updateCar('5eea2b1210294f2ce8124ea8', updateCarDto)).toEqual(updateCar);
    });
  });

  describe('Delete Car by Id', () => {
    it('should return status', async () => {
      expect(await carsService.deleteCar('5eea2b1210294f2ce8124ea8')).toEqual({ deleted: true });
    });
  });

  it('should be defined', () => {
    expect(carsService).toBeDefined();
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});



