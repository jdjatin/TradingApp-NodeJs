/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UserDto } from '../../dto/user.dto';
import { User } from '../../entities/user.entity';
import { UsersService } from '../../services/users/users.service';
import { UserEditDto } from '../../dto/userEdit.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AssignRoleDto } from '../../../users/dto/assign-role.dto';
import { Roles } from '../../../auth/roles/roles.decorator';
import { RoleGuard } from '../../../auth/role/role.guard';

@ApiTags('User')
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Roles('admin')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @ApiBearerAuth('access-token')
    @Get()
    async findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Roles('admin')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @ApiBearerAuth('access-token')
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<User> {
        return this.userService.findOne(id);
    }


    @Roles('admin')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @ApiBearerAuth('access-token')
    @Post()
    async create(@Body() userDto: UserDto) {
        const user = {
            ...userDto,
            isActive: true,
            isVerified: false,
        };
        const createdUser = this.userService.create(user);
        return createdUser;
    }

    @Roles('admin')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @ApiBearerAuth('access-token')
    @Put(':id')
    async update(@Param('id') id: string, @Body() userDto: UserEditDto): Promise<User> {
        const user: Partial<User> = {
            ...userDto,
            isActive: true,
            isVerified: false,
        };
        return this.userService.update(id, user as User);
    }


    @Roles('admin')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @ApiBearerAuth('access-token')
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.userService.remove(id);
    }


    // need to add admin role based access 
    @Post('assign-role')
    async assignRole(@Body() assignRoleDto: AssignRoleDto) {
        const createdUser = this.userService.assignRole(assignRoleDto);
        return createdUser;
    }

}


