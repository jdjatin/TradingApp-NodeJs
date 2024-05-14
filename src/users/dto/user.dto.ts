import { Optional } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional()
  @Optional()
  company: string;

  @ApiPropertyOptional()
  @Optional()
  phone: string;

  @ApiPropertyOptional()
  @Optional()
  country: string;

  @ApiPropertyOptional()
  @Optional()
  zipCode: number;

  @ApiPropertyOptional()
  @Optional()
  state: string;

  @ApiPropertyOptional()
  @Optional()
  city: string;

  @ApiPropertyOptional()
  @Optional()
  address: string;

  @ApiPropertyOptional()
  @Optional()
  symbols: { name: string }[];


}