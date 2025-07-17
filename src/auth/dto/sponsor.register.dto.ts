import { Status } from '@prisma/client';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { SponsorDescriptionDto } from 'src/sponsors/dto/create-sponsor.dto';

export class SponsorRegisterDto {
  @IsNotEmpty({ message: 'The first name is required' })
  @MaxLength(100, {
    message: 'The first name must be less than 100 characters',
  })
  firstName: string;

  @IsNotEmpty({ message: 'The last name is required' })
  @MaxLength(100, { message: 'The last name must be less than 100 characters' })
  lastName: string;

  @IsNotEmpty({ message: 'The username is required' })
  @MaxLength(50, { message: 'The username must be less than 50 characters' })
  username: string;

  @IsEmail({}, { message: 'The email is not valid' })
  @IsNotEmpty({ message: 'The email is required' })
  @MaxLength(254, { message: 'The email must be less than 254 characters' })
  email: string;

  @IsNotEmpty({ message: 'The password is required' })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    { message: 'The password is not strong enough' },
  )
  @MaxLength(128, { message: 'The password must be less than 128 characters' })
  password: string;

  @IsNotEmpty({ message: 'The country is required' })
  country: string[];

  @IsNotEmpty({ message: 'The membership is required' })
  @MaxLength(50, { message: 'The membership must be less than 50 characters' })
  membership: string;

  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsArray()
  @IsNotEmpty()
  specialization: string[];

  @IsString()
  @IsNotEmpty()
  description: SponsorDescriptionDto[];

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
