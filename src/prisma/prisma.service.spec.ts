import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService }, // Мокаем PrismaService
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a user by email', async () => {
    const mockUser: User = {
      id: '1',
      email: 'test@example.com',
      password: 'password',
      role: 'USER',
    };

    // Мокаем поведение метода prisma.user.findUnique
    mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

    const result = await service.findOneByEmail('test@example.com');
    expect(result).toEqual(mockUser);
    expect(prismaService.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
  });

  it('should return null if no user is found by email', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue(null);

    const result = await service.findOneByEmail('unknown@example.com');
    expect(result).toBeNull();
  });
});
