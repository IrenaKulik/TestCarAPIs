import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { OwnerSchema } from './schemas/owner.schema';
import { IOwner } from './interfaces/owner.interface';
import { OwnersService } from './owners.service';
import { OwnersController } from './owners.controller';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { SERVER_CONFIG } from '../server.constants';

const owner = {
  purchaseDate: new Date('2020-06-10T00:00:00.000Z'),
  name: 'Tim',
  id: '6eeb281204edc50d5c67ee52',
} as IOwner;
const newOwnerDto: CreateOwnerDto = {
  name: 'Tom',
  purchaseDate: new Date('2020-06-10T00:00:00.000Z'),
};
const newOwner = {
  id: '5eeb281204edc50d5c67ee22',
  ...newOwnerDto,
} as IOwner;
const updateOwnerDto: CreateOwnerDto = {
  name: 'Jim',
  purchaseDate: new Date(),
};
const updateOwner = {
  id: '5eeb281204edc50d5c67ee22',
  ...updateOwnerDto,
} as IOwner;

class OwnersServiceMock extends OwnersService {
  async getOwners(): Promise<IOwner[]> { return []; };
  async getOwnerById(): Promise<IOwner> { return owner; };
  async create(): Promise<IOwner> { return newOwner; };
  async updateOwner(): Promise<IOwner> { return updateOwner; };
  async deleteOwner(): Promise<any> { return { deleted: true }; };
}

const ownersProvidersMock = [
  {
    provide: 'IOwner',
    useValue: OwnersServiceMock,
  }
];

describe('Owners Controller', () => {
  let ownersController: OwnersController;
  let ownersService: OwnersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OwnersController],
      providers: [OwnersService, ...ownersProvidersMock],
      imports: [MongooseModule.forRoot(SERVER_CONFIG.db),
        MongooseModule.forFeature(
          [{ name: 'Owner', schema: OwnerSchema }])
      ]
    }).compile();

    ownersController = module.get<OwnersController>(OwnersController);
    ownersService = module.get<OwnersService>(OwnersService);
  });

  describe('Get all Owners', () => {
    it('should return an array of owners', async () => {
      jest.spyOn(ownersService, 'findAllOwners').mockResolvedValue([owner]);
      expect(await ownersController.getOwners()).toEqual([owner]);
    });
  });

  describe('Get Owner by Id', () => {
    it('should return owner', async () => {
      jest.spyOn(ownersService, 'findOwnerById').mockResolvedValue(owner);
      expect(await ownersController.getOwnerById({ 'id':'5eeb281204edc50d5c67ee52' })).toEqual(owner);
    });
  });

  describe('Create new Owner', () => {
    it('should create a new owner', () => {
      jest.spyOn(ownersService, 'createOwner').mockResolvedValue(newOwner);
      expect(ownersController.createOwner(newOwnerDto)).resolves.toEqual(newOwner);
    });
  });

  describe('Update Owner', () => {
    it('should return updated owner', () => {
      jest.spyOn(ownersService, 'updateOwner').mockResolvedValue(updateOwner);
      expect(ownersController.updateOwner({ id: '5eeb281204edc50d5c67ee22' }, updateOwnerDto)).resolves.toEqual({
        id: '5eeb281204edc50d5c67ee22',
        ...updateOwnerDto,
      });
    });
  });

  describe('Delete Owner', () => {
    it('should return that it deleted a owner', () => {
      jest.spyOn(ownersService, 'deleteOwner').mockResolvedValue({ deleted: true });
      expect(ownersController.deleteOwner({ id: '5eeb281204edc50d5c67ee22' })).resolves.toEqual({ deleted: true })
    });

    it('should return that it did not delete a owner', () => {
      jest.spyOn(ownersService, 'deleteOwner').mockRejectedValue({ deleted: false, message:'' });
      expect(ownersController.deleteOwner({ id: '5eeb281204edc50d5c67ee22' })).resolves.toEqual({ deleted: false, message: ''  });
    });
  });

  it('should be defined', () => {
    expect(ownersController).toBeDefined();
  });
});
