import { IsEnum, IsOptional } from 'class-validator';
import { Status } from './filter-status.dto';
import { Type } from './filter-type.dto';

export class FilterActivitiesDto {
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsEnum(Type)
  type?: Type;

  @IsOptional()
  @IsEnum(Status)
  statusOrder?: Type;
}
