import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateActivityDto {
  @IsString()
  @IsNotEmpty({ message: 'The title is required' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'The description is required' })
  @MaxLength(500, {
    message: 'The description must be less than 500 characters',
  })
  description: string;

  @IsString()
  @IsNotEmpty({ message: 'The date is required' })
  date: string;

  @IsArray()
  @IsNotEmpty({ message: 'The array with the times is required' })
  time: string[];

  @IsString()
  @IsNotEmpty({ message: 'The recurrency is required' })
  recurrency: string;

  @IsString()
  @IsOptional({ message: 'Facilitator needed' })
  facilitator: string;

  @IsString()
  @IsNotEmpty({ message: 'The image is required' })
  image: string;

  @IsString()
  @IsNotEmpty({ message: 'The type is required' })
  type: string;

  @IsString()
  @IsNotEmpty({ message: 'The link is required' })
  link: string;

  @IsString()
  @IsOptional({ message: 'An observation of the activity' })
  observation: string;
}
