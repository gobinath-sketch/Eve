import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EmailType } from '../../../common/enums';

export class ResendEmailDto {
  @ApiProperty({ enum: EmailType })
  @IsEnum(EmailType)
  type: EmailType;
}
