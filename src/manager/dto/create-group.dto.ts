import { IsArray, IsInt, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';


export class CreateGroupDto {

    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @MaxLength(32)
    title: string;

    @IsArray()
    @IsString({ each: true })
    memberIds: string[];

    @IsNotEmpty()
    @IsInt()
    margin: number

}