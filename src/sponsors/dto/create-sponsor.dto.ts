import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsArray,
  IsUrl,
  ValidateNested,
  ArrayMaxSize,
  ArrayMinSize,
} from 'class-validator';
import { Status } from '@prisma/client';
import { CertificateDto } from './certificate.dto';
import { Type } from 'class-transformer';
import { Optional } from '@nestjs/common';

export class SponsorDescriptionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

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

  @IsArray()
  @IsNotEmpty()
  specialization: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @Type(() => SponsorDescriptionDto)
  descriptions: SponsorDescriptionDto[];

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CertificateDto)
  @Optional()
  certificatesSponsor: CertificateDto[];
}
