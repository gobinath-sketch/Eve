import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Registration } from './registration.entity';
import { Admin } from './admin.entity';

@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'registration_id', unique: true })
  registrationId: string;

  @OneToOne(() => Registration, (registration) => registration.attendance)
  @JoinColumn({ name: 'registration_id' })
  registration: Registration;

  @Column({ name: 'checked_in_at', type: 'timestamptz' })
  checkedInAt: Date;

  @Column({ name: 'checked_in_by', nullable: true })
  checkedInBy: string;

  @ManyToOne(() => Admin, { nullable: true })
  @JoinColumn({ name: 'checked_in_by' })
  admin: Admin;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
