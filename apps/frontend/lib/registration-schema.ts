import { z } from 'zod';

export const personalSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  gender: z.string().min(1, 'Gender is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  age: z.number({ error: 'Age is required' }).min(1),
  email: z.string().email('Valid email is required'),
  mobile: z.string().min(10, 'Valid mobile number is required'),
  whatsapp: z.string().min(10, 'Valid WhatsApp number is required'),
  country: z.string().min(1, 'Country is required'),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  address: z.string().min(5, 'Address is required'),
  pincode: z.string().min(4, 'Pincode is required'),
});

export const educationSchema = z.object({
  qualification: z.string().min(1, 'Qualification is required'),
  college: z.string().min(1, 'College is required'),
  department: z.string().min(1, 'Department is required'),
  graduationYear: z.number().min(1950).max(2030),
});

export const professionalSchema = z.object({
  currentStatus: z.string().min(1, 'Current status is required'),
  company: z.string().optional(),
  designation: z.string().optional(),
  experience: z.string().optional(),
});

export const eventSocialSchema = z.object({
  linkedinUrl: z.string().url('Valid LinkedIn URL').or(z.literal('')).optional(),
  githubUrl: z.string().url('Valid GitHub URL').or(z.literal('')).optional(),
  portfolioUrl: z.string().url('Valid portfolio URL').or(z.literal('')).optional(),
  whyAttending: z.string().min(10, 'Please tell us why you are attending'),
  expectations: z.string().min(10, 'Please share your expectations'),
  aiExperienceLevel: z.string().min(1, 'AI experience level is required'),
});

export const emergencySchema = z.object({
  emergencyContactName: z.string().min(2, 'Emergency contact name is required'),
  emergencyContactRelationship: z.string().min(1, 'Relationship is required'),
  emergencyContactPhone: z.string().min(10, 'Valid phone number is required'),
  termsAccepted: z.boolean().refine((v) => v === true, { message: 'You must accept the terms' }),
  privacyAccepted: z.boolean().refine((v) => v === true, { message: 'You must accept the privacy policy' }),
});

export const fullRegistrationSchema = personalSchema
  .merge(educationSchema)
  .merge(professionalSchema)
  .merge(eventSocialSchema)
  .merge(emergencySchema);

export type RegistrationFormData = z.infer<typeof fullRegistrationSchema>;

export const STEP_SCHEMAS = [
  personalSchema,
  educationSchema,
  professionalSchema,
  eventSocialSchema,
  emergencySchema,
] as const;

export const STEP_TITLES = [
  'Personal Information',
  'Education',
  'Professional',
  'Event & Social',
  'Emergency & Consent',
  'Review & Pay',
];
