import { IsNotEmpty, IsEmail, MinLength, IsOptional } from 'class-validator';

export class UserEditDto {
    @IsOptional()
    @IsNotEmpty()
  firstName: string;

    @IsOptional()
    @IsNotEmpty()
  lastName: string;

    @IsOptional()
    @IsNotEmpty()
  @IsEmail()
  email: string;

    @IsOptional()
    @IsNotEmpty()
  @MinLength(6)
  password: string;

//   @IsNotEmpty()
//   token: string;


}