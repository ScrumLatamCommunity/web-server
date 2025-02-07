import { Status } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDate,
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

  @IsDate()
  validFrom: Date;

  @IsOptional()
  @IsDate()
  validUntil?: Date;

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
