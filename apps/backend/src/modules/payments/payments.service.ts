import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHmac } from 'crypto';
import Razorpay from 'razorpay';
import * as QRCode from 'qrcode';
import { Request } from 'express';
import { Payment } from '../../entities/payment.entity';
import { EventPass } from '../../entities/event-pass.entity';
import { PaymentStatus, RegistrationStatus } from '../../common/enums';
import { RegistrationService } from '../registration/registration.service';
import { EmailService } from '../email/email.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { getClientIp } from '../../common/utils/request-metadata.util';

@Injectable()
export class PaymentsService {
  private razorpay: Razorpay;

  constructor(
    private readonly config: ConfigService,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(EventPass)
    private readonly eventPassRepo: Repository<EventPass>,
    private readonly registrationService: RegistrationService,
    private readonly emailService: EmailService,
  ) {
    this.razorpay = new Razorpay({
      key_id: this.config.get<string>('RAZORPAY_KEY_ID') || '',
      key_secret: this.config.get<string>('RAZORPAY_KEY_SECRET') || '',
    });
  }

  async createOrder(dto: CreateOrderDto, req: Request) {
    const registration = await this.registrationService.findByIdInternal(
      dto.registrationId,
    );

    if (registration.status === RegistrationStatus.PAID) {
      throw new BadRequestException('Registration is already paid');
    }

    const amount = parseInt(
      this.config.get<string>('REGISTRATION_FEE_PAISE') || '20000',
      10,
    );

    const order = await this.razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: registration.registrationId,
      notes: {
        registrationId: registration.id,
        humanRegistrationId: registration.registrationId,
        email: registration.email,
      },
    });

    const payment = this.paymentRepo.create({
      registrationId: registration.id,
      razorpayOrderId: order.id,
      amount,
      currency: 'INR',
      status: PaymentStatus.CREATED,
      rawResponse: order as unknown as Record<string, unknown>,
      ipAddress: getClientIp(req),
    });

    await this.paymentRepo.save(payment);
    await this.registrationService.markPendingPayment(registration.id);

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: this.config.get<string>('RAZORPAY_KEY_ID'),
      registrationId: registration.id,
      humanRegistrationId: registration.registrationId,
    };
  }

  async verifyPayment(dto: VerifyPaymentDto) {
    const secret = this.config.get<string>('RAZORPAY_KEY_SECRET') || '';
    const body = `${dto.razorpay_order_id}|${dto.razorpay_payment_id}`;
    const expectedSignature = createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== dto.razorpay_signature) {
      throw new BadRequestException('Invalid payment signature');
    }

    const payment = await this.paymentRepo.findOne({
      where: { razorpayOrderId: dto.razorpay_order_id },
      relations: { registration: true },
    });

    if (!payment) {
      throw new NotFoundException('Payment record not found');
    }

    if (payment.status === PaymentStatus.CAPTURED) {
      const registration = await this.registrationService.findByIdInternal(
        payment.registrationId,
      );
      return this.buildSuccessResponse(registration, payment);
    }

    payment.razorpayPaymentId = dto.razorpay_payment_id;
    payment.razorpaySignature = dto.razorpay_signature;
    payment.status = PaymentStatus.CAPTURED;
    payment.rawResponse = {
      ...(payment.rawResponse || {}),
      verified: dto,
    };
    await this.paymentRepo.save(payment);

    const registration = await this.registrationService.markPaid(
      payment.registrationId,
    );

    let eventPass = await this.eventPassRepo.findOne({
      where: { registrationId: registration.id },
    });

    if (!eventPass) {
      const passCode = `PASS-${registration.registrationId}`;
      const qrData = await QRCode.toDataURL(
        JSON.stringify({
          registrationId: registration.registrationId,
          passCode,
          email: registration.email,
        }),
      );

      eventPass = this.eventPassRepo.create({
        registrationId: registration.id,
        passCode,
        qrData,
      });
      await this.eventPassRepo.save(eventPass);
    }

    await this.emailService.sendPaymentConfirmation(registration, payment);

    return this.buildSuccessResponse(registration, payment, eventPass);
  }

  private buildSuccessResponse(
    registration: Awaited<
      ReturnType<RegistrationService['findByIdInternal']>
    >,
    payment: Payment,
    eventPass?: EventPass,
  ) {
    return {
      success: true,
      registration: {
        id: registration.id,
        registrationId: registration.registrationId,
        fullName: registration.fullName,
        email: registration.email,
        status: registration.status,
        amount: payment.amount,
      },
      payment: {
        id: payment.id,
        razorpayOrderId: payment.razorpayOrderId,
        razorpayPaymentId: payment.razorpayPaymentId,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
      },
      eventPass: eventPass
        ? {
            passCode: eventPass.passCode,
            qrData: eventPass.qrData,
          }
        : undefined,
    };
  }
}
