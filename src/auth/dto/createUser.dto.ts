import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';



export class CreateUserDto {

  @ApiProperty({ example: 'name@yopmail.com' })
  @IsEmail({}, { message: 'Please enter a valid email' })
  email: string;


  @ApiProperty({ example: 'Admin@123#' })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @Matches(/^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?_₹]).{8,32}$/, { message: 'Password is too weak' })
  password: string;


  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(32)
  @Matches(/^[a-zA-Z ]*$/, { message: 'Invalid FirstName' })
  @Transform(({ value }: TransformFnParams) => value.trim())
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'These is broker/manager credentials' })
  @MaxLength(32)
  @Matches(/^[a-zA-Z ]*$/, { message: 'Invalid LastName' })
  @Transform(({ value }: TransformFnParams) => value.trim())
  lastName: string;


}