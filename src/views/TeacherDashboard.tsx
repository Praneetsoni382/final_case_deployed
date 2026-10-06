import React, { useEffect, useState } from 'react';
import { api } from '../lib/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { User, ParameterGrowth } from '../types/index.ts';
import { SendRewardModal } from '../components/SendRewardModal.tsx';
import {
  Users,
  Target,
  Flame,
  BookOpen,
  Gift,
  MessageSquare,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  TrendingUp,
  ChevronRight,
  UserCheck,
} from 'lucide-react';

interface RichStudent extends User {
  developmentGoals: string[];
  struggles: string[];
  currentStreak: number;
  todayTestCompleted: boolean;
  latestReflectionDate: string | null;
  parameters: ParameterGrowth[];
}

export const TeacherDashboard: React.FC = () => {
  const { user, navigate } = useAuth();

  const [students, setStudents] = useState<RichStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [pairModalOpen, setPairModalOpen] = useState(false);
  const [pairingCodeInput, setPairingCodeInput] = useState('');
  const [pairingLoading, setPairingLoading] = useState(false);
  const [pairingError, setPairingError] = useState<string | null>(null);
  const [pairingSuccess, setPairingSuccess] = useState<string | null>(null);

  // Send Reward Modal state
  const [rewardModalStudent, setRewardModalStudent] = useState<{ id: string; name: string } | null>(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.getTeacherStudents();
      setStudents(res.students as any);
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handlePairStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setPairingError(null);
    setPairingSuccess(null);

    if (!pairingCodeInput.trim()) {
      setPairingError('Please enter a student pairing code or email.');
      return;
    }

    try {
      setPairingLoading(true);
      const res = await api.pairStudent(pairingCodeInput.trim());
      setPairingSuccess(res.message);
      setPairingCodeInput('');
      fetchStudents();
      setTimeout(() => {
        setPairModalOpen(false);
        setPairingSuccess(null);
      }, 1500);
    } catch (err: any) {
      setPairingError(err.message || 'Could not connect student.');
    } finally {
      setPairingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500">Loading student cohort records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0c2340] via-[#14325a] to-slate-900 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold mb-3 border border-white/15">
            <Users className="w-3.5 h-3.5" />
            <span>Teacher Supervision Portal</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-serif">
            Welcome, {user?.fullName || 'Teacher'} 👋
          </h1>
          <p className="text-sm text-slate-200 mt-2 max-w-xl">
            Observe student progress, read reflections, encourage milestones, and award real resources to nurture human potential.
          </p>
        </div>

        {/* Pair Student Button */}
        <button
          onClick={() => setPairModalOpen(true)}
          className="px-6 py-3 rounded-2xl bg-[#0c2340] hover:bg-[#14325a] text-white font-bold text-xs shadow-md border border-white/20 transition flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>Connect New Student</span>
        </button>
      </div>

      {/* Educational Storage Quick Action Card */}
      <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#0c2340] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Gift className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Educational Storage Area
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Upload files directly from your computer to store them permanently and make them available to your student cohort.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 w-full sm:w-auto">
          <button
            onClick={() => navigate('storage')}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#0c2340] hover:bg-[#14325a] text-white font-bold text-xs shadow-sm transition flex items-center justify-center space-x-1.5"
          >
            <span>Open & Upload Storage Files</span>
            <ChevronRight className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      </div>

      {/* Cohort Overview Stat Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Connected Students
          </span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 block font-mono">
            {students.length}
          </span>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Tests Completed Today
          </span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 block font-mono">
            {students.filter(s => s.todayTestCompleted).length}
          </span>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Active Streaks
          </span>
          <span className="text-2xl font-extrabold text-amber-600 mt-1 block font-mono">
            {students.filter(s => s.currentStreak > 0).length}
          </span>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            7+ Day Milestones
          </span>
          <span className="text-2xl font-extrabold text-purple-700 mt-1 block font-mono">
            {students.filter(s => s.currentStreak >= 7).length}
          </span>
        </div>
      </div>

      {/* Student List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-serif text-slate-900">
            Student Development Cohort
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {students.length} Authorized Students
          </span>
        </div>

        {students.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <Users className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-lg text-slate-900">No Students Connected Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Ask your students for their 6-character Pairing Code (e.g. MM-8492) or enter their registered email address to link them to your dashboard.
            </p>
            <button
              onClick={() => setPairModalOpen(true)}
              className="px-6 py-2.5 rounded-2xl bg-[#0c2340] text-white font-bold text-xs shadow-md"
            >
              Connect Student Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {students.map(student => (
              <div
                key={student.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-slate-400 hover:shadow-md transition flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
              >
                {/* Left: Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-lg text-slate-900">{student.fullName}</h3>
                    {student.age && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold">
                        Age {student.age}
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-900 border border-slate-300 text-xs font-mono font-bold">
                      {student.pairingCode}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        student.todayTestCompleted
                          ? 'bg-slate-100 text-slate-900 border border-slate-300'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                    >
                      {student.todayTestCompleted ? 'Today’s Test Completed ✓' : 'Today’s Test Pending'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">{student.email}</p>

                  {/* Goals & Struggles Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {student.developmentGoals.slice(0, 3).map(g => (
                      <span
                        key={g}
                        className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-800 text-[10px] font-semibold border border-slate-200"
                      >
                        Goal: {g}
                      </span>
                    ))}
                    {student.struggles.slice(0, 2).map(s => (
                      <span
                        key={s}
                        className="px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-900 text-[10px] font-semibold border border-amber-200"
                      >
                        Struggle: {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Center: Streak & Reflection Date */}
                <div className="flex items-center space-x-6 shrink-0 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Streak</span>
                    <span className="font-extrabold text-base text-amber-600 flex items-center font-mono">
                      🔥 {student.currentStreak} Days
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Last Reflection</span>
                    <span className="font-semibold text-slate-700">
                      {student.latestReflectionDate || 'None recorded'}
                    </span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 w-full lg:w-auto">
                  <button
                    onClick={() => setRewardModalStudent({ id: student.id, name: student.fullName })}
                    className="flex-1 lg:flex-none px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition flex items-center justify-center space-x-1.5"
                  >
                    <Gift className="w-3.5 h-3.5 text-amber-600" />
                    <span>Reward</span>
                  </button>
                  <button
                    onClick={() => navigate('messages')}
                    className="flex-1 lg:flex-none px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold transition flex items-center justify-center space-x-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
                    <span>Message</span>
                  </button>
                  <button
                    onClick={() => navigate('teacher_student_detail', student.id)}
                    className="flex-1 lg:flex-none px-4 py-2 rounded-xl bg-[#0c2340] hover:bg-[#14325a] text-white text-xs font-bold transition flex items-center justify-center space-x-1.5"
                  >
                    <span>View Profile</span>
                    <ChevronRight className="w-3.5 h-3.5 text-amber-300" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Connect Student Modal */}
      {pairModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">Connect Student Account</h3>
              <button
                onClick={() => setPairModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Enter the student's unique 6-character Pairing Code (displayed on their dashboard as MM-XXXX) or their registered email address.
            </p>

            {pairingError && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{pairingError}</span>
              </div>
            )}
            {pairingSuccess && (
              <div className="p-3 rounded-xl bg-slate-100 text-slate-900 border border-slate-300 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{pairingSuccess}</span>
              </div>
            )}

            <form onSubmit={handlePairStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pairing Code or Email
                </label>
                <input
                  type="text"
                  required
                  value={pairingCodeInput}
                  onChange={e => setPairingCodeInput(e.target.value)}
                  placeholder="e.g. MM-4821 or student@example.edu"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-800 uppercase font-mono"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPairModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pairingLoading}
                  className="px-5 py-2.5 rounded-xl bg-[#0c2340] hover:bg-[#14325a] text-white text-xs font-bold shadow-md transition disabled:opacity-50"
                >
                  {pairingLoading ? 'Connecting...' : 'Authorize Connection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send Reward Modal */}
      {rewardModalStudent && (
        <SendRewardModal
          isOpen={true}
          onClose={() => setRewardModalStudent(null)}
          studentId={rewardModalStudent.id}
          studentName={rewardModalStudent.name}
          onRewardSent={() => {
            fetchStudents();
          }}
        />
      )}
    </div>
  );
};
