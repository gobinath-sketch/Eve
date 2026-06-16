import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import type { Request } from 'express';
import { RegistrationService } from './registration.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationDto } from './dto/update-registration.dto';

@ApiTags('registrations')
@Controller('registrations')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post('draft')
  @ApiOperation({ summary: 'Create draft registration' })
  createDraft(@Body() dto: CreateRegistrationDto, @Req() req: Request) {
    return this.registrationService.createDraft(dto, req);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get registration by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.registrationService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update registration' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRegistrationDto,
    @Req() req: Request,
  ) {
    return this.registrationService.update(id, dto, req);
  }
}
