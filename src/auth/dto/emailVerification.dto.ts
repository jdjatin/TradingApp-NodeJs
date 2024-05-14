import { ApiProperty } from '@nestjs/swagger';
import {  IsNotEmpty } from 'class-validator';



export class EmailVerificationDto {

    @ApiProperty()
    @IsNotEmpty()
    token: string;


}