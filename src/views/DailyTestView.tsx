import React, { useEffect, useState } from 'react';
import { api } from '../lib/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { DailyTest, DevelopmentQuestion } from '../types/index.ts';
import {
  Target,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  RefreshCw,
  Award,
  Compass,
  Lightbulb,
  Check,
  BookOpen,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  FileCheck,
} from 'lucide-react';

export const DailyTestView: React.FC = () => {
  const { navigate } = useAuth();

  const [test, setTest] = useState<DailyTest | null>(null);
  const [reflectionSubmitted, setReflectionSubmitted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [questionId: string]: {
      selectedOptionId: string;
      writtenResponse: string;
      hintsUsedCount: number;
    };
  }>({});
  const [revealedHints, setRevealedHints] = useState<{ [questionId: string]: number }>({});
  const [showHintsDrawer, setShowHintsDrawer] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodayTest = async () => {
    try {
      setLoading(true);
      const res = await api.getTodayTest();
      setTest(res.test);
      setReflectionSubmitted(res.reflectionSubmitted);

      // Populate already saved answers if viewing completed test
      if (res.test.status === 'completed') {
        const initialAnswers: any = {};
        res.test.questions.forEach(q => {
          if (q.studentSelectedOptionId) {
            initialAnswers[q.id] = {
              selectedOptionId: q.studentSelectedOptionId,
              writtenResponse: q.studentWrittenResponse || '',
              hintsUsedCount: q.hintsUsedCount || 0,
            };
          }
        });
        setSelectedAnswers(initialAnswers);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load today’s scenario challenges.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayTest();
  }, []);

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (test?.status === 'completed') return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: {
        selectedOptionId: optionId,
        writtenResponse: prev[questionId]?.writtenResponse || '',
        hintsUsedCount: prev[questionId]?.hintsUsedCount || revealedHints[questionId] || 0,
      },
    }));
  };

  const handleWrittenChange = (questionId: string, text: string) => {
    if (test?.status === 'completed') return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: {
        selectedOptionId: prev[questionId]?.selectedOptionId || '',
        writtenResponse: text,
        hintsUsedCount: prev[questionId]?.hintsUsedCount || revealedHints[questionId] || 0,
      },
    }));
  };

  const handleRevealNextHint = (questionId: string, maxHints: number) => {
    setRevealedHints(prev => {
      const current = prev[questionId] || 0;
      const nextLevel = Math.min(maxHints, current + 1);
      setSelectedAnswers(ansPrev => ({
        ...ansPrev,
        [questionId]: {
          selectedOptionId: ansPrev[questionId]?.selectedOptionId || '',
          writtenResponse: ansPrev[questionId]?.writtenResponse || '',
          hintsUsedCount: nextLevel,
        },
      }));
      return { ...prev, [questionId]: nextLevel };
    });
  };

  const handleSubmitTest = async () => {
    if (!test) return;
    setError(null);

    // Verify all 10 questions have selected options
    const missing = test.questions.filter(q => !selectedAnswers[q.id]?.selectedOptionId);
    if (missing.length > 0) {
      setError(`Please complete all 10 scenario decisions before submitting. (${missing.length} remaining)`);
      return;
    }

    const payloadAnswers = test.questions.map(q => ({
      questionId: q.id,
      selectedOptionId: selectedAnswers[q.id].selectedOptionId,
      writtenResponse: selectedAnswers[q.id].writtenResponse,
      hintsUsedCount: selectedAnswers[q.id].hintsUsedCount || 0,
    }));

    try {
      setSubmitting(true);
      const res = await api.submitTest({
        testId: test.id,
        answers: payloadAnswers,
      });
      setTest(res.test);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || 'Failed to submit scenario test.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-[#0c2340] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Loading today’s 10 human development scenarios...</p>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900">Scenarios Unavailable</h2>
        <p className="text-sm text-slate-600 mt-2">Could not retrieve today's challenge cycle. Please try again.</p>
        <button
          onClick={fetchTodayTest}
          className="mt-4 px-5 py-2.5 bg-[#0c2340] text-white rounded-xl text-xs font-bold hover:bg-[#14325a]"
        >
          Retry
        </button>
      </div>
    );
  }

  // ==========================================
  // COMPLETED VIEW: VIVEKANANDA GROWTH REPORT
  // ==========================================
  if (test.status === 'completed') {
    const report = test.growthReport;
    const highlightedFields = report?.highlightedKeyfields || test.strongAreas || ['Self-Reliance', 'Perseverance', 'Initiative'];
    const areasForImprovement = report?.areasForImprovement || test.areasNeedingAttention || ['Adaptability under Uncertainty', 'Judgement'];
    const evidenceList = report?.evidenceBreakdown || [];

    return (
      <div className="space-y-6 animate-in fade-in">
        {/* Header Banner - Zero Integer Score */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0c2340] via-[#14325a] to-slate-900 text-white shadow-md relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold mb-2.5 border border-white/15">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Vivekananda Human Development Evaluation</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">
                Today’s Growth Evidence Report
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 mt-1.5 max-w-2xl font-light">
                «Education is the manifestation of the perfection already in man.» — Observable decision evidence recorded across 10 situational dilemmas.
              </p>
            </div>

            {/* Qualitative Alignment Badge */}
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0 w-full sm:w-auto">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-300 block">
                Developmental Status
              </span>
              <div className="text-lg font-extrabold text-amber-300 mt-1 font-serif">
                {test.alignmentRating || 'Completed Cycle'}
              </div>
              <span className="text-[10px] text-slate-300/80 block mt-0.5">
                {test.date} • {test.completionTimeMinutes || 3} min
              </span>
            </div>
          </div>
        </div>

        {/* 1. Demonstrated Vivekananda Keyfields (Prominently Highlighted) */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0c2340] text-amber-300 flex items-center justify-center shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif">
                Demonstrated Vivekananda Keyfields
              </h3>
              <p className="text-xs text-slate-500">
                Core dimensions of human capability evidenced during today's scenario decisions
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-1">
            {highlightedFields.map(field => (
              <span
                key={field}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-xs flex items-center space-x-1.5 border border-slate-800"
              >
                <Check className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>{field}</span>
              </span>
            ))}
          </div>
        </div>

        {/* 2. Comprehensive Gemini AI Synthesis */}
        <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/80 space-y-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0c2340] text-amber-300 flex items-center justify-center shrink-0">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-serif">
              Developmental Synthesis & Philosophical Insight
            </h3>
          </div>
          <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed text-xs sm:text-sm whitespace-pre-line">
            {report?.synthesis || test.developmentInsight}
          </div>
        </div>

        {/* 3. Areas for Continued Discernment & Growth */}
        <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-amber-950 font-serif">
                Areas for Continued Reflection & Cultivation
              </h3>
              <p className="text-xs text-amber-800">
                Opportunities to practice deeper situational balance and proactive inquiry
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {areasForImprovement.map(area => (
              <span
                key={area}
                className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-950 text-xs font-semibold shadow-2xs flex items-center space-x-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>{area}</span>
              </span>
            ))}
          </div>
        </div>

        {/* 4. Where & How Observable Evidence Breakdown Matrix */}
        {evidenceList.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <FileCheck className="w-4 h-4 text-[#0c2340]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Observable Evidence Breakdown (Where & How Observed)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {evidenceList.map((ev, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2 hover:border-slate-300 transition"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-900 text-xs font-bold">
                      {ev.keyfield}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                        ev.level === 'Strong Evidence'
                          ? 'bg-slate-900 text-amber-300'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {ev.level}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Context / Where Observed:
                    </span>
                    <p className="text-xs font-semibold text-slate-800 mt-0.5">{ev.where}</p>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Evidence / How Demonstrated:
                    </span>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{ev.how}</p>
                  </div>

                  {ev.guidance && (
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                        Reflective Principle:
                      </span>
                      <p className="text-xs text-slate-700 italic leading-relaxed">«{ev.guidance}»</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Responsible Non-Diagnostic Notice */}
        <div className="p-4 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-600 leading-relaxed flex items-start space-x-2.5">
          <ShieldCheck className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-800 block mb-0.5">Responsible Evidence-Based Development Notice:</strong>
            {report?.disclaimer ||
              'Observable Evidence Notice: This system does not diagnose personality, psychology, IQ, morality, or character. It identifies observable evidence demonstrated from decision-making interactions with specific scenarios.'}
          </div>
        </div>

        {/* Mandatory Daily Reflection Action Banner */}
        <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-amber-950 text-sm">
              {reflectionSubmitted ? 'Daily Reflection Recorded in Growth Journal' : 'Mandatory Daily Reflection Required'}
            </h4>
            <p className="text-xs text-amber-800 mt-0.5">
              {reflectionSubmitted
                ? 'Your thoughts are permanently logged in your Growth Journal and contributed to your streak.'
                : 'Conclude today’s cycle by writing what today’s scenarios made you realize about your decision habits.'}
            </p>
          </div>
          <button
            onClick={() => navigate(reflectionSubmitted ? 'reflection_journal' : 'reflection')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center space-x-2 shrink-0"
          >
            <span>{reflectionSubmitted ? 'View In Journal' : 'Write Daily Reflection'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // ACTIVE TEST FLOW: SCENARIO-BASED MCQS
  // ==========================================
  const currentQ: DevelopmentQuestion = test.questions[currentIndex];
  const totalQuestions = test.questions.length;
  const currentAnswer = selectedAnswers[currentQ?.id];
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const answeredCount = Object.keys(selectedAnswers).filter(k => selectedAnswers[k]?.selectedOptionId).length;

  const currentHints = currentQ.hints || [];
  const revealedCount = revealedHints[currentQ.id] || 0;

  return (
    <div className="space-y-6">
      {/* Top Status & Progress Bar */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
          <span>Scenario {currentIndex + 1} of {totalQuestions}</span>
          <span>{answeredCount} of {totalQuestions} Decided</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#0c2340] to-slate-700 transition-all duration-300 rounded-full"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Active Scenario Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 space-y-5 shadow-xs">
        {/* Scenario Header & Keyfield Tags */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Scenario {currentIndex + 1} • {currentQ.title || 'Practical Dilemma'}
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {currentQ.relatedParameters?.map(p => (
                <span
                  key={p}
                  className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-bold"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Scenario Narrative Box */}
          {currentQ.scenario && (
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm leading-relaxed mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Context & Situation
              </span>
              {currentQ.scenario}
            </div>
          )}

          {/* Dilemma Question */}
          <h2 className="text-base sm:text-lg font-bold font-serif text-slate-900 leading-snug">
            {currentQ.questionText}
          </h2>
        </div>

        {/* 4 Balanced Options */}
        <div className="space-y-2.5 pt-1">
          {currentQ.options.map((opt, idx) => {
            const isSelected = currentAnswer?.selectedOptionId === opt.id;
            const letters = ['A', 'B', 'C', 'D'];
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectOption(currentQ.id, opt.id)}
                className={`w-full p-4 rounded-xl text-left border transition flex items-start space-x-3.5 group ${
                  isSelected
                    ? 'border-[#0c2340] bg-slate-100/90 shadow-xs ring-1 ring-[#0c2340]'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition mt-0.5 ${
                    isSelected
                      ? 'bg-[#0c2340] text-white'
                      : 'bg-slate-100 text-slate-700 border border-slate-200 group-hover:border-slate-300'
                  }`}
                >
                  {letters[idx]}
                </div>
                <p
                  className={`text-xs sm:text-sm leading-relaxed ${
                    isSelected ? 'text-slate-950 font-semibold' : 'text-slate-800'
                  }`}
                >
                  {opt.text}
                </p>
              </button>
            );
          })}
        </div>

        {/* Progressive 3-Tier Hint Section */}
        {currentHints.length > 0 && (
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowHintsDrawer(!showHintsDrawer)}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>
                  Reflective Hints {revealedCount > 0 ? `(${revealedCount}/${currentHints.length} viewed)` : '(Optional)'}
                </span>
                {showHintsDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showHintsDrawer && revealedCount < currentHints.length && (
                <button
                  type="button"
                  onClick={() => handleRevealNextHint(currentQ.id, currentHints.length)}
                  className="text-[11px] font-bold text-[#0c2340] hover:underline"
                >
                  Reveal Next Hint ({revealedCount + 1}/{currentHints.length})
                </button>
              )}
            </div>

            {showHintsDrawer && (
              <div className="mt-3 space-y-2">
                {revealedCount === 0 ? (
                  <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                    <span>Need perspective? You can view progressive hints to guide your thinking.</span>
                    <button
                      type="button"
                      onClick={() => handleRevealNextHint(currentQ.id, currentHints.length)}
                      className="px-3 py-1 rounded-lg bg-amber-600 text-white font-bold text-[11px] shrink-0 ml-2"
                    >
                      Show Hint 1
                    </button>
                  </div>
                ) : (
                  currentHints.slice(0, revealedCount).map(h => (
                    <div
                      key={h.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start space-x-2"
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {h.order}
                      </span>
                      <p className="leading-relaxed">{h.text}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Optional Written Reasoning */}
        <div className="pt-3 border-t border-slate-100">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Why did you choose this? <span className="text-slate-400 font-normal">(Optional reasoning — not required to submit)</span>
          </label>
          <textarea
            rows={2}
            value={currentAnswer?.writtenResponse || ''}
            onChange={e => handleWrittenChange(currentQ.id, e.target.value)}
            placeholder="Share why you made this choice or how you would handle the practical constraints..."
            className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0c2340]/20 focus:border-[#0c2340] bg-slate-50/50 leading-relaxed"
          />
        </div>
      </div>

      {/* Navigation & Submit Bar */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          disabled={currentIndex === 0}
          onClick={() => {
            setShowHintsDrawer(false);
            setCurrentIndex(prev => Math.max(0, prev - 1));
          }}
          className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition disabled:opacity-30 flex items-center space-x-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        {!isLastQuestion ? (
          <button
            type="button"
            onClick={() => {
              setShowHintsDrawer(false);
              setCurrentIndex(prev => Math.min(totalQuestions - 1, prev + 1));
            }}
            className="px-5 py-2 rounded-xl bg-[#0c2340] hover:bg-[#14325a] text-white font-bold text-xs shadow-sm transition flex items-center space-x-1.5"
          >
            <span>Next Scenario</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            disabled={submitting || answeredCount < totalQuestions}
            onClick={handleSubmitTest}
            className="px-6 py-2.5 rounded-xl bg-[#0c2340] hover:bg-[#14325a] text-white font-bold text-xs shadow-sm transition disabled:opacity-50 flex items-center space-x-2"
          >
            {submitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Vivekananda Growth Report...</span>
              </>
            ) : (
              <>
                <span>Submit 10 Scenarios</span>
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
