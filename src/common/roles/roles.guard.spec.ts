import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';

describe('RolesGuard', () => {
  let reflectorMock: Reflector;

  beforeEach(() => {
    reflectorMock = {
      getAllAndOverride: jest.fn(), // Mock de la función getAllAndOverride
    } as unknown as Reflector;
  });

  it('should be defined', () => {
    const guard = new RolesGuard(reflectorMock); // Pasar el mock al constructor
    expect(guard).toBeDefined();
  });
});
