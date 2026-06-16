import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { EmailType, EmailStatus } from '../common/enums';

@Entity('email_logs')
export class EmailLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'registration_id', nullable: true })
  registrationId: string;

  @Column({ type: 'enum', enum: EmailType })
  type: EmailType;

  @Column()
  recipient: string;

  @Column()
  subject: string;

  @Column({ type: 'enum', enum: EmailStatus, default: EmailStatus.PENDING })
  status: EmailStatus;

  @Column({ type: 'text', nullable: true })
  error: string;

  @CreateDateColumn({ name: 'sent_at' })
  sentAt: Date;
}
