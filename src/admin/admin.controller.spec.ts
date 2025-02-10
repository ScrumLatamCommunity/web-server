import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Role } from '@prisma/client';

describe('AdminController', () => {
  let controller: AdminController;
  let service: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: {
            assignRole: jest.fn(),
            updateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('assignRole', () => {
    it('should call assignRole with correct parameters', async () => {
      const userId = '1';
      const role = Role.ADMIN;
      jest
        .spyOn(service, 'assignRole')
        .mockResolvedValue({ id: userId, role } as any);

      await controller.assignRole(userId, { role });
      expect(service.assignRole).toHaveBeenCalledWith(userId, role);
    });
  });
});
