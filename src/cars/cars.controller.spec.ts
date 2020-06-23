import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { ICar } from './interfaces/car.interface';
import { CreateCarDto } from './dto/create-car.dto';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { CarSchema } from './schemas/car.schema';
import { IManufacturer } from '../manufacturers/interfaces/manufacturer.interface';
import { OwnerSchema } from '../owners/schemas/owner.schema';
import { ManufacturerSchema } from '../manufacturers/schemas/manufacturer.schema';
import { SERVER_CONFIG } from '../server.constants';

const car = {
  'owners': [{
    purchaseDate: new Date('2020-06-10T00:00:00.000Z'),
    name: 'Tim',
    id: '5eeb281204edc50d5c67ee52',
  }],
  'price': 20000,
  'name': 'Toyota',
  'manufacturer': { 'phone': '82738377626', 'name': 'Manufacturer', 'siret': 920848284, 'id': '5eea2b1210294f2ce8124ea9' },
  'firstRegistrationDate': new Date('2020-06-20T19:01:02.852Z'),
  'id': '5eea2b1210294f2ce8124ea8'
} as ICar;
const newCarDto: CreateCarDto = {
  'owners': ['5eeb281204edc50d5c67ee52'],
  'price': 20000,
  'name': 'Toyota',
  'manufacturer': '5eea2b1210294f2ce8124ea9',
  'firstRegistrationDate': new Date('2020-06-20T19:01:02.852Z')
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
  'firstRegistrationDate': new Date('2020-06-20T19:01:02.852Z')
};
const updateCar = {
  id: '5eeb281204edc50d5c67ee22',
  ...updateCarDto,
} as ICar;

class CarsServiceMock extends CarsService {
  async getOwners(): Promise<ICar[]> { return [car]; };
  async getOwnerById(): Promise<ICar> { return car; };
  async getCarManufacturer(): Promise<any> { return car.manufacturer; };
  async create(): Promise<ICar> { return newCar; };
  async updateCar(): Promise<ICar> { return updateCar; };
  async deleteCar(): Promise<any> { return { deleted: true }; };
}

const carsProvidersMock = [
  {
    provide: 'ICar',
    useValue: CarsServiceMock
  }
];

describe('Cars Controller', () => {
  let carsController: CarsController;
  let carsService: CarsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarsController],
      providers: [CarsService, ...carsProvidersMock],
      imports: [MongooseModule.forRoot(SERVER_CONFIG.db),
        MongooseModule.forFeature(
          [{ name: 'Car', schema: CarSchema },
          { name: 'Owners', schema: OwnerSchema },
          { name: 'Manufacturer', schema: ManufacturerSchema }
        ])
      ]
    }).compile();

    carsController = module.get<CarsController>(CarsController);
    carsService = module.get<CarsService>(CarsService);
  });

  describe('Get all Cars', () => {
    it('should return an array of cars', async () => {
      jest.spyOn(carsService, 'findAllCars').mockResolvedValue([car]);
      expect(await carsController.getCars()).toEqual([car]);
    });
  });

  describe('Get Car by Id', () => {
    it('should return car', async () => {
      jest.spyOn(carsService, 'findCarById').mockResolvedValue(car);
      expect(await carsController.getCar({ 'id':'5eea2b1210294f2ce8124ea8' })).toEqual(car);
    });
  });

  describe('Get Manufacturer', () => {
    it('should return car manufacturer', async () => {
      jest.spyOn(carsService, 'findCarManufacturer').mockResolvedValue(car.manufacturer);
      expect(await carsController.getCarManufacturer({ 'id':'5eea2b1210294f2ce8124ea8' })).toEqual(car.manufacturer);
    });
  });

  describe('Create new Car', () => {
    it('should create a new car', () => {
      jest.spyOn(carsService, 'createCar').mockResolvedValue(newCar);
      expect(carsController.create(newCarDto)).resolves.toEqual(newCar);
    });
  });

  describe('Update Car', () => {
    it('should return updated car', () => {
      jest.spyOn(carsService, 'updateCar').mockResolvedValue(updateCar);
      expect(carsController.updateCar({ id: '5eeb281204edc50d5c67ee22' }, updateCarDto)).resolves.toEqual({
        id: '5eeb281204edc50d5c67ee22',
        ...updateCarDto
      });
    });
  });

  describe('Delete Car', () => {
    it('should return that it deleted a car', () => {
      jest.spyOn(carsService, 'deleteCar').mockResolvedValue({ deleted: true });
      expect(carsController.deleteCar({ id: '5eeb281204edc50d5c67ee22' })).resolves.toEqual({ deleted: true })
    });

    it('should return that it did not delete a car', () => {
      jest.spyOn(carsService, 'deleteCar').mockRejectedValue({ deleted: false, message:'' });
      expect(carsController.deleteCar({ id: '5eeb281204edc50d5c67ee22' })).resolves.toEqual({ deleted: false, message: ''  });
    });
  });

  it('should be defined', () => {
    expect(carsController).toBeDefined();
  });
});



