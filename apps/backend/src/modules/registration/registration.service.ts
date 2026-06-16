import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { Registration } from '../../entities/registration.entity';
import { Event } from '../../entities/event.entity';
import { User } from '../../entities/user.entity';
import { RegistrationStatus } from '../../common/enums';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationDto } from './dto/update-registration.dto';
import { generateRegistrationId } from '../../common/utils/registration-id.util';
import {
  getClientIp,
  getUserAgent,
} from '../../common/utils/request-metadata.util';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(Registration)
    private readonly registrationRepo: Repository<Registration>,
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createDraft(dto: CreateRegistrationDto, req: Request) {
    if (!dto.termsAccepted || !dto.privacyAccepted) {
      throw new BadRequestException(
        'Terms and privacy policy must be accepted',
      );
    }

    await this.assertNoPaidDuplicate(dto.email);

    const event = await this.eventRepo.findOne({ where: { active: true } });
    const registrationId = await generateRegistrationId(this.registrationRepo);

    let user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) {
      user = await this.userRepo.save({
        email: dto.email,
        fullName: dto.fullName,
        mobile: dto.mobile,
      });
    }

    const registration = this.registrationRepo.create({
      ...dto,
      registrationId,
      userId: user.id,
      eventId: event?.id,
      status: RegistrationStatus.DRAFT,
      ipAddress: getClientIp(req),
      userAgent: getUserAgent(req),
      browserInfo: dto.browserInfo,
    });

    const saved = await this.registrationRepo.save(registration);
    return this.sanitize(saved);
  }

  async findOne(id: string) {
    const registration = await this.registrationRepo.findOne({
      where: { id },
      relations: { eventPass: true, payments: true },
    });
    if (!registration) {
      throw new NotFoundException('Registration not found');
    }
    return this.sanitize(registration);
  }

  async update(id: string, dto: UpdateRegistrationDto, req: Request) {
    const registration = await this.registrationRepo.findOne({ where: { id } });
    if (!registration) {
      throw new NotFoundException('Registration not found');
    }

    if (registration.status === RegistrationStatus.PAID) {
      throw new BadRequestException('Cannot update a paid registration');
    }

    if (dto.email && dto.email !== registration.email) {
      await this.assertNoPaidDuplicate(dto.email);
    }

    Object.assign(registration, dto);
    registration.ipAddress = getClientIp(req);
    registration.userAgent = getUserAgent(req);
    if (dto.browserInfo) {
      registration.browserInfo = dto.browserInfo;
    }

    const saved = await this.registrationRepo.save(registration);
    return this.sanitize(saved);
  }

  async findByIdInternal(id: string): Promise<Registration> {
    const registration = await this.registrationRepo.findOne({
      where: { id },
      relations: { eventPass: true, payments: true },
    });
    if (!registration) {
      throw new NotFoundException('Registration not found');
    }
    return registration;
  }

  async markPendingPayment(id: string): Promise<void> {
    await this.registrationRepo.update(id, {
      status: RegistrationStatus.PENDING_PAYMENT,
    });
  }

  async markPaid(id: string): Promise<Registration> {
    await this.registrationRepo.update(id, {
      status: RegistrationStatus.PAID,
    });
    return this.findByIdInternal(id);
  }

  private async assertNoPaidDuplicate(email: string): Promise<void> {
    const existing = await this.registrationRepo.findOne({
      where: { email, status: RegistrationStatus.PAID },
    });
    if (existing) {
      throw new ConflictException(
        'A paid registration already exists for this email',
      );
    }
  }

  private sanitize(registration: Registration) {
    const { payments, ...rest } = registration;
    return {
      ...rest,
      payments: payments?.map((p) => ({
        id: p.id,
        razorpayOrderId: p.razorpayOrderId,
        razorpayPaymentId: p.razorpayPaymentId,
        amount: p.amount,
        currency: p.currency,
        status: p.status,
        createdAt: p.createdAt,
      })),
    };
  }
}
