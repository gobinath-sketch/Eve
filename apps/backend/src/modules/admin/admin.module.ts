import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Registration } from '../../entities/registration.entity';
import { Payment } from '../../entities/payment.entity';
import { Attendance } from '../../entities/attendance.entity';
import { AuditLog } from '../../entities/audit-log.entity';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Registration,
      Payment,
      Attendance,
      AuditLog,
    ]),
    AuthModule,
    EmailModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
