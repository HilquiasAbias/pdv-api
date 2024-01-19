import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const user: CreateUserDto = {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
      role: 'employee',
    };

    const result = await service.create(user);

    expect(result).toBeUndefined();
  });
});
