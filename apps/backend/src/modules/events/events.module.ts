import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../../entities/event.entity';
import { SystemSetting } from '../../entities/system-setting.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event, SystemSetting])],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
