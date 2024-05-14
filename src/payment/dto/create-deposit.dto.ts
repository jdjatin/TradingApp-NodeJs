import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsObject, IsString, Matches, MaxLength, MinLength, ValidateNested } from 'class-validator';


// enum status {
//     Pending = 'pending',
//     Completed = 'completed',
// }
export class CreateDepositDto {

    @IsNotEmpty()
    @IsInt()
    amount: number

    @IsNotEmpty()
    @IsString()
    transactionId: string;

    
    @IsNotEmpty()
    @IsString()
    provider: string;

    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    payload: string;

    @ApiProperty({enum:['completed','pending']})
    status: string;
}