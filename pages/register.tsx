import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { PageShell } from '@/components/Layout';
import { SiteHeader } from '@/components/SiteHeader';

type RegistrationForm = {
  fullName: string;
  organization: string;
  phone: string;
  email: string;
};

type FormErrors = Partial<Record<keyof RegistrationForm, string>>;

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState<RegistrationForm>({
    fullName: '',
    organization: '',
    phone: '',
    email: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (field: keyof RegistrationForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: FormErrors = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName = 'Full name is required';
    }
    if (!form.phone.trim()) {
      nextErrors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9\s-]{7,15}$/.test(form.phone.trim())) {
      nextErrors.phone = 'Enter a valid phone number';
    }
    if (form.email.trim() && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i.test(form.email.trim())) {
      nextErrors.email = 'Enter a valid email';
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const submit = async () => {
      setSubmitting(true);
      setSubmitError(null);
      try {
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: form.fullName.trim(),
            organization: form.organization.trim() || null,
            phone: form.phone.trim(),
            email: form.email.trim() || null,
          }),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data?.error || 'Failed to submit registration');
        }

        router.push('/test');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Something went wrong';
        setSubmitError(message);
      } finally {
        setSubmitting(false);
      }
    };

    submit();
  };

  return (
    <>
      <Head>
        <title>Sentest Quiz</title>
        <meta name="description" content="Register to start the Sentest quiz" />
      </Head>

      <PageShell>
        <SiteHeader
          title="Take a Quick Test"
          subtitle="A perfect guess unlocks a surprise gift!!!"
        />

        <div className="bg-white rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.12)] border border-gray-100 overflow-hidden">
          <form className="p-6 sm:p-8 md:p-10 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Your details</h2>
                <p className="text-gray-600 text-sm md:text-base">
                  Enter your information to get started
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800" htmlFor="fullName">
                  Full name<span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange('fullName')}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
                />
                {errors.fullName && <p className="text-sm text-red-600">{errors.fullName}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800" htmlFor="organization">
                    Organization name <span className="text-gray-500">(optional)</span>
                  </label>
                  <input
                    id="organization"
                    name="organization"
                    value={form.organization}
                    onChange={handleChange('organization')}
                    placeholder="Organization name"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800" htmlFor="phone">
                    Phone<span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange('phone')}
                    placeholder="Phone number"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
                  />
                  {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800" htmlFor="email">
                  Email <span className="text-gray-500">(optional)</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  placeholder="you@email.com"
                  inputMode="email"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>

              <div className="flex items-center justify-end pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white font-semibold px-4 py-2 rounded-xl shadow-lg transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Starting...' : 'Start Test'}
                  <span className="ml-2 text-lg">→</span>
                </button>
              </div>

              {submitError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                  {submitError}
                </div>
              )}
          </form>
        </div>

      </PageShell>
    </>
  );
}
