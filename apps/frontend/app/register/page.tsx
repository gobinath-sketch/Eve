'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PageShell from '@/components/layout/PageShell';
import {
  PersonalStep, EducationStep, ProfessionalStep,
  EventSocialStep, EmergencyStep, ReviewStep,
} from '@/components/register/WizardSteps';
import {
  fullRegistrationSchema, STEP_SCHEMAS, STEP_TITLES,
  type RegistrationFormData,
} from '@/lib/registration-schema';
import { SITE_NAME, REGISTRATION_FEE } from '@/lib/constants';
import { createRegistrationDraft, createPaymentOrder, verifyPayment } from '@/lib/api';
import { openRazorpayCheckout } from '@/lib/razorpay';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const STEP_COMPONENTS = [PersonalStep, EducationStep, ProfessionalStep, EventSocialStep, EmergencyStep];

export default function RegisterWizard() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const methods = useForm<RegistrationFormData>({
    resolver: zodResolver(fullRegistrationSchema),
    mode: 'onChange',
    defaultValues: {
      termsAccepted: false,
      privacyAccepted: false,
      age: undefined,
      graduationYear: undefined,
    },
  });

  const { handleSubmit, getValues, trigger, watch } = methods;
  const formData = watch();

  const nextStep = async () => {
    if (step < STEP_SCHEMAS.length) {
      const fields = Object.keys(STEP_SCHEMAS[step].shape) as (keyof RegistrationFormData)[];
      const valid = await trigger(fields);
      if (valid) setStep(step + 1);
    }
  };

  const prevStep = () => { if (step > 0) setStep(step - 1); };

  const onPay = async () => {
    setLoading(true);
    setError('');
    try {
      const data = getValues();
      const browserInfo = {
        language: navigator.language,
        platform: navigator.platform,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
      };

      const draft = await createRegistrationDraft({
        ...data,
        linkedinUrl: data.linkedinUrl || undefined,
        githubUrl: data.githubUrl || undefined,
        portfolioUrl: data.portfolioUrl || undefined,
        browserInfo,
      });

      const order = await createPaymentOrder(draft.id);

      await openRazorpayCheckout({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: order.amount,
        orderId: order.orderId,
        name: data.fullName,
        email: data.email,
        phone: data.mobile,
        description: `${SITE_NAME} Registration`,
        onSuccess: async (response) => {
          try {
            const result = await verifyPayment({
              registrationId: draft.id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            router.push(`/register/success?id=${result.registration.id}`);
          } catch {
            setError('Payment verification failed. Contact support with your payment ID.');
            setLoading(false);
          }
        },
        onDismiss: () => setLoading(false),
      });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  const StepComponent = step < STEP_COMPONENTS.length ? STEP_COMPONENTS[step] : null;
  const isReview = step === STEP_SCHEMAS.length;
  const totalSteps = STEP_TITLES.length;

  return (
    <PageShell>
      <section className="py-10 px-4 md:px-6">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="tag-brand mb-4 inline-flex">Offline AI Event 2026</div>
            <h1 className="font-serif text-3xl md:text-4xl text-white mb-2">
              Register for {SITE_NAME}
            </h1>
            <p className="text-white/50 text-sm">
              Secure your spot — only ₹{REGISTRATION_FEE} · One day · Offline · Hands-on
            </p>
          </div>

          {/* Registration Card */}
          <div className="glass-card rounded-xl overflow-hidden">
            {/* Progress Bar */}
            <div className="p-5 border-b border-white/8">
              {/* Step Indicators */}
              <div className="flex items-center justify-between mb-3">
                {STEP_TITLES.map((title, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 flex-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-outfit transition-all duration-300 ${
                        i < step
                          ? 'bg-brand text-[#0a0b07]'
                          : i === step
                          ? 'bg-brand/20 border border-brand text-brand'
                          : 'bg-white/5 border border-white/10 text-white/30'
                      }`}
                    >
                      {i < step ? (
                        <span className="text-[#0a0b07] font-bold text-xs">done</span>
                      ) : (
                        String(i + 1)
                      )}
                    </div>
                    <span className={`text-[10px] hidden md:block font-medium transition-colors ${
                      i === step ? 'text-white' : i < step ? 'text-brand/70' : 'text-white/25'
                    }`}>
                      {title.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
              {/* Progress Line */}
              <div className="flex gap-1 mt-2">
                {STEP_TITLES.map((_, i) => (
                  <div
                    key={i}
                    className={`h-0.5 flex-1 transition-all duration-500 rounded-full ${
                      i <= step ? 'bg-brand' : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Form Content */}
            <FormProvider {...methods}>
              <div className="p-5 md:p-7">
                {/* Step Header */}
                <div className="mb-5">
                  <motion.h2
                    key={step}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                    className="font-serif text-xl text-white"
                  >
                    {STEP_TITLES[step]}
                  </motion.h2>
                  <p className="text-xs text-white/35 mt-1">
                    Step {step + 1} of {totalSteps}
                  </p>
                </div>

                {/* Step Content */}
                <motion.div
                  key={`content-${step}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="scroll-panel"
                  style={{ maxHeight: 'calc(100vh - 380px)', minHeight: '300px' }}
                >
                  {StepComponent && <StepComponent />}
                  {isReview && <ReviewStep data={formData} />}
                </motion.div>

                {/* Error */}
                {error && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-xs text-red-400">{error}</p>
                  </div>
                )}

                {/* Navigation */}
                <div className="mt-6 flex justify-between gap-3 pt-5 border-t border-white/8">
                  {step > 0 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="btn-secondary text-sm px-5"
                      disabled={loading}
                    >
                      Back
                    </button>
                  ) : (
                    <div />
                  )}

                  <div className="flex items-center gap-3">
                    {!isReview && (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="btn-primary text-sm px-6"
                        id={`step-${step}-next-btn`}
                      >
                        Continue
                      </button>
                    )}
                    {isReview && (
                      <button
                        type="button"
                        onClick={handleSubmit(onPay)}
                        className="btn-primary text-sm px-6"
                        disabled={loading}
                        id="pay-now-btn"
                      >
                        {loading ? 'Processing...' : `Pay ₹${REGISTRATION_FEE} and Confirm`}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </FormProvider>
          </div>

          {/* Trust Badges */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-5 text-xs text-white/30">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
              Secure Razorpay Payment
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
              Instant Confirmation Email
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
              Event Pass on Registration
            </span>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
