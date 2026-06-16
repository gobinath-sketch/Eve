import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from 'express';
import * as ExcelJS from 'exceljs';
import { Registration } from '../../entities/registration.entity';
import { Payment } from '../../entities/payment.entity';
import { Attendance } from '../../entities/attendance.entity';
import { AuditLog } from '../../entities/audit-log.entity';
import { Admin } from '../../entities/admin.entity';
import {
  RegistrationStatus,
  PaymentStatus,
  EmailType,
} from '../../common/enums';
import { QueryRegistrationsDto } from './dto/query-registrations.dto';
import { AdminUpdateRegistrationDto } from './dto/update-registration.dto';
import { EmailService } from '../email/email.service';
import { getClientIp } from '../../common/utils/request-metadata.util';
import { Request } from 'express';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Registration)
    private readonly registrationRepo: Repository<Registration>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Attendance)
    private readonly attendanceRepo: Repository<Attendance>,
    @InjectRepository(AuditLog)
    private readonly auditLogRepo: Repository<AuditLog>,
    private readonly emailService: EmailService,
  ) {}

  async getStats() {
    const total = await this.registrationRepo.count();
    const paid = await this.registrationRepo.count({
      where: { status: RegistrationStatus.PAID },
    });
    const pending = await this.registrationRepo.count({
      where: { status: RegistrationStatus.PENDING_PAYMENT },
    });
    const failed = await this.registrationRepo.count({
      where: { status: RegistrationStatus.FAILED },
    });
    const draft = await this.registrationRepo.count({
      where: { status: RegistrationStatus.DRAFT },
    });
    const attendanceCount = await this.attendanceRepo.count();

    const revenueResult = await this.paymentRepo
      .createQueryBuilder('payment')
      .select('COALESCE(SUM(payment.amount), 0)', 'total')
      .where('payment.status = :status', { status: PaymentStatus.CAPTURED })
      .getRawOne<{ total: string }>();

    const revenuePaise = parseInt(revenueResult?.total || '0', 10);

    return {
      totalRegistrations: total,
      paidRegistrations: paid,
      pendingPayments: pending,
      failedPayments: failed,
      draftRegistrations: draft,
      attendanceCount,
      revenuePaise,
      revenueInr: revenuePaise / 100,
    };
  }

  async findRegistrations(query: QueryRegistrationsDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const qb = this.registrationRepo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.payments', 'payments')
      .leftJoinAndSelect('r.eventPass', 'eventPass')
      .leftJoinAndSelect('r.attendance', 'attendance')
      .orderBy('r.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (query.status) {
      qb.andWhere('r.status = :status', { status: query.status });
    }

    if (query.search) {
      const term = `%${query.search}%`;
      qb.andWhere(
        '(r.fullName ILIKE :term OR r.email ILIKE :term OR r.registrationId ILIKE :term OR r.mobile ILIKE :term)',
        { term },
      );
    }

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const registration = await this.registrationRepo.findOne({
      where: { id },
      relations: {
        payments: true,
        eventPass: true,
        attendance: true,
        event: true,
      },
    });
    if (!registration) {
      throw new NotFoundException('Registration not found');
    }
    return registration;
  }

  async update(
    id: string,
    dto: AdminUpdateRegistrationDto,
    admin: Admin,
    req: Request,
  ) {
    const registration = await this.findOne(id);
    Object.assign(registration, dto);
    const saved = await this.registrationRepo.save(registration);

    await this.logAudit(
      admin,
      'UPDATE',
      'registration',
      id,
      dto as Record<string, unknown>,
      req,
    );
    return saved;
  }

  async remove(id: string, admin: Admin, req: Request) {
    const registration = await this.findOne(id);
    await this.registrationRepo.remove(registration);
    await this.logAudit(admin, 'DELETE', 'registration', id, {}, req);
    return { message: 'Registration deleted' };
  }

  async resendEmail(id: string, type: EmailType) {
    const registration = await this.findOne(id);

    switch (type) {
      case EmailType.REGISTRATION_CONFIRMATION:
      case EmailType.PAYMENT_SUCCESS:
      case EmailType.EVENT_PASS:
        await this.emailService.resendConfirmation(registration);
        break;
      case EmailType.REMINDER:
        await this.emailService.sendReminder(registration);
        break;
      case EmailType.THANK_YOU:
        await this.emailService.sendThankYou(registration);
        break;
      default:
        throw new BadRequestException('Unsupported email type');
    }

    return { message: 'Email sent' };
  }

  async markAttendance(id: string, admin: Admin, req: Request) {
    const registration = await this.findOne(id);

    if (registration.status !== RegistrationStatus.PAID) {
      throw new BadRequestException('Only paid registrations can check in');
    }

    const existing = await this.attendanceRepo.findOne({
      where: { registrationId: id },
    });
    if (existing) {
      throw new BadRequestException('Already checked in');
    }

    const attendance = this.attendanceRepo.create({
      registrationId: id,
      checkedInAt: new Date(),
      checkedInBy: admin.id,
    });
    await this.attendanceRepo.save(attendance);
    await this.logAudit(admin, 'CHECK_IN', 'attendance', id, {}, req);

    return attendance;
  }

  async exportCsv(res: Response, query: QueryRegistrationsDto) {
    const registrations = await this.getAllForExport(query);
    const headers = [
      'Registration ID',
      'Full Name',
      'Email',
      'Mobile',
      'Status',
      'College',
      'City',
      'Created At',
    ];

    const rows = registrations.map((r) =>
      [
        r.registrationId,
        r.fullName,
        r.email,
        r.mobile,
        r.status,
        r.college,
        r.city,
        r.createdAt.toISOString(),
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(','),
    );

    const csv = [headers.join(','), ...rows].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=registrations.csv',
    );
    res.send(csv);
  }

  async exportExcel(res: Response, query: QueryRegistrationsDto) {
    const registrations = await this.getAllForExport(query);
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Registrations');

    sheet.columns = [
      { header: 'Registration ID', key: 'registrationId', width: 20 },
      { header: 'Full Name', key: 'fullName', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Mobile', key: 'mobile', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Gender', key: 'gender', width: 10 },
      { header: 'College', key: 'college', width: 25 },
      { header: 'Department', key: 'department', width: 20 },
      { header: 'City', key: 'city', width: 15 },
      { header: 'State', key: 'state', width: 15 },
      { header: 'AI Experience', key: 'aiExperienceLevel', width: 15 },
      { header: 'Created At', key: 'createdAt', width: 22 },
    ];

    registrations.forEach((r) => {
      sheet.addRow({
        registrationId: r.registrationId,
        fullName: r.fullName,
        email: r.email,
        mobile: r.mobile,
        status: r.status,
        gender: r.gender,
        college: r.college,
        department: r.department,
        city: r.city,
        state: r.state,
        aiExperienceLevel: r.aiExperienceLevel,
        createdAt: r.createdAt.toISOString(),
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=registrations.xlsx',
    );
    await workbook.xlsx.write(res);
  }

  private async getAllForExport(
    query: QueryRegistrationsDto,
  ): Promise<Registration[]> {
    const qb = this.registrationRepo
      .createQueryBuilder('r')
      .orderBy('r.createdAt', 'DESC');

    if (query.status) {
      qb.andWhere('r.status = :status', { status: query.status });
    }
    if (query.search) {
      const term = `%${query.search}%`;
      qb.andWhere(
        '(r.fullName ILIKE :term OR r.email ILIKE :term OR r.registrationId ILIKE :term)',
        { term },
      );
    }

    return qb.getMany();
  }

  private async logAudit(
    admin: Admin,
    action: string,
    entity: string,
    entityId: string,
    payload: Record<string, unknown>,
    req: Request,
  ) {
    await this.auditLogRepo.save({
      adminId: admin.id,
      action,
      entity,
      entityId,
      payload,
      ipAddress: getClientIp(req),
    });
  }
}
