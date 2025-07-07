import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { FilterStatusDto } from './dto/filter-status.dto';
import { FilterTypeDto } from './dto/filter-type.dto';
import { FilterActivitiesDto } from './dto/filter-activities.dto';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get('')
  findActivities(@Query() filterStatusDto: FilterStatusDto) {
    return this.activitiesService.findActivities(filterStatusDto);
  }

  @Get('/all')
  findAllActivities(@Query() filterActivitiesDto: FilterActivitiesDto) {
    return this.activitiesService.findAllActivities(filterActivitiesDto);
  }

  @Get('/:id')
  findOneActivity(@Param('id') id: string) {
    return this.activitiesService.findOneActivity(id);
  }

  @Post('')
  createActivity(@Body() createActivityDto: CreateActivityDto) {
    return this.activitiesService.createActivity(createActivityDto);
  }

  @Patch('/:id')
  update(
    @Param('id') id: string,
    @Body() updateActivityDto: UpdateActivityDto,
  ) {
    return this.activitiesService.updateActivity(id, updateActivityDto);
  }

  @Patch('switchStatus/:id')
  switchStatus(@Param('id') id: string) {
    return this.activitiesService.switchActivityStatus(id);
  }

  @Patch('reject/:id')
  rejectActivity(@Param('id') id: string) {
    return this.activitiesService.rejectActivity(id);
  }

  @Patch('approve/:id')
  approveActivity(@Param('id') id: string) {
    return this.activitiesService.approveActivity(id);
  }

  @Patch('revision/:id')
  revisionActivity(@Param('id') id: string) {
    return this.activitiesService.revisionActivity(id);
  }

  /**
   * Registra un usuario en una actividad
   */
  @Post('/:id/register')
  registerUserToActivity(
    @Param('id') activityId: string,
    @Body() registerActivityDto: RegisterActivityDto,
  ) {
    return this.activitiesService.registerUserToActivity(
      activityId,
      registerActivityDto,
    );
  }

  /**
   * Elimina un usuario de una actividad
   */
  @Delete('/:id/unregister')
  unregisterUserFromActivity(
    @Param('id') activityId: string,
    @Body() registerActivityDto: RegisterActivityDto,
  ) {
    return this.activitiesService.unregisterUserFromActivity(
      activityId,
      registerActivityDto,
    );
  }

  /**
   * Obtiene todas las actividades de un usuario
   */
  @Get('/user/:userId')
  getActivitiesByUser(@Param('userId') userId: string) {
    return this.activitiesService.getActivitiesByUser(userId);
  }

  /**
   * Obtiene todos los usuarios de una actividad
   */
  @Get('/:id/users')
  getUsersByActivity(@Param('id') activityId: string) {
    return this.activitiesService.getUsersByActivity(activityId);
  }
}
