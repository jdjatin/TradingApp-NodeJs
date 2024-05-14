import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { WrapPositionDto } from './wrap-position.dto'; // Import your existing DTO

export class BulkWrapPositionsDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => WrapPositionDto) // Validate each item in the array as a WrapPositionDto
    positions: WrapPositionDto[]; // An array of WrapPositionDto objects
}
