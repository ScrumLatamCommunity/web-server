import { PartialType } from '@nestjs/swagger';
import { CreateActivityDto } from './create-activity.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Status } from './filter-status.dto';

export class UpdateActivityDto extends PartialType(CreateActivityDto) {
  @IsString()
  @IsOptional()
  @IsEnum(Status)
  status: string;
}
