import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class AssignRoleDto {
  @ApiProperty({ enum: Role, description: 'Rol a asignar' })
  @IsEnum(Role, { message: 'El rol debe ser string' })
  role: Role;
}
