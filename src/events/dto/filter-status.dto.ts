import { IsEnum, IsOptional } from 'class-validator';

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  REVISION = 'REVISION',
  DRAFT = 'DRAFT',
  REJECTED = 'REJECTED',
}

export class FilterStatusDto {
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
