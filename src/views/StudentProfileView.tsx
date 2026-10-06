import React, { useEffect, useState } from 'react';
import { api } from '../lib/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { StudentProfile } from '../types/index.ts';
import {
  User as UserIcon,
  Target,
  Sparkles,
  Check,
  Save,
  AlertCircle,
  CheckCircle2,
  Copy,
  ArrowLeft,
  RefreshCw,
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

export const StudentProfileView: React.FC = () => {
  const { user, navigate } = useAuth();

  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedStruggles, setSelectedStruggles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.getStudentProfile();
        if (res.profile) {
          setSelectedGoals(res.profile.developmentGoals || []);
          setSelectedStruggles(res.profile.struggles || []);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const toggleGoal = (g: string) => {
    setSelectedGoals(prev => (prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]));
  };

  const toggleStruggle = (s: string) => {
    setSelectedStruggles(prev => (prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSavedSuccess(false);

    if (selectedGoals.length === 0) {
      setError('Please select at least one quality you want to develop.');
      return;
    }
    if (selectedStruggles.length === 0) {
      setError('Please select at least one area you struggle with.');
      return;
    }

    try {
      setSaving(true);
      await api.saveStudentProfile({
        developmentGoals: selectedGoals,
        struggles: selectedStruggles,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const copyCode = () => {
    if (user?.pairingCode) {
      navigator.clipboard.writeText(user.pairingCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-[#0c2340] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500">Loading student development profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            <UserIcon className="w-4 h-4 text-amber-600" />
            <span>Profile & Growth Targets</span>
          </div>
          <h1 className="text-3xl font-extrabold font-serif text-slate-900">
            Development Goals & Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            These preferences directly influence your daily 10-question tests and development insights.
          </p>
        </div>
        <button
          onClick={() => navigate('student_dashboard')}
          className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition flex items-center space-x-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
      </div>

      {/* Account Info Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base text-slate-900">{user?.fullName}</h3>
          <p className="text-xs text-slate-500">{user?.email} • Age {user?.age}</p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
          <div className="text-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Pairing Code</span>
            <span className="font-mono font-bold text-slate-900 text-sm">{user?.pairingCode}</span>
          </div>
          <button
            onClick={copyCode}
            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
            title="Copy code"
          >
            {copiedCode ? <Check className="w-4 h-4 text-amber-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center space-x-2.5">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-slate-100 border border-slate-300 text-slate-900 text-sm flex items-center space-x-2.5">
          <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />
          <span>Development goals updated successfully. Future tests will reflect these changes.</span>
        </div>
      )}

      {/* Edit Goals Form */}
      <form onSubmit={handleSave} className="space-y-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        {/* Question 1: Qualities */}
        <div>
          <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-lg bg-[#0c2340] text-white text-xs font-bold flex items-center justify-center">
              1
            </span>
            <span>Qualities you want to develop:</span>
          </h3>
          <p className="text-xs text-slate-500 mb-4 pl-8">
            Select the virtues and skills you are deliberately cultivating.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pl-0 sm:pl-8">
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

        {/* Question 2: Struggles */}
        <div>
          <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-lg bg-amber-600 text-white text-xs font-bold flex items-center justify-center">
              2
            </span>
            <span>What you are currently struggling with or need to improve:</span>
          </h3>
          <p className="text-xs text-slate-500 mb-4 pl-8">
            Areas where resistance, procrastination, or doubt arise.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pl-0 sm:pl-8">
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

        {/* Save button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-2xl bg-[#0c2340] hover:bg-[#14325a] text-white font-bold text-xs shadow-md transition disabled:opacity-50 flex items-center space-x-2"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-amber-300" />}
            <span>Save Development Goals</span>
          </button>
        </div>
      </form>
    </div>
  );
};
