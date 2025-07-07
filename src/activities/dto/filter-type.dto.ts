import { IsEnum, IsOptional } from 'class-validator';

export enum Type {
  AGILE_SOS = 'Agile SOS',
  SCRUM_LATAM_LIVE = 'Scrum Latam Live',
  AGILE_LEARNING_LAB = 'Agile Learning Lab',
  TRACK_FORMATIVO = 'Track Formativo',
}

export class FilterTypeDto {
  @IsOptional()
  @IsEnum(Type)
  type?: Type;
}
