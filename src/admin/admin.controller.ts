import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('admin')
@Controller('admin')
@Roles(Role.ADMIN) // ADMIN+ (includes SUPER_ADMIN via hierarchy)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Dashboard statistics (Admin+)' })
  getStats() {
    return this.adminService.getStats();
  }
}
