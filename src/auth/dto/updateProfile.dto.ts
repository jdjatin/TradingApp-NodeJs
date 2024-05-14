import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateProfileDto {
    
    @IsOptional()
    @IsNotEmpty()
    // @IsDateString()
    @ApiPropertyOptional({ format: 'dd-mm-yyy', example: '15-03-2023' })
    DOB?: string;

    @IsOptional()
    @IsNotEmpty()
    @ApiPropertyOptional()
    firstName?:string;


    @IsOptional()
    @IsNotEmpty()
    @ApiPropertyOptional()
    lastName?:string;



    @IsOptional()
    @IsNotEmpty()
    @ApiPropertyOptional({ example: '(apartment) house, street' })
    address?: string;

    @IsOptional()
    @IsNotEmpty()
    @ApiPropertyOptional({ example: 'mohali' })
    city?: string;

    @IsOptional()
    @IsNotEmpty()
    @ApiPropertyOptional({ example: 'punjab' })
    state?: string;

    @IsOptional()
    @IsNotEmpty()
    @ApiPropertyOptional({ example: 'India' })
    country?: string;

    @IsOptional()
    @IsNotEmpty()
    @ApiPropertyOptional({ enum: ['Male', 'Female', 'Not Sure'] })
    gender?: string;

    @IsOptional()
    @IsNotEmpty()
    @ApiPropertyOptional({
        enum: [
            'Admin',
            'Agriculture',
            'Accountancy',
            'Admin / Secretarial',
            'Catering / Hospitality',
            'Marketing / PR',
            'Education',
            'Engineering',
            'Financial Services',
            'Healthcare',
            'IT',
            'Legal',
            'Manufacturing',
            'Military',
            'Property / Construction',
            'Retail / Sales',
            'Telecommunications',
            'Transport / Logistics',
            'Others',
        ],
    })
    occupation?: string;

    @IsOptional()
    @IsNotEmpty()
    @ApiPropertyOptional({
        enum: [
            'Employed (Full time)',
            'Self-employed',
            'Employed (Part time)',
            'Unemployed',
            'Student',
            'Retired',
        ],
    })
    employment_status?: string;

    @IsOptional()
    @IsNotEmpty()
    @ApiPropertyOptional({
        enum: [
            'Yes, I have less than 1 year of trading experience',
            'Yes, I have 1+ years of trading experience',
            'Yes, I have 2+ years of trading experience',
            'Yes, I have 4+ years of trading experience',
            'No, I have no trading experience',
        ],
    })
    previous_trading_experience?: string;

    @IsOptional()
    @IsNotEmpty()
    @ApiPropertyOptional({
        enum: [
            '$100,000 - $200,000',
            '$50,000 - $100,000',
            '$20,000 - $50,000',
            'More than $200,000',
            '$0 - $20,000',
        ],
    })
    annual_income?: string;

    @IsOptional()
    @IsNotEmpty()
    @ApiPropertyOptional({
        enum: [
            '$100,000 - $200,000',
            '$50,000 - $100,000',
            '$20,000 - $50,000',
            'More than $200,000',
            '$0 - $20,000',
        ],
    })
    total_wealth?: string;

    @IsOptional()
    @IsNotEmpty()
    @ApiPropertyOptional({
        enum: [
            'Savings',
            'Employment / business proceeds',
            'Rent',
            'Inheritance',
            'Borrowed funds / loan',
            'Pension',
        ],
    })
    income_source?: string;
}
