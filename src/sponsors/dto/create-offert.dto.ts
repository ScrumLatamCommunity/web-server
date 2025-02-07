import { Status } from '@prisma/client';
import { IsString, IsNotEmpty, IsDate, IsUUID, IsEnum } from 'class-validator';

export class CreateSponsorsOffertDto {
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

  @IsDate()
  validUntil: Date;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  link: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsEnum(Status)
  status: Status;
}
