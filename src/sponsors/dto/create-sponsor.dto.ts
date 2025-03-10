import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsArray,
  IsUrl,
} from 'class-validator';
import { Status } from '@prisma/client';

export class CreateSponsorDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsArray()
  @IsNotEmpty()
  specialization: string[];

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUrl()
  @IsNotEmpty()
  web: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsArray()
  @IsString({ each: true })
  socials: string[];

  @IsUrl()
  @IsNotEmpty()
  logo: string;

  @IsUrl()
  @IsNotEmpty()
  bannerWeb: string;

  @IsUrl()
  @IsNotEmpty()
  bannerMobile: string;
}
