import { IsInt, IsDecimal, IsString, IsEnum } from 'class-validator';


export class WrapPositionDto {
  
    @IsString()
    orderId: string;

    @IsDecimal()
    currentClosingPrice: number;

    @IsDecimal()
    lotSize: number;

    @IsDecimal()
    deviation: number;
}
