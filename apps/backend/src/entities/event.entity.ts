import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Registration } from './registration.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'event_date', type: 'timestamptz', nullable: true })
  eventDate: Date;

  @Column({ nullable: true })
  venue: string;

  @Column({ name: 'venue_address', type: 'text', nullable: true })
  venueAddress: string;

  @Column({ name: 'registration_fee_paise', type: 'int', default: 20000 })
  registrationFeePaise: number;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Registration, (registration) => registration.event)
  registrations: Registration[];
}
