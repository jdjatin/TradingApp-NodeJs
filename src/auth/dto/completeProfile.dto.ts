import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty } from "class-validator";

export class completeProfileDto {
    

    @IsNotEmpty()
    @ApiProperty({example:'Sandeep'})
    firstName:string;

    
    @IsNotEmpty()
    @ApiProperty({example:'Rana'})
    lastName:string;

    @IsNotEmpty()
    @ApiProperty({format: 'dd-mm-yyy', example: '15-03-2023'})
    DOB:string;

    @IsNotEmpty()
    @ApiProperty({example:'(apartment) house, street'})
    address:string;

    @IsNotEmpty()
    @ApiProperty({example:'mohali'})
    city:string;

    @IsNotEmpty()
    @ApiProperty({example:'punjab'})
    state:string;

    @IsNotEmpty()
    @ApiProperty({example:'India'})
    country:string;

    @IsNotEmpty()
    @ApiProperty({enum:['Male', 'Female', 'Not Sure']})
    gender:string;

    @IsNotEmpty()
    @ApiProperty({enum:['Admin', 'Agriculture', 'Accountancy', 'Admin / Secretarial', 'Catering / Hospitality', 'Marketing / PR', 'Education', 'Engineering', 'Financial Services', 'Healthcare', 'IT', 'Legal', 'Manufacturing', 'Military', 'Property / Construction', 'Retail / Sales', 'Telecommunications', 'Transport / Logistics', 'Others']})
    occupation:string;

    @IsNotEmpty()
    @ApiProperty({enum:['Employed (Full time)','Self-employed','Employed (Part time)','Unemployed','Student','Retired']})
    employment_status:string;


    @IsNotEmpty()
    @ApiProperty({enum:['Yes, I have less than 1 year of trading experience','Yes, I have 1+ years of trading experience','Yes, I have 2+ years of trading experience','Yes, I have 4+ years of trading experience','No, I have no trading experience']})
    previous_trading_experience:string;

    @IsNotEmpty()
    @ApiProperty({enum:['Investment' ,'Hedging' ,'Speculation']})
    purpose:string;

    @IsNotEmpty()
    @ApiProperty({enum:['$100,000 - $200,000','$50,000 - $100,000','$20,000 - $50,000','More than $200,000','$0 - $20,000']})
    annual_income:string;

    @IsNotEmpty()
    @ApiProperty({enum:['$100,000 - $200,000','$50,000 - $100,000','$20,000 - $50,000','More than $200,000','$0 - $20,000']})
    total_wealth:string;

    @IsNotEmpty()
    @ApiProperty({enum:['Savings','Employment / business proceeds','Rent','Inheritance','Borrowed funds / loan','Pension']})
    income_source:string;
}