import { PartialType } from '@nestjs/swagger';
import { CreateSponsorDto } from './create-sponsor.dto';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateSponsorDto extends PartialType(CreateSponsorDto) {
  @IsOptional()
  @IsString()
  wppMessage?: string;

  @IsArray()
  @IsString({ each: true })
  country?: string[];
}
