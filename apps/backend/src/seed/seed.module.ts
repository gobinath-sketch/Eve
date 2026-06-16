import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../entities/admin.entity';
import { Event } from '../entities/event.entity';
import { SystemSetting } from '../entities/system-setting.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, Event, SystemSetting])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
