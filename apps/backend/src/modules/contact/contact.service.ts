import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import * as nodemailer from 'nodemailer';
import { ContactMessage } from '../../entities/contact-message.entity';
import { ContactDto } from './dto/contact.dto';
import { getClientIp } from '../../common/utils/request-metadata.util';

@Injectable()
export class ContactService {
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly config: ConfigService,
    @InjectRepository(ContactMessage)
    private readonly contactRepo: Repository<ContactMessage>,
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

  async submit(dto: ContactDto, req: Request) {
    const message = this.contactRepo.create({
      ...dto,
      ipAddress: getClientIp(req),
    });
    await this.contactRepo.save(message);

    const contactEmail = this.config.get<string>('CONTACT_EMAIL');
    if (contactEmail) {
      await this.transporter.sendMail({
        from: this.config.get<string>('SMTP_FROM'),
        to: contactEmail,
        replyTo: dto.email,
        subject: `[Contact] ${dto.subject}`,
        html: `
          <p><strong>From:</strong> ${dto.name} (${dto.email})</p>
          <p><strong>Subject:</strong> ${dto.subject}</p>
          <p>${dto.message}</p>
        `,
      });
    }

    return { message: 'Message sent successfully', id: message.id };
  }
}
