import { Repository } from 'typeorm';
import { Registration } from '../../entities/registration.entity';

const PREFIX = 'CWZ-2026-';

function randomSuffix(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function generateRegistrationId(
  repo: Repository<Registration>,
): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const registrationId = `${PREFIX}${randomSuffix()}`;
    const existing = await repo.findOne({ where: { registrationId } });
    if (!existing) {
      return registrationId;
    }
  }
  throw new Error('Failed to generate unique registration ID');
}
