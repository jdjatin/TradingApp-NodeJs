import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class DocType {

    @IsOptional()
    front_pic: Express.Multer.File[];
  
    @IsOptional()
    back_pic: Express.Multer.File[];

    @IsNotEmpty()
    @ApiProperty({enum:['Passport (main page)','Permanent Account Number (PAN) card (front)',"Driver's License (front and back)","Aadhaar card(front and back)","Voter Id card (front and back)"]})
    document_type:string;

}