import { Controller, Get, Patch, Param, Delete, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { Authorization } from 'src/auth/decorators/authorization.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

class UpdateRoleDto {
  @IsEnum(Role)
  role: Role;
}

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Current user profile
  @Authorization()
  @Get('profile')
  async getProfile(@Authorized('id') id: string) {
    return this.usersService.getProfile(id);
  }

  // Public — get single user
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // ADMIN+ — get all users
  @Roles(Role.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Get all users (Admin+)' })
  findAll() {
    return this.usersService.findAll();
  }

  // SUPER_ADMIN only — change a user's role
  @Roles(Role.SUPER_ADMIN)
  @Patch(':id/role')
  @ApiOperation({ summary: 'Update user role (Super Admin only)' })
  updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.usersService.updateRole(id, dto.role);
  }

  // SUPER_ADMIN only — delete any user
  @Roles(Role.SUPER_ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user (Super Admin only)' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
