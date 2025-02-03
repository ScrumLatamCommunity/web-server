import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Post,
} from '@nestjs/common';
import { Roles } from '../common/roles.decorator';
import { Role } from '@prisma/client';
import { AuthGuard } from '../auth/guard/guard.guard';
import { AdminService } from './admin.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@ApiBearerAuth()
@Controller('admin')
@UseGuards(AuthGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * Endpoint para crear un nuevo usuario.
   * @param createUserDto - Datos del usuario a crear.
   */
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.adminService.createUser(createUserDto);
  }

  /**
   * Endpoint para obtener estadísticas generales de los usuarios.
   * Ejemplo: cantidad total de usuarios, usuarios por país, etc.
   */
  @Get('stats')
  async getUserStats() {
    return this.adminService.getUserStats();
  }

  /**
   * Endpoint para asignar un rol a un usuario.
   * @param id - ID del usuario al que se le va a asignar el rol.
   * @param body - Objeto que contiene el nuevo rol (e.g., `{ role: 'admin' }`).
   */
  @Patch(':id/role')
  async assignRole(@Param('id') id: string, @Body() body: { role: string }) {
    return this.adminService.assignRole(id, body.role);
  }

  /**
   * Endpoint para obtener la lista de usuarios con filtros opcionales.
   * Ejemplo: Filtrar por país o tipo de membresía.
   */
  @Get('users')
  async getUsers(@Query() query: { country?: string; membership?: string }) {
    return this.adminService.getUsers(query);
  }

  /**
   * Endpoint para actualizar los datos de un usuario específico.
   * @param id - ID del usuario a actualizar.
   * @param body - Datos a actualizar del usuario.
   */
  @Patch('users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body()
    body: Partial<{
      firstName: string;
      lastName: string;
      country: string;
      membership: string;
    }>,
  ) {
    return this.adminService.updateUser(id, body);
  }

  /**
   * Endpoint para eliminar un usuario específico.
   * @param id - ID del usuario a eliminar.
   */
  @Patch('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }
}
