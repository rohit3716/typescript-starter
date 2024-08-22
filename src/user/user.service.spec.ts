import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { HttpService } from '@nestjs/axios';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { EmailService } from '../utils/email.service';
import { Model } from 'mongoose';
import { of } from 'rxjs';

// Mock implementations for dependencies
const mockUserModel = {
  findById: jest.fn(),
  save: jest.fn(),
};

const mockHttpService = {
  get: jest.fn().mockReturnValue(of({ data: { data: {} } })),
};

const mockRabbitMQService = {
  publish: jest.fn(),
};

const mockEmailService = {
  sendEmail: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: RabbitMQService,
          useValue: mockRabbitMQService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
