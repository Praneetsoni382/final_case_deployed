import React, { useEffect, useState } from 'react';
import { api } from '../lib/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import {
  User,
  StudentProfile,
  StreakInfo,
  ParameterGrowth,
  GrowthEvidence,
  DailyTest,
  Reflection,
  Reward,
  TeacherObservation,
  MainGrowthParameter,
} from '../types/index.ts';
import { SendRewardModal } from '../components/SendRewardModal.tsx';
import {
  ArrowLeft,
  Users,
  Target,
  Flame,
  BookOpen,
  Gift,
  MessageSquare,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Lock,
  Plus,
  Send,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface TeacherStudentDetailProps {
  studentId: string;
}

export const TeacherStudentDetailView: React.FC<TeacherStudentDetailProps> = ({ studentId }) => {
  const { navigate } = useAuth();

  const [student, setStudent] = useState<User | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [streak, setStreak] = useState<StreakInfo | null>(null);
  const [parameters, setParameters] = useState<ParameterGrowth[]>([]);
  const [evidenceHistory, setEvidenceHistory] = useState<GrowthEvidence[]>([]);
  const [testHistory, setTestHistory] = useState<DailyTest[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [observations, setObservations] = useState<TeacherObservation[]>([]);

  const [newObservation, setNewObservation] = useState('');
  const [observationSubmitting, setObservationSubmitting] = useState(false);
  const [observationSuccess, setObservationSuccess] = useState(false);

  const [rewardModalOpen, setRewardModalOpen] = useState(false);
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);
  const [expandedRefId, setExpandedRefId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const res = await api.getStudentDetail(studentId);
      setStudent(res.student);
      setProfile(res.profile);
      setStreak(res.streak);
      setParameters(res.parameters);
      setEvidenceHistory(res.evidenceHistory);
      setTestHistory(res.testHistory);
      setReflections(res.reflections);
      setRewards(res.rewards);
      setObservations(res.observations);
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve student development record.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [studentId]);

  const handleAddObservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObservation.trim() || observationSubmitting) return;

    try {
      setObservationSubmitting(true);
      const res = await api.addObservation(studentId, newObservation.trim());
      setObservations(prev => [res.observation, ...prev]);
      setNewObservation('');
      setObservationSuccess(true);
      setTimeout(() => setObservationSuccess(false), 3000);
      fetchStudentData(); // Refresh evidence
    } catch (err: any) {
      setError(err.message || 'Failed to save observation.');
    } finally {
      setObservationSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500">Loading comprehensive development records...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Student Record Not Found</h2>
        <button
          onClick={() => navigate('teacher_dashboard')}
          className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
        >
          Return to Cohort List
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <button
          onClick={() => navigate('teacher_dashboard')}
          className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition flex items-center space-x-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cohort</span>
        </button>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setRewardModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition flex items-center space-x-1.5"
          >
            <Gift className="w-4 h-4" />
            <span>Award Milestone Reward</span>
          </button>
          <button
            onClick={() => navigate('messages')}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md transition flex items-center space-x-1.5"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Direct Message</span>
          </button>
        </div>
      </div>

      {/* Student Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0c2340] via-[#14325a] to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-amber-300 border border-white/20 uppercase tracking-wider">
              Student Profile
            </span>
            <span className="text-xs text-slate-300 font-mono font-bold">
              Pairing Code: {student.pairingCode}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold font-serif text-white">{student.fullName}</h1>
          <p className="text-xs text-slate-200 mt-1">
            {student.email} • Age {student.age || 'N/A'} • Active since {new Date(student.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shrink-0 text-center">
          <span className="text-[10px] uppercase font-bold text-amber-300 block">Streak Record</span>
          <span className="text-2xl font-extrabold text-white font-mono flex items-center justify-center mt-0.5">
            🔥 {streak?.currentStreak || 0} Consecutive Days
          </span>
          <span className="text-[10px] text-slate-300 block mt-0.5">
            Longest: {streak?.longestStreak || 0} days
          </span>
        </div>
      </div>

      {/* Development Targets: Goals & Struggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <h3 className="font-bold text-slate-900 text-base mb-1 flex items-center space-x-2">
            <Target className="w-4 h-4 text-slate-800" />
            <span>Target Development Goals</span>
          </h3>
          <p className="text-xs text-slate-500 mb-3">Qualities the student declared they wish to cultivate.</p>
          <div className="flex flex-wrap gap-2">
            {profile?.developmentGoals.map(g => (
              <span
                key={g}
                className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold"
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <h3 className="font-bold text-slate-900 text-base mb-1 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Declared Areas of Struggle</span>
          </h3>
          <p className="text-xs text-slate-500 mb-3">Friction points the student honestly identified.</p>
          <div className="flex flex-wrap gap-2">
            {profile?.struggles.map(s => (
              <span
                key={s}
                className="px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* DEVELOPMENT PARAMETERS BAR CHART & AUDIT */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold font-serif text-slate-900">
              Human Potential Parameter Distribution
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Strictly non-judgmental progression derived from stored evidence records.
            </p>
          </div>
          <span className="text-xs text-slate-400 flex items-center space-x-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Evidence Immutable</span>
          </span>
        </div>

        {/* Bar Chart View */}
        <div className="pt-4 pb-2 overflow-x-auto">
          <div className="min-w-[550px] h-[220px] relative flex items-end justify-between gap-3 px-4 border-b border-slate-200">
            {/* Horizontal Grid */}
            {[100, 75, 50, 25, 0].map(val => (
              <div
                key={val}
                className="absolute left-0 right-0 border-b border-slate-100 flex items-center pointer-events-none"
                style={{ bottom: `${(val / 100) * 180}px` }}
              >
                <span className="text-[10px] font-mono font-semibold text-slate-400 -translate-y-2.5">
                  {val}
                </span>
              </div>
            ))}

            {parameters.map(p => {
              const height = Math.max(8, Math.min(100, (p.score / 100) * 180));
              return (
                <div key={p.name} className="flex-1 flex flex-col items-center group">
                  <span className="text-[10px] font-mono font-bold text-slate-700 mb-1">
                    {p.score}
                  </span>
                  <div className="w-full max-w-[36px] bg-slate-100 rounded-t h-[180px] flex items-end overflow-hidden p-0.5">
                    <div
                      style={{ height: `${height}px` }}
                      className="w-full rounded-t bg-[#0c2340] group-hover:bg-slate-700 transition-all duration-300"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 block mt-2 truncate max-w-[55px]" title={p.name}>
                    {p.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cards for parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          {parameters.map(p => (
            <div
              key={p.name}
              className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-xs text-slate-900 block">{p.name}</span>
                <span className="text-[11px] text-slate-500">{p.evidenceCount} Evidences Recorded</span>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white border border-slate-200 text-slate-800">
                  {p.level}
                </span>
                <span className="font-mono text-xs font-bold text-slate-700 block mt-0.5">
                  {p.score} / 100
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRIVATE TEACHER OBSERVATIONS SECTION */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-bold font-serif text-slate-900">
            Private Teacher Observations
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Record permanent observations regarding the student’s observable character development, team conduct, and attitude.
          </p>
        </div>

        {observationSuccess && (
          <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-300 text-slate-900 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
            <span>Observation recorded permanently and attached to the student’s growth audit.</span>
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleAddObservation} className="space-y-3">
          <textarea
            required
            rows={2}
            value={newObservation}
            onChange={e => setNewObservation(e.target.value)}
            placeholder="e.g. Student has become markedly more willing to express an honest viewpoint during recent activities..."
            className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-800 bg-slate-50/50 leading-relaxed"
          />
          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={observationSubmitting || !newObservation.trim()}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition disabled:opacity-40 flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Record Private Observation</span>
            </button>
          </div>
        </form>

        {/* Past Observations List */}
        <div className="space-y-2.5 pt-2">
          {observations.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No observations recorded yet.</p>
          ) : (
            observations.map(obs => (
              <div key={obs.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 space-y-1">
                <p className="text-xs text-slate-800 leading-relaxed italic font-serif">
                  "{obs.note}"
                </p>
                <div className="flex items-center space-x-2 text-[10px] text-slate-400 pt-1">
                  <span>Recorded by {obs.teacherName}</span>
                  <span>•</span>
                  <span>{obs.observedDate}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* STUDENT TEST HISTORY & REFLECTION ARCHIVES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Test History */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
            <Target className="w-4 h-4 text-slate-800" />
            <span>Test Submission History</span>
          </h3>
          <p className="text-xs text-slate-500">Historical answers cannot be altered by educators.</p>

          <div className="space-y-3">
            {testHistory.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No completed tests yet.</p>
            ) : (
              testHistory.map(t => {
                const isExpanded = expandedTestId === t.id;
                return (
                  <div key={t.id} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
                    <div
                      onClick={() => setExpandedTestId(isExpanded ? null : t.id)}
                      className="cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">{t.date}</span>
                        <span className="text-[11px] text-slate-800 font-semibold">
                          {t.alignmentRating || 'Completed Cycle'} • {t.strongAreas?.slice(0, 2).join(', ') || 'Self-Reliance'}
                        </span>
                      </div>
                      <button className="text-slate-400 p-1">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="pt-2 border-t border-slate-200 text-xs space-y-2">
                        {t.developmentInsight && (
                          <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-700 leading-relaxed whitespace-pre-line">
                            {t.developmentInsight}
                          </div>
                        )}
                        <div className="space-y-1.5">
                          {t.questions.map((q, idx) => {
                            const selected = q.options.find(opt => opt.id === q.studentSelectedOptionId);
                            return (
                              <div key={q.id} className="p-2 rounded-lg bg-white border border-slate-100 text-[11px]">
                                <span className="font-bold text-slate-800 block">Q{idx + 1}: {q.questionText}</span>
                                <span className="text-slate-900 font-medium block mt-0.5">
                                  Selected: {selected?.text || 'Not answered'}
                                </span>
                                {q.studentWrittenResponse && (
                                  <span className="text-slate-500 italic block mt-0.5">
                                    Thought: "{q.studentWrittenResponse}"
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Reflection Journal History */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span>Reflection Journal History</span>
          </h3>
          <p className="text-xs text-slate-500">Read the student’s daily self-inquiry and realizations.</p>

          <div className="space-y-3">
            {reflections.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No reflections recorded yet.</p>
            ) : (
              reflections.map(ref => {
                const isExpanded = expandedRefId === ref.id;
                return (
                  <div key={ref.id} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
                    <div
                      onClick={() => setExpandedRefId(isExpanded ? null : ref.id)}
                      className="cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">{ref.date}</span>
                        <span className="text-[11px] text-slate-500 line-clamp-1 italic">
                          "{ref.mainReflection}"
                        </span>
                      </div>
                      <button className="text-slate-400 p-1">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="pt-2 border-t border-slate-200 text-xs space-y-2">
                        <div className="p-3 rounded-xl bg-white border border-slate-200 italic font-serif text-slate-800 leading-relaxed">
                          "{ref.mainReflection}"
                        </div>
                        {ref.whatLearned && (
                          <div className="text-[11px] text-slate-600">
                            <strong>Learned:</strong> {ref.whatLearned}
                          </div>
                        )}
                        {ref.improveTomorrow && (
                          <div className="text-[11px] text-slate-600">
                            <strong>Tomorrow’s Focus:</strong> {ref.improveTomorrow}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Send Reward Modal */}
      {rewardModalOpen && (
        <SendRewardModal
          isOpen={true}
          onClose={() => setRewardModalOpen(false)}
          studentId={student.id}
          studentName={student.fullName}
          onRewardSent={() => {
            fetchStudentData();
          }}
        />
      )}
    </div>
  );
};
