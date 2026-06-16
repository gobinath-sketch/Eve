import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../../entities/event.entity';
import { SystemSetting } from '../../entities/system-setting.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
    @InjectRepository(SystemSetting)
    private readonly settingsRepo: Repository<SystemSetting>,
  ) {}

  async getCurrentEvent() {
    const event = await this.eventRepo.findOne({ where: { active: true } });
    const settings = await this.settingsRepo.find();
    const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));

    return {
      id: event?.id,
      name: map.event_name || event?.name || 'Code with Zen AI Summit 2026',
      description: event?.description,
      eventDate: map.event_date || event?.eventDate,
      venue: map.venue || event?.venue,
      venueAddress: event?.venueAddress,
      registrationFeePaise: event?.registrationFeePaise || 20000,
      registrationFeeInr: (event?.registrationFeePaise || 20000) / 100,
    };
  }
}
