import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Post,
  Delete,
} from '@nestjs/common';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role, User, Status } from '@prisma/client';
import { AuthGuard } from '../auth/guard/guard.guard';
import { AdminService } from './admin.service';
import { ApiBearerAuth, ApiQuery, ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AssignRoleDto } from './dto/asing_role.dto';

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
  async getUserStats(@Query('filters') filters: string) {
    const filterArray = filters?.split(',') as (
      | 'membership'
      | 'role'
      | 'country'
    )[];
    return this.adminService.getUserStats(filterArray);
  }

  /**
   * Endpoint para asignar un rol a un usuario.
   * @param id - ID del usuario al que se le va a asignar el rol.
   * @param body - Objeto que contiene el nuevo rol (e.g., `{ role: 'admin' }`).
   */
  @Patch(':id/role')
  @ApiBody({
    description: 'Objeto con el nuevo rol',
    type: AssignRoleDto,
  })
  async assignRole(
    @Param('id') id: string,
    @Body()
    body: { role: string },
  ) {
    return this.adminService.assignRole(id, body.role);
  }

  /**
   * Endpoint para obtener la lista de usuarios con filtros opcionales.
   * Ejemplo: Filtrar por país o tipo de membresía.
   */
  @Get('users')
  @Get()
  @ApiQuery({ name: 'country', required: false, type: String })
  @ApiQuery({ name: 'membership', required: false, type: String })
  @ApiQuery({ name: 'role', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'] })
  async getUsers(
    @Query('country') country?: string,
    @Query('membership') membership?: string,
    @Query('role') role?: string,
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: 'asc' | 'desc',
  ) {
    return this.adminService.getUsers(
      { country, membership, role },
      sortBy as keyof User,
      order,
    );
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

  @Patch('sponsors/:userId/status')
  async updateSponsorStatus(
    @Param('userId') userId: string,
    @Body('status') status: Status,
  ) {
    return this.adminService.updateSponsorStatus(userId, status);
  }

  /**
   * Endpoint para eliminar un usuario específico.
   * @param id - ID del usuario a eliminar.
   */
  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }
}
