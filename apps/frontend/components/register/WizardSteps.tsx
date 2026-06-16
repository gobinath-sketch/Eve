'use client';

import { useFormContext } from 'react-hook-form';
import type { RegistrationFormData } from '@/lib/registration-schema';

function Field({ name, label, type = 'text', required = true }: { name: keyof RegistrationFormData; label: string; type?: string; required?: boolean }) {
  const { register, formState: { errors } } = useFormContext<RegistrationFormData>();
  const error = errors[name]?.message as string | undefined;
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-white/50">
        {label}{required && <span className="text-brand ml-0.5">*</span>}
      </label>
      <input
        type={type}
        {...register(name, type === 'number' ? { valueAsNumber: true } : undefined)}
        className={error ? 'border-red-500/50' : ''}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function PersonalStep() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <Field name="fullName" label="Full Name" />
      <div>
        <label className="mb-1.5 block text-xs font-medium text-white/50">
          Gender<span className="text-brand ml-0.5">*</span>
        </label>
        <select {...useFormContext<RegistrationFormData>().register('gender')}>
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
      </div>
      <Field name="dateOfBirth" label="Date of Birth" type="date" />
      <Field name="age" label="Age" type="number" />
      <Field name="email" label="Email" type="email" />
      <Field name="mobile" label="Mobile Number" />
      <Field name="whatsapp" label="WhatsApp Number" />
      <Field name="country" label="Country" />
      <Field name="state" label="State" />
      <Field name="city" label="City" />
      <div className="md:col-span-2"><Field name="address" label="Address" /></div>
      <Field name="pincode" label="Pincode" />
    </div>
  );
}

export function EducationStep() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <Field name="qualification" label="Qualification" />
      <Field name="college" label="College" />
      <Field name="department" label="Department" />
      <Field name="graduationYear" label="Graduation Year" type="number" />
    </div>
  );
}

export function ProfessionalStep() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <div>
        <label className="mb-1 block text-xs text-white/50">Current Status *</label>
        <select {...useFormContext<RegistrationFormData>().register('currentStatus')}>
          <option value="">Select</option>
          <option value="Student">Student</option>
          <option value="Developer">Developer</option>
          <option value="Software Engineer">Software Engineer</option>
          <option value="AI Engineer">AI Engineer</option>
          <option value="Freelancer">Freelancer</option>
          <option value="Founder">Founder</option>
          <option value="Professional">Professional</option>
          <option value="Business Owner">Business Owner</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <Field name="company" label="Company" required={false} />
      <Field name="designation" label="Designation" required={false} />
      <Field name="experience" label="Experience" required={false} />
    </div>
  );
}

export function EventSocialStep() {
  const { register, formState: { errors } } = useFormContext<RegistrationFormData>();
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <Field name="linkedinUrl" label="LinkedIn URL" required={false} />
      <Field name="githubUrl" label="GitHub URL" required={false} />
      <Field name="portfolioUrl" label="Portfolio URL" required={false} />
      <div className="md:col-span-2">
        <label className="mb-1 block text-xs text-white/50">Why are you attending? *</label>
        <textarea rows={2} {...register('whyAttending')} />
        {errors.whyAttending && <p className="text-xs text-red-400">{errors.whyAttending.message}</p>}
      </div>
      <div className="md:col-span-2">
        <label className="mb-1 block text-xs text-white/50">Expectations from event *</label>
        <textarea rows={2} {...register('expectations')} />
        {errors.expectations && <p className="text-xs text-red-400">{errors.expectations.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-xs text-white/50">AI Experience Level *</label>
        <select {...register('aiExperienceLevel')}>
          <option value="">Select</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
          <option value="Expert">Expert</option>
        </select>
      </div>
    </div>
  );
}

export function EmergencyStep() {
  const { register, formState: { errors } } = useFormContext<RegistrationFormData>();
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Field name="emergencyContactName" label="Emergency Contact Name" />
        <Field name="emergencyContactRelationship" label="Relationship" />
        <Field name="emergencyContactPhone" label="Emergency Contact Phone" />
      </div>
      <div className="space-y-2 pt-2">
        <label className="flex items-center gap-2 text-xs text-white/70">
          <input type="checkbox" {...register('termsAccepted')} className="w-4" />
          I accept the Terms &amp; Conditions *
        </label>
        {errors.termsAccepted && <p className="text-xs text-red-400">{errors.termsAccepted.message}</p>}
        <label className="flex items-center gap-2 text-xs text-white/70">
          <input type="checkbox" {...register('privacyAccepted')} className="w-4" />
          I accept the Privacy Policy *
        </label>
        {errors.privacyAccepted && <p className="text-xs text-red-400">{errors.privacyAccepted.message}</p>}
      </div>
    </div>
  );
}

export function ReviewStep({ data }: { data: RegistrationFormData }) {
  const fields = Object.entries(data).filter(([k, v]) => !k.includes('Accepted') && v !== undefined && v !== '' && v !== null);
  return (
    <div className="space-y-2">
      <p className="text-xs text-white/40 mb-3">Please review your details before payment.</p>
      <div className="grid grid-cols-1 gap-1.5 md:grid-cols-2">
        {fields.map(([key, value]) => (
          <div key={key} className="bg-white/3 border border-white/6 rounded-lg px-3 py-2">
            <span className="text-[10px] uppercase tracking-wide text-white/35 block mb-0.5">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            <span className="text-xs text-white/80 font-medium">{String(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
