import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { EmailLog } from '../../entities/email-log.entity';
import { SystemSetting } from '../../entities/system-setting.entity';
import { Registration } from '../../entities/registration.entity';
import { Payment } from '../../entities/payment.entity';
import { EventPass } from '../../entities/event-pass.entity';
import { EmailType, EmailStatus } from '../../common/enums';
import {
  confirmationTemplate,
  passTemplate,
  reminderTemplate,
  thankYouTemplate,
} from './templates/email.templates';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly config: ConfigService,
    @InjectRepository(EmailLog)
    private readonly emailLogRepo: Repository<EmailLog>,
    @InjectRepository(SystemSetting)
    private readonly settingsRepo: Repository<SystemSetting>,
    @InjectRepository(EventPass)
    private readonly eventPassRepo: Repository<EventPass>,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('SMTP_HOST'),
      port: parseInt(this.config.get<string>('SMTP_PORT') || '587', 10),
      secure: false,
      auth: {
        user: this.config.get<string>('SMTP_USER'),
        pass: this.config.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendPaymentConfirmation(
    registration: Registration,
    payment: Payment,
  ): Promise<void> {
    const settings = await this.getEventSettings();
    const eventPass = await this.eventPassRepo.findOne({
      where: { registrationId: registration.id },
    });

    const confirmData = {
      fullName: registration.fullName,
      registrationId: registration.registrationId,
      eventName: settings.eventName,
      eventDate: settings.eventDate,
      venue: settings.venue,
      amount: payment.amount,
      paymentId: payment.razorpayPaymentId,
    };

    await this.sendEmail({
      type: EmailType.REGISTRATION_CONFIRMATION,
      recipient: registration.email,
      subject: `Registration Confirmed — ${settings.eventName}`,
      html: confirmationTemplate(confirmData),
      registrationId: registration.id,
    });

    if (eventPass) {
      await this.sendEmail({
        type: EmailType.EVENT_PASS,
        recipient: registration.email,
        subject: `Your Event Pass — ${settings.eventName}`,
        html: passTemplate({
          fullName: registration.fullName,
          registrationId: registration.registrationId,
          passCode: eventPass.passCode,
          eventName: settings.eventName,
          eventDate: settings.eventDate,
          venue: settings.venue,
          qrDataUrl: eventPass.qrData,
        }),
        registrationId: registration.id,
      });
    }
  }

  async sendReminder(registration: Registration): Promise<void> {
    const settings = await this.getEventSettings();
    await this.sendEmail({
      type: EmailType.REMINDER,
      recipient: registration.email,
      subject: `Event Reminder — ${settings.eventName}`,
      html: reminderTemplate({
        fullName: registration.fullName,
        registrationId: registration.registrationId,
        eventName: settings.eventName,
        eventDate: settings.eventDate,
        venue: settings.venue,
      }),
      registrationId: registration.id,
    });
  }

  async sendThankYou(registration: Registration): Promise<void> {
    const settings = await this.getEventSettings();
    await this.sendEmail({
      type: EmailType.THANK_YOU,
      recipient: registration.email,
      subject: `Thank You — ${settings.eventName}`,
      html: thankYouTemplate({
        fullName: registration.fullName,
        eventName: settings.eventName,
      }),
      registrationId: registration.id,
    });
  }

  async resendConfirmation(registration: Registration): Promise<void> {
    const payment = registration.payments?.find(
      (p) => p.razorpayPaymentId,
    );
    if (!payment) {
      throw new Error('No payment found for registration');
    }
    await this.sendPaymentConfirmation(registration, payment);
  }

  private async sendEmail(params: {
    type: EmailType;
    recipient: string;
    subject: string;
    html: string;
    registrationId?: string;
  }): Promise<void> {
    const log = this.emailLogRepo.create({
      type: params.type,
      recipient: params.recipient,
      subject: params.subject,
      status: EmailStatus.PENDING,
      registrationId: params.registrationId,
    });
    await this.emailLogRepo.save(log);

    try {
      await this.transporter.sendMail({
        from: this.config.get<string>('SMTP_FROM'),
        to: params.recipient,
        subject: params.subject,
        html: params.html,
      });
      log.status = EmailStatus.SENT;
      await this.emailLogRepo.save(log);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(`Email send failed: ${message}`);
      log.status = EmailStatus.FAILED;
      log.error = message;
      await this.emailLogRepo.save(log);
    }
  }

  private async getEventSettings(): Promise<{
    eventName: string;
    eventDate: string;
    venue: string;
  }> {
    const settings = await this.settingsRepo.find();
    const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    return {
      eventName: map.event_name || 'Code with Zen AI Summit 2026',
      eventDate: map.event_date || '2026-06-15',
      venue: map.venue || 'TBD — Chennai, India',
    };
  }
}
