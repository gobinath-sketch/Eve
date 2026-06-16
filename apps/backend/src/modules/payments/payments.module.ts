import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../../entities/payment.entity';
import { EventPass } from '../../entities/event-pass.entity';
import { RegistrationModule } from '../registration/registration.module';
import { EmailModule } from '../email/email.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, EventPass]),
    RegistrationModule,
    EmailModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
