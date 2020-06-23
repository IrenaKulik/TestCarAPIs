import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { OwnerSchema } from './schemas/owner.schema';
import { OwnersService } from './owners.service';
import { OwnersController } from './owners.controller';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { IOwner } from './interfaces/owner.interface';
import { SERVER_CONFIG } from '../server.constants';

const newOwnerDto: CreateOwnerDto = {
  name: 'Tom',
  purchaseDate: new Date('2020-06-10T00:00:00.000Z'),
};
const newOwner = {
  id: '5eeb281204edc50d5c67ee22',
  ...newOwnerDto,
} as IOwner;
const result = {
  'purchaseDate': '2020-06-10T00:00:00.000Z',
  'name': 'Tim',
  'id': '5eeb281204edc50d5c67ee52',
};
const updateOwnerDto: CreateOwnerDto = {
  name: 'Jim',
  purchaseDate: new Date(),
};
const updateOwner = {
  id: '5eeb281204edc50d5c67ee22',
  ...updateOwnerDto,
} as IOwner;

class OwnerModel {
  static find = jest.fn().mockImplementationOnce(() => ({
    exec: jest.fn().mockResolvedValueOnce([result]),
  }));
  static findById = jest.fn().mockImplementationOnce(() => ({
    exec: jest.fn().mockResolvedValueOnce(result),
  }));
  static exec = jest.disableAutomock();
  static findByIdAndUpdate = jest.fn().mockImplementationOnce(() => ({
    exec: jest.fn().mockResolvedValueOnce(updateOwner),
  }));
  static findByIdAndDelete = jest.fn().mockImplementationOnce(() => ({
    exec: jest.fn().mockResolvedValueOnce({ deleted: true }),
  }));
  save = jest.fn().mockResolvedValue(newOwner);

  constructor(private owner) {
  }
}

describe('Owner Service', () => {
  let ownerService: OwnersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [OwnersController],
      providers: [OwnersService,
        {
          provide: getModelToken('Owner'),
          useValue: OwnerModel,
        }],
      imports: [MongooseModule.forRoot(SERVER_CONFIG.db),
        MongooseModule.forFeature([{ name: 'Owner', schema: OwnerSchema }]),
      ],
    }).compile();

    ownerService = moduleRef.get<OwnersService>(OwnersService);
  });

  describe('Get all Owners', () => {
    it('should return an array of owners', async () => {
      expect(await ownerService.findAllOwners()).toEqual([result]);
    });
  });

  describe('Get Owner by Id', () => {
    it('should return owner', async () => {
      expect(await ownerService.findOwnerById('5eea2b1210294f2ce8124ea8')).toEqual(result);
    });
  });

  describe('Create new Owner', () => {
    it('should return create owner', async () => {
      expect(await ownerService.createOwner(newOwnerDto)).toEqual(newOwner);
    });
  });

  describe('Update Owner by Id', () => {
    it('should return updated owner', async () => {
      expect(await ownerService.updateOwner('5eea2b1210294f2ce8124ea8', updateOwnerDto)).toEqual(updateOwner);
    });
  });

  describe('Delete Owner by Id', () => {
    it('should return status', async () => {
      expect(await ownerService.deleteOwner('5eea2b1210294f2ce8124ea8')).toEqual({ deleted: true });
    });
  });

  it('should be defined', () => {
    expect(ownerService).toBeDefined();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});


