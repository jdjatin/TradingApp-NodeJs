// create-wishlist.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';


enum Category {
    Forex = 0,
    Indices = 1,
    Metals = 2,
}
export class CreateWishlistDto {
    @IsString()
    fullPairName: string;

    @IsString()
    symbol: string;

    @IsNotEmpty()
    @ApiProperty({ enum: Category })
    @IsEnum(Category, { message: 'categoryId must be one of the following values: 0 (Forex), 1 (Indices), 2 (Metals)' })
    categoryId: Category;
}
