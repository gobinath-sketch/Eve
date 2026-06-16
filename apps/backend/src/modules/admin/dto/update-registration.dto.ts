import { PartialType } from '@nestjs/swagger';
import { CreateRegistrationDto } from '../../registration/dto/create-registration.dto';

export class AdminUpdateRegistrationDto extends PartialType(
  CreateRegistrationDto,
) {}
