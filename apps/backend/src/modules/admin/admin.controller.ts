import {
  Controller,
  Get,
  Patch,
  Delete,
  Post,
  Param,
  Body,
  Query,
  Req,
  Res,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiCookieAuth,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentAdmin } from '../../common/decorators/current-admin.decorator';
import { Admin } from '../../entities/admin.entity';
import { QueryRegistrationsDto } from './dto/query-registrations.dto';
import { AdminUpdateRegistrationDto } from './dto/update-registration.dto';
import { ResendEmailDto } from './dto/resend-email.dto';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiCookieAuth('access_token')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Dashboard statistics' })
  getStats() {
    return this.adminService.getStats();
  }

  @Get('registrations')
  @ApiOperation({ summary: 'List registrations with search and filter' })
  findRegistrations(@Query() query: QueryRegistrationsDto) {
    return this.adminService.findRegistrations(query);
  }

  @Get('registrations/:id')
  @ApiOperation({ summary: 'Get registration detail' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.findOne(id);
  }

  @Patch('registrations/:id')
  @ApiOperation({ summary: 'Update registration' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AdminUpdateRegistrationDto,
    @CurrentAdmin() admin: Admin,
    @Req() req: Request,
  ) {
    return this.adminService.update(id, dto, admin, req);
  }

  @Delete('registrations/:id')
  @ApiOperation({ summary: 'Delete registration' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentAdmin() admin: Admin,
    @Req() req: Request,
  ) {
    return this.adminService.remove(id, admin, req);
  }

  @Post('registrations/:id/resend-email')
  @ApiOperation({ summary: 'Resend email to registrant' })
  resendEmail(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ResendEmailDto,
  ) {
    return this.adminService.resendEmail(id, dto.type);
  }

  @Post('registrations/:id/attendance')
  @ApiOperation({ summary: 'Mark attendance for registration' })
  markAttendance(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentAdmin() admin: Admin,
    @Req() req: Request,
  ) {
    return this.adminService.markAttendance(id, admin, req);
  }

  @Get('export/csv')
  @ApiOperation({ summary: 'Export registrations as CSV' })
  exportCsv(
    @Query() query: QueryRegistrationsDto,
    @Res() res: Response,
  ) {
    return this.adminService.exportCsv(res, query);
  }

  @Get('export/excel')
  @ApiOperation({ summary: 'Export registrations as Excel' })
  exportExcel(
    @Query() query: QueryRegistrationsDto,
    @Res() res: Response,
  ) {
    return this.adminService.exportExcel(res, query);
  }
}
