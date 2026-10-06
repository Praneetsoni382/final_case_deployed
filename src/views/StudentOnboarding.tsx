import React, { useState } from 'react';
import { api } from '../lib/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import {
  Sparkles,
  Check,
  ArrowRight,
  Target,
  AlertCircle,
  RefreshCw,
  Compass,
} from 'lucide-react';

const QUALITIES_LIST = [
  'Technical Skills',
  'Communication Skills',
  'Self-Reliance',
  'Faith',
  'Confidence',
  'Initiative',
  'Responsibility',
  'Leadership',
  'Discipline',
  'Empathy',
  'Patience',
  'Decision Making',
  'Creativity',
];

const STRUGGLES_LIST = [
  'Lack of Confidence',
  'Lack of Consistency',
  'Lack of Faith',
  'Lack of Willingness',
  'Lack of Perseverance',
  'Difficulty Communicating',
  'Lack of Self-Reliance',
  'Lack of Patience',
  'Lack of Harmony',
  'Procrastination',
  'Fear of Failure',
];

export const StudentOnboarding: React.FC = () => {
  const { user, setOnboardingCompleted, navigate } = useAuth();

  const [selectedGoals, setSelectedGoals] = useState<string[]>(['Communication Skills', 'Self-Reliance']);
  const [selectedStruggles, setSelectedStruggles] = useState<string[]>(['Lack of Consistency', 'Procrastination']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev =>
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const toggleStruggle = (struggle: string) => {
    setSelectedStruggles(prev =>
      prev.includes(struggle) ? prev.filter(s => s !== struggle) : [...prev, struggle]
    );
  };

  const handleSave = async () => {
    setError(null);
    if (selectedGoals.length === 0) {
      setError('Please select at least one quality you want to develop.');
      return;
    }
    if (selectedStruggles.length === 0) {
      setError('Please select at least one area you feel you struggle with.');
      return;
    }

    try {
      setLoading(true);
      await api.saveStudentProfile({
        developmentGoals: selectedGoals,
        struggles: selectedStruggles,
      });
      setOnboardingCompleted(true);
      navigate('student_dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to save development profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-10">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Student Development Setup</span>
          </div>
          <h1 className="text-3xl font-extrabold font-serif text-slate-900">
            Welcome, {user?.fullName || 'Student'} 👋
          </h1>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            MANAV personalizes your daily development questions and insights based on who you choose to become.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center space-x-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-10">
          {/* Question 1 */}
          <div>
            <div className="flex items-center space-x-2.5 mb-1">
              <span className="w-7 h-7 rounded-xl bg-[#0c2340] text-white flex items-center justify-center text-xs font-bold">
                1
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Which qualities do you want to develop?
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4 pl-9.5">
              Select all that apply. These define your primary growth intentions.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pl-0 sm:pl-9.5">
              {QUALITIES_LIST.map(quality => {
                const isSelected = selectedGoals.includes(quality);
                return (
                  <button
                    key={quality}
                    type="button"
                    onClick={() => toggleGoal(quality)}
                    className={`p-3 rounded-2xl text-xs font-semibold text-left border transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                        : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span>{quality}</span>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 ml-1.5">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question 2 */}
          <div>
            <div className="flex items-center space-x-2.5 mb-1">
              <span className="w-7 h-7 rounded-xl bg-amber-600 text-white flex items-center justify-center text-xs font-bold">
                2
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                What are you currently struggling with or feel you need to improve?
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4 pl-9.5">
              Be honest with yourself. Real self-awareness is where genuine development begins.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pl-0 sm:pl-9.5">
              {STRUGGLES_LIST.map(struggle => {
                const isSelected = selectedStruggles.includes(struggle);
                return (
                  <button
                    key={struggle}
                    type="button"
                    onClick={() => toggleStruggle(struggle)}
                    className={`p-3 rounded-2xl text-xs font-semibold text-left border transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-50 border-amber-500 text-amber-950 shadow-xs'
                        : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span>{struggle}</span>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 ml-1.5">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            You can modify these goals anytime in your profile.
          </p>
          <button
            type="button"
            disabled={loading || selectedGoals.length === 0 || selectedStruggles.length === 0}
            onClick={handleSave}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#0c2340] hover:bg-[#14325a] text-white font-bold text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <span>Begin Development Journey</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
