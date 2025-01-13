import {
  IsString,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  Length,
} from 'class-validator';
import { NewsType, NewsStatus } from '@prisma/client';

export class CreateNewsDto {
  @IsNotEmpty({ message: 'The news must have a Title!' })
  @IsString()
  @Length(3, 100, { message: 'The title must be less than 100 characters' })
  title: string;

  @IsNotEmpty({ message: 'The news must have a Description!' })
  @IsString()
  @Length(10, 2000, {
    message: 'The description must be less than 2000 characters',
  })
  description: string;

  @IsString()
  @IsNotEmpty({ message: 'The news must have a image link!' })
  image: string;

  @IsEnum(NewsType)
  type: NewsType;

  @IsEnum(NewsStatus)
  status: NewsStatus;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;
}
