import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

describe('AdminService', () => {
  let service: AdminService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminService, PrismaService],
    }).compile();

    service = module.get<AdminService>(AdminService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('assignRole', () => {
    it('should assign a role to a user', async () => {
      const userId = '1';
      const role = Role.ADMIN;
      jest
        .spyOn(prisma.user, 'update')
        .mockResolvedValue({ id: userId, role } as any);

      const result = await service.assignRole(userId, role);
      expect(result.role).toBe(role);
    });

    it('should throw an error for invalid role', async () => {
      const userId = '1';
      const role = 'INVALID_ROLE';

      await expect(service.assignRole(userId, role)).rejects.toThrow(
        'Invalid role',
      );
    });
  });
});
