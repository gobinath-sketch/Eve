import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailLog } from '../../entities/email-log.entity';
import { SystemSetting } from '../../entities/system-setting.entity';
import { EventPass } from '../../entities/event-pass.entity';
import { EmailService } from './email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailLog, SystemSetting, EventPass]),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
