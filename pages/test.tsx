import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PageShell } from '@/components/Layout';
import { SiteHeader } from '@/components/SiteHeader';

interface ScenarioData {
  scenario_id: string;
  Employees: number;
  "Average Age": number;
  "Average Past Service": number;
  "Average Salary": number;
  "Base PBO": number;
  "Salary Increase (%)": number;
  "Discount Rate (%)": number;
  "Attrition (%)": number;
  Duration: number;
  "Test Sensitivity": string;
}

interface ValidationResult {
  result: string;
  correct_pbo: number;
  percentage_difference: number;
}

export default function Test() {
  const [scenario, setScenario] = useState<ScenarioData | null>(null);
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadScenario();
  }, []);

  const loadScenario = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/start-test');
      const data: ScenarioData = await res.json();
      setScenario(data);
      setSliderValue(data["Base PBO"]);
      setLoading(false);
    } catch (error) {
      console.error('Error loading scenario:', error);
      setLoading(false);
    }
  };

  const formatSensitivity = (code: string): string => {
    const parts = code.split(" ");
    const type = parts[0];
    const value = parseInt(parts[1]);

    const pct = Math.abs(value) / 100;
    const sign = value > 0 ? "+" : "-";

    if (type === "DR") {
      return `Discount Rate ${sign}${pct}%`;
    } else {
      return `Salary Increase ${sign}${pct}%`;
    }
  };

  const submitAnswer = async () => {
    if (!scenario) return;

    try {
      setSubmitting(true);
      setSubmitError(null);

      const res = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario_id: scenario.scenario_id,
          user_pbo: sliderValue,
          base_pbo: scenario['Base PBO'],
          internal_pct_change: (scenario as any)['Internal % Change'],
        })
      });

      const data: ValidationResult & { error?: string } = await res.json();
      if (!res.ok) {
        const message = data?.error || 'Failed to validate';
        throw new Error(message);
      }

      // Navigate to result page with outcome details
      router.push({
        pathname: '/result',
        query: {
          outcome: data.result,
          pct: data.percentage_difference?.toString() ?? '',
          correctPbo: data.correct_pbo?.toString() ?? '',
        },
      });
    } catch (error) {
      console.error('Error submitting answer:', error);
      const message = error instanceof Error ? error.message : 'Unable to submit answer. Please try again.';
      setSubmitError(message);
    }
    finally {
      setSubmitting(false);
    }
  };

  const getPercentageChange = (): string => {
    if (!scenario) return "0.00";
    const pct = ((sliderValue - scenario["Base PBO"]) / scenario["Base PBO"] * 100);
    return pct.toFixed(2);
  };

  const formatLiabilityDisplay = (value: number): string => {
    // Show a compact value (e.g., 65000 becomes 65) for the UI text below the slider.
    return (value / 1000).toFixed(0);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-10">
          <div className="text-base sm:text-lg text-gray-600">Loading scenario...</div>
        </div>
      );
    }

    if (!scenario) {
      return (
        <div className="flex items-center justify-center py-10">
          <div className="text-base sm:text-lg text-red-600">Failed to load scenario</div>
        </div>
      );
    }

    return (
      <>
        <div className="bg-white rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.12)] border border-gray-100 overflow-hidden">
          <div className="p-5 sm:p-6 md:p-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 md:p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold text-gray-700">No. of Employees:</span>
                  <span className="text-gray-900">{scenario.Employees}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold text-gray-700">Average Age:</span>
                  <span className="text-gray-900">{scenario["Average Age"]} Years</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold text-gray-700">Average Past Service:</span>
                  <span className="text-gray-900">{scenario["Average Past Service"]} Years</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold text-gray-700">Average Salary:</span>
                  <span className="text-gray-900">₹{scenario["Average Salary"].toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold text-gray-700">Salary Increase Rate:</span>
                  <span className="text-gray-900">{scenario["Salary Increase (%)"]}%</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold text-gray-700">Discount Rate:</span>
                  <span className="text-gray-900">{scenario["Discount Rate (%)"]}%</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold text-gray-700">Attrition Rate:</span>
                  <span className="text-gray-900">{scenario["Attrition (%)"]}%</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold text-gray-700">Duration:</span>
                  <span className="text-gray-900">{scenario.Duration} Years</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t-2 border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="font-bold text-gray-800 text-base sm:text-lg">Base PBO:</span>
                  <span className="font-bold text-primary text-lg sm:text-xl">
                    ₹{scenario["Base PBO"]} Lakhs
                  </span>
                </div>
                <div className="mt-3 bg-yellow-50 p-3 rounded border border-yellow-200 text-xs sm:text-sm">
                  <span className="font-bold text-gray-800">Guess the PBO at: </span>
                  <span className="font-bold text-primary">
                    {formatSensitivity(scenario["Test Sensitivity"])}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 md:p-6 mb-6">
              <p className="font-semibold text-gray-800 mb-4 text-sm sm:text-base">
                Choose Revised Liability (₹ Lakhs)
              </p>

              <div className="mb-2 text-center text-xs sm:text-sm text-gray-700">
                Change: {getPercentageChange()}%
              </div>

              <div className="mb-4">
                <input
                  type="range"
                  min={scenario["Base PBO"] * 0.75}
                  max={scenario["Base PBO"] * 1.25}
                  step={0.1}
                  value={sliderValue}
                  onChange={(e) => setSliderValue(parseFloat(e.target.value))}
                  aria-label="Choose revised liability (₹ Lakhs)"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs sm:text-sm bg-gray-50 p-4 rounded">
                <div>
                  <span className="text-gray-600">Selected Liability: </span>
                  <span className="font-bold text-gray-900">
                    ₹{formatLiabilityDisplay(sliderValue)} Lakhs
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Change from Base: </span>
                  <span
                    className={`font-bold ${
                      parseFloat(getPercentageChange()) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {getPercentageChange()}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-center mb-6">
              <button
                onClick={submitAnswer}
                disabled={submitting}
                className="min-w-[180px] bg-primary hover:bg-primary-dark disabled:bg-primary/60 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md text-sm sm:text-base"
              >
                {submitting ? 'Submitting...' : 'Submit Answer'}
              </button>
            </div>

            {submitError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {submitError}
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <Head>
        <title>Sentest Quiz</title>
        <meta name="description" content="Take the Sentest quiz test" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <PageShell>
        <SiteHeader
          title="Sentest quiz"
          subtitle="Take a quick quiz and stand a chance to win surprise gift."
        />
        {renderContent()}
      </PageShell>
    </>
  );
}
