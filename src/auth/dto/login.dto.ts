import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'jatin@masterinfotech.com', description: 'These is broker/manager credentials' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Jatin.123'})
  @IsNotEmpty()
  password: string;
}
