import { Status } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsEnum,
} from 'class-validator';

export class CreateSponsorsPostDto {
  @IsUUID()
  @IsNotEmpty()
  sponsorId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  validFrom: string;

  @IsOptional()
  @IsString()
  validUntil?: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  link: string;

  @IsString()
  @IsNotEmpty()
  imageWeb: string;

  @IsString()
  @IsNotEmpty()
  imageMobile: string;

  @IsEnum(Status)
  status: Status;
}
