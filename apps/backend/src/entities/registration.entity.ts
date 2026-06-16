import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { RegistrationStatus } from '../common/enums';
import { User } from './user.entity';
import { Event } from './event.entity';
import { Payment } from './payment.entity';
import { EventPass } from './event-pass.entity';
import { Attendance } from './attendance.entity';

@Entity('registrations')
export class Registration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'registration_id', unique: true })
  registrationId: string;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @ManyToOne(() => User, (user) => user.registrations, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'event_id', nullable: true })
  eventId: string;

  @ManyToOne(() => Event, (event) => event.registrations, { nullable: true })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column()
  gender: string;

  @Column({ name: 'date_of_birth', type: 'date' })
  dateOfBirth: string;

  @Column({ type: 'int' })
  age: number;

  @Column()
  email: string;

  @Column()
  mobile: string;

  @Column()
  whatsapp: string;

  @Column()
  country: string;

  @Column()
  state: string;

  @Column()
  city: string;

  @Column({ type: 'text' })
  address: string;

  @Column()
  pincode: string;

  @Column()
  qualification: string;

  @Column()
  college: string;

  @Column()
  department: string;

  @Column({ name: 'graduation_year', type: 'int' })
  graduationYear: number;

  @Column({ name: 'current_status' })
  currentStatus: string;

  @Column({ nullable: true })
  company: string;

  @Column({ nullable: true })
  designation: string;

  @Column({ nullable: true })
  experience: string;

  @Column({ name: 'linkedin_url', nullable: true })
  linkedinUrl: string;

  @Column({ name: 'github_url', nullable: true })
  githubUrl: string;

  @Column({ name: 'portfolio_url', nullable: true })
  portfolioUrl: string;

  @Column({ name: 'why_attending', type: 'text' })
  whyAttending: string;

  @Column({ type: 'text' })
  expectations: string;

  @Column({ name: 'ai_experience_level' })
  aiExperienceLevel: string;

  @Column({ name: 'emergency_contact_name' })
  emergencyContactName: string;

  @Column({ name: 'emergency_contact_relationship' })
  emergencyContactRelationship: string;

  @Column({ name: 'emergency_contact_phone' })
  emergencyContactPhone: string;

  @Column({ name: 'terms_accepted', default: false })
  termsAccepted: boolean;

  @Column({ name: 'privacy_accepted', default: false })
  privacyAccepted: boolean;

  @Column({
    type: 'enum',
    enum: RegistrationStatus,
    default: RegistrationStatus.DRAFT,
  })
  status: RegistrationStatus;

  @Column({ name: 'ip_address', nullable: true })
  ipAddress: string;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string;

  @Column({ name: 'browser_info', type: 'jsonb', nullable: true })
  browserInfo: Record<string, unknown>;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Payment, (payment) => payment.registration)
  payments: Payment[];

  @OneToOne(() => EventPass, (pass) => pass.registration)
  eventPass: EventPass;

  @OneToOne(() => Attendance, (attendance) => attendance.registration)
  attendance: Attendance;
}
