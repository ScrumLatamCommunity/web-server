import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsArray,
  IsUrl,
  IsNumber,
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
  @IsNotEmpty()
  specialization: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUrl()
  @IsNotEmpty()
  web: string;

  @IsNumber()
  @IsNotEmpty()
  phone: number;

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
