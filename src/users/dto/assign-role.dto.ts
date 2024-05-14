import { IsNotEmpty, IsEmail, MinLength, IsEnum } from 'class-validator';

enum Roles {
    Admin = 'admin',
    Customer = 'customer',
    Manager = 'manager',
}

export class AssignRoleDto {
    @IsEnum(Roles, {
        message: 'Invalid role. Must be one of: admin, customer, manager',
    })
    role: Roles;

    @IsNotEmpty()
    user_id: string;

}