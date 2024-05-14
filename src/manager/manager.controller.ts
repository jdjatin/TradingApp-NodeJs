import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Req, Query } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles/roles.decorator';
import { RoleGuard } from '../auth/role/role.guard';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupIdDto } from './dto/group-id.dto';

@ApiTags('Manager')
@Controller('manager')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) { }


  @Roles('manager')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @ApiBearerAuth('access-token')
  @Post('create-group')
  async createGroup(@Body() createManagerDto: CreateGroupDto, @Request() req) {
    const userId = req.user.id;
    return await this.managerService.createGroup(createManagerDto, userId);
  }

  @Roles('manager')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @ApiBearerAuth('access-token')
  @Get('groups')
  findAllGroups(@Req() req,) {
    const userId = req.user.id;
    return this.managerService.findAllGroups(userId);
  }


  @Roles('manager')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @ApiBearerAuth('access-token')
  @Get('groups/:groupId')
  findOneGroup(@Param() param: GroupIdDto) {
    return this.managerService.findOne(param.groupId);
  }


  @Roles('manager')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @ApiBearerAuth('access-token')
  @Patch('groups/:groupId')
  updateGroup(@Param() param: GroupIdDto, @Body() data: UpdateGroupDto, @Request() req) {
    console.log('group_id', param.groupId)
    return this.managerService.updateGroup({
      ...data,
      groupId: param.groupId,
      userId: req.user.id
    });
  }

  @Roles('manager')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @ApiBearerAuth('access-token')
  @Delete('groups/:id')
  removeGroup(@Param('id') id: string) {
    return this.managerService.removeGroup(id);
  }
}
