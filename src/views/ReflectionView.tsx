import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { DailyTest, Reflection, StreakInfo } from '../types/index.ts';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Compass,
} from 'lucide-react';

export const ReflectionView: React.FC = () => {
  const { navigate } = useAuth();

  const [test, setTest] = useState<DailyTest | null>(null);
  const [existingReflection, setExistingReflection] = useState<Reflection | null>(null);

  // Form inputs
  const [mainReflection, setMainReflection] = useState('');
  const [whatLearned, setWhatLearned] = useState('');
  const [improveTomorrow, setImproveTomorrow] = useState('');
  const [thoughtProvokingAnswer, setThoughtProvokingAnswer] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{
    reflection: Reflection;
    streak: StreakInfo;
    milestoneReached: boolean;
  } | null>(null);

  useEffect(() => {
    const fetchContext = async () => {
      try {
        setLoading(true);
        const res = await api.getTodayTest();
        setTest(res.test);

        if (res.test.status !== 'completed') {
          // Redirect to test if not completed yet
          navigate('student_test');
          return;
        }

        // Check if reflection already submitted
        const refRes = await api.getReflections();
        const found = refRes.reflections.find(r => r.testId === res.test.id);
        if (found) {
          setExistingReflection(found);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load test details.');
      } finally {
        setLoading(false);
      }
    };

    fetchContext();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!test) return;
    setError(null);

    if (mainReflection.trim().length < 10) {
      setError('Please provide a thoughtful reflection of at least 10 characters.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.submitReflection({
        testId: test.id,
        mainReflection: mainReflection.trim(),
        whatLearned: whatLearned.trim(),
        improveTomorrow: improveTomorrow.trim(),
        thoughtProvokingAnswer: thoughtProvokingAnswer.trim(),
        relatedDevelopmentAreas: test.growthParametersAffected || ['Consistency', 'Self-awareness'],
      });

      setSuccessResult({
        reflection: res.reflection,
        streak: res.streak,
        milestoneReached: res.milestoneReached,
      });

      if (res.milestoneReached) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit reflection.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500">Opening your personal reflection space...</p>
        </div>
      </div>
    );
  }

  // If already submitted or just successfully submitted
  if (existingReflection || successResult) {
    const currentRef = successResult?.reflection || existingReflection!;
    const streakInfo = successResult?.streak;

    return (
      <div className="max-w-2xl mx-auto py-8 text-center space-y-5 animate-in fade-in">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center mx-auto shadow-xs border border-slate-200">
          <CheckCircle2 className="w-7 h-7 text-slate-900" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900">
          Daily Cycle Completed
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Your reflection for {currentRef.date} has been permanently recorded in your personal journal.
        </p>

        {/* Milestone or Streak Banner */}
        <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 inline-block text-left w-full shadow-xs">
          <div className="flex items-center space-x-2 text-[11px] font-bold uppercase tracking-wider text-amber-800 mb-1">
            <Flame className="w-4 h-4 text-amber-600" />
            <span>Active Consistency Streak</span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-amber-950">
            🔥 {streakInfo?.currentStreak ?? 'Active'} Days Consecutive
          </div>
          {successResult?.milestoneReached && (
            <p className="text-xs text-amber-900 mt-1.5 font-medium">
              Milestone achieved! Your teacher has been notified of your 7-day consistency commitment.
            </p>
          )}
        </div>

        {/* Recorded Reflection Summary */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 text-left shadow-xs space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            What today's questions made you realize:
          </span>
          <p className="text-xs sm:text-sm text-slate-800 italic leading-relaxed">
            "{currentRef.mainReflection}"
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          <button
            onClick={() => navigate('reflection_journal')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0c2340] hover:bg-[#14325a] text-white font-bold text-xs shadow-sm transition"
          >
            View In Reflection Journal
          </button>
          <button
            onClick={() => navigate('student_dashboard')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition border border-slate-200"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-[#0c2340] via-[#14325a] to-slate-900 text-white shadow-md relative overflow-hidden">
        <div className="flex items-center space-x-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-1.5">
          <BookOpen className="w-4 h-4" />
          <span>Mandatory Daily Self-Inquiry</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">
          Daily Reflection Journal
        </h1>
        <p className="text-xs sm:text-sm text-slate-200 mt-1.5 leading-relaxed font-light">
          «Marks show what a student knows. MANAV helps a student see who they are becoming.»
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Reflection Form */}
      <form onSubmit={handleSubmit} className="p-5 sm:p-7 rounded-2xl bg-white border border-slate-200 space-y-5">
        {/* Core Prompt */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-1 flex items-center space-x-2">
            <span className="w-5 h-5 rounded-md bg-amber-100 text-amber-900 flex items-center justify-center text-[11px] font-extrabold">
              1
            </span>
            <span className="font-serif text-base">
              What did today's questions make you realize about yourself? *
            </span>
          </label>
          <p className="text-xs text-slate-500 mb-2 pl-7">
            Look at where resistance or ease arose during today's choices.
          </p>
          <textarea
            required
            rows={4}
            value={mainReflection}
            onChange={e => setMainReflection(e.target.value)}
            placeholder="Write your honest observation here..."
            className="w-full p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-600 bg-slate-50/50 leading-relaxed"
          />
        </div>

        {/* Optional prompt 2 */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            What did you learn? (Optional)
          </label>
          <input
            type="text"
            value={whatLearned}
            onChange={e => setWhatLearned(e.target.value)}
            placeholder="e.g. In group conflicts, my impulse is to avoid rather than clarify with patience."
            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-600 bg-slate-50/50"
          />
        </div>

        {/* Optional prompt 3 */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            What do you want to improve tomorrow? (Optional)
          </label>
          <input
            type="text"
            value={improveTomorrow}
            onChange={e => setImproveTomorrow(e.target.value)}
            placeholder="e.g. Taking 5 minutes to plan before beginning work, regardless of mood."
            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-600 bg-slate-50/50"
          />
        </div>

        {/* Optional prompt 4 */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Which answer made you think the most? (Optional)
          </label>
          <input
            type="text"
            value={thoughtProvokingAnswer}
            onChange={e => setThoughtProvokingAnswer(e.target.value)}
            placeholder="e.g. The question on admitting a mistake to the team without excuses."
            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-600 bg-slate-50/50"
          />
        </div>

        {/* Submit */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Records growth evidence for Consistency & Willingness
          </span>
          <button
            type="submit"
            disabled={submitting || mainReflection.trim().length < 10}
            className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition disabled:opacity-50 flex items-center space-x-2"
          >
            {submitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Recording Reflection...</span>
              </>
            ) : (
              <>
                <span>Complete Daily Cycle</span>
                <CheckCircle2 className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
