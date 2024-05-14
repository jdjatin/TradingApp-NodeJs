import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordLinkDto {

  @ApiProperty()
  @IsEmail()
  email: string;
}