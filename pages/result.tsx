import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { PageShell } from '@/components/Layout';
import { SiteHeader } from '@/components/SiteHeader';

export default function ResultPage() {
  const router = useRouter();
  const { outcome, pct, correctPbo } = router.query;

  const isCorrect = outcome === 'Correct';
  const pctDiff = typeof pct === 'string' ? parseFloat(pct) : NaN;
  const correctValue = typeof correctPbo === 'string' ? parseFloat(correctPbo) : NaN;

  const hasData = typeof outcome === 'string';

  // If the page is loaded/refreshed without result data, send user back to registration.
  useEffect(() => {
    if (!router.isReady) return;
    if (!hasData) {
      router.replace('/register');
    }
  }, [router, hasData]);

  // While redirecting, render nothing to avoid a flash of the empty state.
  if (!hasData) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Sentest Quiz</title>
        <meta name="description" content="Your Sentest quiz result." />
      </Head>

      <PageShell>
        <SiteHeader
          title="Result"
        />

        <div
          className={`bg-white rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.12)] border p-6 sm:p-8 max-w-xl mx-auto text-center relative overflow-hidden ${
            isCorrect ? 'border-green-200' : 'border-red-200'
          }`}
        >
          <div
            className={`absolute inset-x-0 top-0 h-1 ${
              isCorrect ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-rose-400 to-rose-600'
            }`}
            aria-hidden="true"
          />
          <div className="mb-4">
            <span className="text-4xl">
              {isCorrect ? '🎉' : '❌'}
            </span>
          </div>
          <h2
            className={`text-2xl font-extrabold mb-2 ${
              isCorrect ? 'text-green-700' : 'text-red-700'
            }`}
          >
            {isCorrect
              ? 'Congratulations, you are correct!'
              : 'Sorry!!! Thank you for participating.'}
          </h2>

          <div className="mt-4 space-y-2 text-sm text-gray-700">
            {!Number.isNaN(correctValue) && (
              <p>
                Correct PBO:{' '}
                <span className="font-semibold">
                  ₹{correctValue} Lakhs
                </span>
              </p>
            )}
          </div>
        </div>
      </PageShell>
    </>
  );
}
