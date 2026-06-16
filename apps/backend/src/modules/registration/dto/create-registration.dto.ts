import {
  IsString,
  IsEmail,
  IsInt,
  IsBoolean,
  IsOptional,
  IsDateString,
  Min,
  Max,
  MinLength,
  IsObject,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRegistrationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ApiProperty({ example: '2000-01-15' })
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty()
  @IsInt()
  @Min(10)
  @Max(100)
  age: number;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(10)
  mobile: string;

  @ApiProperty()
  @IsString()
  @MinLength(10)
  whatsapp: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pincode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  qualification: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  college: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiProperty()
  @IsInt()
  @Min(1990)
  @Max(2030)
  graduationYear: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  currentStatus: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  designation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  experience?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  linkedinUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  githubUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  portfolioUrl?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  whyAttending: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  expectations: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  aiExperienceLevel: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  emergencyContactName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  emergencyContactRelationship: string;

  @ApiProperty()
  @IsString()
  @MinLength(10)
  emergencyContactPhone: string;

  @ApiProperty()
  @IsBoolean()
  termsAccepted: boolean;

  @ApiProperty()
  @IsBoolean()
  privacyAccepted: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  browserInfo?: Record<string, unknown>;
}
