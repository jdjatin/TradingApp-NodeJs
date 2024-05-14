// create-wishlist.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class RemoveWishlistDto {
    @IsArray()
    @ApiProperty({
        example: ['e2ac18d5-1f94-45b0-9c1f-7f9d9a2e0463', 'b6ec9eb9-9fb1-4a7e-941d-1d2a97659a0c'],
        description: 'An array of UUIDs (IDs) to be deleted',
    })
    @IsUUID(undefined, { each: true })
    ids: string[]; // An array of UUIDs (IDs) to be deleted
}
