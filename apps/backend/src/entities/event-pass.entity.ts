import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Registration } from './registration.entity';

@Entity('event_passes')
export class EventPass {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'registration_id', unique: true })
  registrationId: string;

  @OneToOne(() => Registration, (registration) => registration.eventPass)
  @JoinColumn({ name: 'registration_id' })
  registration: Registration;

  @Column({ name: 'pass_code', unique: true })
  passCode: string;

  @Column({ name: 'qr_data', type: 'text' })
  qrData: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
