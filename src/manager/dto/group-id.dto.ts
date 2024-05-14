import {IsNotEmpty } from 'class-validator';


export class GroupIdDto {

    @IsNotEmpty()
    groupId: string

}