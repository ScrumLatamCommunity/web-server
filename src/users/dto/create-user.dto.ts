import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'The name is required' })
  @MaxLength(100, { message: 'The name must be less than 100 characters' })
  name: string;

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
}
