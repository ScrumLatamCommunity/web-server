import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'The email is not valid' })
  @IsNotEmpty({ message: 'The email is required' })
  email: string;

  @IsNotEmpty({ message: 'The password is required' })
  password: string;
}
