import { IsEmail, IsIn, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsIn(['employee', 'manager'])
  role: string;
}
