import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsString, IsEnum, ValidateIf } from 'class-validator';


enum OrderCategory {
    InstantExecution = 0,
    BuyLimit = 1,
    SellLimit = 2,
    BuyStop = 3,
    SellStop = 4,
    BuyStopLimit = 5,
    SellStopLimit = 6,
}

enum OrderType {
    Buy = 'Buy',
    Sell = 'Sell',
}

export class CreateOrderDto {
    @IsString()
    FullPairName: string;

    @IsString()
    PairId: string;

    @IsDecimal()
    SwapRate: number;

    @IsString()
    Symbol: string;

    @IsDecimal()
    Price: number;

    @IsDecimal()
    StopLimitPrice: number;

    @IsDecimal()
    LotSize: number;

    @IsDecimal()
    SL: number;

    @IsDecimal()
    TP: number;

    @ApiProperty()
    @ValidateIf((o) => !o.ClosingPrice) // Validate amount only if currency is not provided
    @IsDecimal()
    OpeningPrice?: number;

    @ApiProperty()
    @ValidateIf((o) => !o.OpeningPrice) // Validate amount only if currency is not provided
    @IsDecimal()
    ClosingPrice?: string;

    @IsEnum(OrderCategory)
    OrderCategories: OrderCategory;

    @IsEnum(OrderType)
    OrderType: OrderType;

    @IsString()
    Remarks: string;
}
