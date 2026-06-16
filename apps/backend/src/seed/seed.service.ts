import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from '../entities/admin.entity';
import { Event } from '../entities/event.entity';
import { SystemSetting } from '../entities/system-setting.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly config: ConfigService,
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
    @InjectRepository(SystemSetting)
    private readonly settingsRepo: Repository<SystemSetting>,
  ) {}

  async onModuleInit() {
    if (this.config.get<string>('RUN_SEED_ON_START') === 'true') {
      await this.seed();
    }
  }

  async seed(): Promise<void> {
    await this.seedAdmin();
    await this.seedEvent();
    await this.seedSystemSettings();
    this.logger.log('Database seed completed');
  }

  private async seedAdmin(): Promise<void> {
    const email = this.config.get<string>('ADMIN_EMAIL');
    const password = this.config.get<string>('ADMIN_PASSWORD');

    if (!email || !password) {
      this.logger.warn('ADMIN_EMAIL or ADMIN_PASSWORD not set, skipping admin seed');
      return;
    }

    const existing = await this.adminRepo.findOne({ where: { email } });
    if (existing) {
      this.logger.log(`Admin already exists: ${email}`);
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await this.adminRepo.save({
      email,
      passwordHash,
      role: 'admin',
    });
    this.logger.log(`Admin seeded: ${email}`);
  }

  private async seedEvent(): Promise<void> {
    const existing = await this.eventRepo.findOne({
      where: { name: 'Code with Zen AI Summit 2026' },
    });
    if (existing) {
      this.logger.log('Default event already exists');
      return;
    }

    await this.eventRepo.save({
      name: 'Code with Zen AI Summit 2026',
      description:
        'A premier summit on emerging AI, vibe coding, agents, and building with LLMs.',
      eventDate: new Date('2026-06-15T09:00:00+05:30'),
      venue: 'TBD — Chennai, India',
      venueAddress: 'Venue details will be shared via email',
      registrationFeePaise: 20000,
      active: true,
    });
    this.logger.log('Default event seeded');
  }

  private async seedSystemSettings(): Promise<void> {
    const defaults: Record<string, string> = {
      event_name: 'Code with Zen AI Summit 2026',
      event_date: '2026-06-15',
      venue: 'TBD — Chennai, India',
    };

    for (const [key, value] of Object.entries(defaults)) {
      const existing = await this.settingsRepo.findOne({ where: { key } });
      if (!existing) {
        await this.settingsRepo.save({ key, value });
        this.logger.log(`System setting seeded: ${key}`);
      }
    }
  }
}
