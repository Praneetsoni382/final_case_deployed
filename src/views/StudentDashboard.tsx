import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../lib/api.ts';
import {
  DailyTest,
  StreakInfo,
  ParameterGrowth,
  Reward,
  Reflection,
} from '../types/index.ts';
import {
  Target,
  TrendingUp,
  Flame,
  BookOpen,
  Gift,
  MessageSquare,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Shield,
  Copy,
  Check,
  ChevronRight,
  Award,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user, navigate, unreadMessages } = useAuth();

  const [todayTest, setTodayTest] = useState<DailyTest | null>(null);
  const [reflectionSubmitted, setReflectionSubmitted] = useState<boolean>(false);
  const [streak, setStreak] = useState<StreakInfo | null>(null);
  const [parameters, setParameters] = useState<ParameterGrowth[]>([]);
  const [latestReflection, setLatestReflection] = useState<Reflection | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [testRes, streakRes, growthRes, reflectionsRes, rewardsRes] = await Promise.allSettled([
        api.getTodayTest(),
        api.getStreak(),
        api.getGrowth(),
        api.getReflections(),
        api.getMyRewards(),
      ]);

      if (testRes.status === 'fulfilled') {
        setTodayTest(testRes.value.test);
        setReflectionSubmitted(testRes.value.reflectionSubmitted);
      }
      if (streakRes.status === 'fulfilled') {
        setStreak(streakRes.value.streak);
      }
      if (growthRes.status === 'fulfilled') {
        setParameters(growthRes.value.parameters);
      }
      if (reflectionsRes.status === 'fulfilled') {
        if (reflectionsRes.value.reflections.length > 0) {
          setLatestReflection(reflectionsRes.value.reflections[0]);
        }
      }
      if (rewardsRes.status === 'fulfilled') {
        setRewards(rewardsRes.value.rewards);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const copyPairingCode = () => {
    if (user?.pairingCode) {
      navigator.clipboard.writeText(user.pairingCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Loading your development workspace...</p>
        </div>
      </div>
    );
  }

  const isTestCompleted = todayTest?.status === 'completed';

  return (
    <div className="space-y-6">
      {/* Welcome Header (Clean, 100% full width, no overlapping boxes on right) */}
      <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-[#0c2340] via-[#14325a] to-slate-900 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 w-full">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold mb-2.5 border border-white/15">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Active Development Cycle</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">
            Welcome, {user?.fullName || 'Student'} 👋
          </h1>
          <div className="w-full overflow-hidden relative bg-transparent py-2 px-1 mt-3.5">
            <div className="animate-marquee-box-ltr whitespace-nowrap inline-block text-base sm:text-lg font-serif italic text-amber-300 font-bold">
              “Marks show what a student knows. MANAV helps a student see who they are becoming.”
            </div>
          </div>
        </div>
      </div>

      {/* TODAY'S DEVELOPMENT CHALLENGE & CONNECTION SIDE-BY-SIDE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Today's Challenge (2/3 width) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#0c2340] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Target className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Today's Challenge
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                {isTestCompleted
                  ? reflectionSubmitted
                    ? 'Daily Scenarios Completed • Review Your Growth Report'
                    : 'Scenarios Completed • Mandatory Reflection Pending'
                  : '10-Scenario Vivekananda Challenges Ready'}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                {isTestCompleted
                  ? reflectionSubmitted
                    ? 'Your decisions and reflection have contributed fresh observable evidence to your Vivekananda growth profile.'
                    : 'Review your growth report and synthesize today’s realizations in your daily reflection.'
                  : 'Engage with 10 realistic situational dilemmas to practice self-reliance, fearlessness, initiative, and critical thinking.'}
              </p>
            </div>
          </div>

          <div className="shrink-0 w-full sm:w-auto">
            {!isTestCompleted ? (
              <button
                onClick={() => navigate('student_test')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0c2340] hover:bg-[#14325a] text-white font-bold text-xs shadow-sm transition flex items-center justify-center space-x-2"
              >
                <span>Begin Today’s Scenarios</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : !reflectionSubmitted ? (
              <button
                onClick={() => navigate('reflection')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center space-x-2"
              >
                <span>Write Today’s Reflection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => navigate('reflection_journal')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center justify-center space-x-2"
              >
                <span>View Journal Entry</span>
                <BookOpen className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Teacher Pairing Code Card (1/3 width) */}
        <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-[#edf4fd] flex flex-col justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#0c2340] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Shield className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Teacher Connection
              </span>
              <h3 className="text-sm font-bold text-[#0c2340] mt-0.5">My Pairing Code</h3>
              <p className="text-[10px] text-slate-600 mt-0.5 leading-tight">
                Share this code with your teacher to link your profile.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between bg-white border border-blue-100 rounded-xl p-2.5 shadow-2xs">
            <span className="font-mono text-base font-extrabold text-slate-900 tracking-wider">
              {user?.pairingCode || 'MM-0000'}
            </span>
            <button
              onClick={copyPairingCode}
              className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 transition flex items-center space-x-1"
              title="Copy code"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[10px] font-bold text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold">Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 6 PRIMARY DASHBOARD CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* 1. 🎯 Today's Scenario Challenges */}
        <div
          onClick={() => navigate('student_test')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 hover:shadow-md cursor-pointer transition flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
                <Target className="w-5 h-5 text-slate-900" />
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  isTestCompleted
                    ? 'bg-slate-100 text-slate-800 border border-slate-300'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}
              >
                {isTestCompleted ? 'Completed' : 'Pending'}
              </span>
            </div>
            <h3 className="font-bold text-base text-slate-900">🎯 Daily Scenario Challenges</h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              {isTestCompleted
                ? `Completed for today. Vivekananda Human Development Growth Report is ready for review.`
                : '10 scenario-based dilemmas exercising self-reliance, initiative, and critical thinking.'}
            </p>
          </div>
          <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900">
            <span>{isTestCompleted ? 'Review Growth Report' : 'Take 10-Scenario Challenge'}</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* 2. 📈 My Growth */}
        <div
          onClick={() => navigate('growth')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 hover:shadow-md cursor-pointer transition flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-slate-900" />
              </div>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                5 Parameters
              </span>
            </div>
            <h3 className="font-bold text-base text-slate-900">📈 My Growth</h3>
            <div className="mt-2.5 space-y-1.5">
              {parameters.slice(0, 3).map(p => (
                <div key={p.name} className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">{p.name}</span>
                  <span className="font-bold text-slate-900">{p.level} ({p.score})</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900">
            <span>View Growth Analytics & Charts</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* 3. 🔥 Consistency Streak */}
        <div
          onClick={() => navigate('growth')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 hover:shadow-md cursor-pointer transition flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
                <Flame className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-xs font-extrabold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                🔥 {streak?.currentStreak || 0} DAYS ACTIVE
              </span>
            </div>
            <h3 className="font-bold text-base text-slate-900">🔥 Consistency Streak</h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Track consecutive daily tests & reflections. Reach 7 consecutive days to unlock teacher milestone notifications.
            </p>
            {/* 7-day mini progress */}
            <div className="mt-3.5 flex items-center space-x-1.5">
              {[1, 2, 3, 4, 5, 6, 7].map(day => {
                const isPassed = (streak?.currentStreak || 0) >= day;
                return (
                  <div
                    key={day}
                    className={`flex-1 h-2 rounded-full ${
                      isPassed ? 'bg-amber-500' : 'bg-slate-200'
                    }`}
                    title={`Day ${day}`}
                  />
                );
              })}
            </div>
          </div>
          <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-800">
            <span>
              {streak?.currentStreak ? `${7 - (streak.currentStreak % 7)} days to next milestone` : 'Begin streak today'}
            </span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* 4. 🪞 Reflection */}
        <div
          onClick={() => navigate(reflectionSubmitted ? 'reflection_journal' : 'reflection')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 hover:shadow-md cursor-pointer transition flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-slate-900" />
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                reflectionSubmitted ? 'bg-slate-100 text-slate-800 border border-slate-300' : 'bg-slate-100 text-slate-600'
              }`}>
                {reflectionSubmitted ? 'Recorded Today' : 'Not Written'}
              </span>
            </div>
            <h3 className="font-bold text-base text-slate-900">🪞 Reflection</h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              {latestReflection
                ? `Latest from ${latestReflection.date}: "${latestReflection.mainReflection.substring(0, 75)}..."`
                : 'Pause daily to record inward discoveries, lessons learned, and intentions for tomorrow.'}
            </p>
          </div>
          <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900">
            <span>{reflectionSubmitted ? 'Open Reflection Journal' : 'Write Daily Reflection'}</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* 5. 🎁 My Rewards */}
        <div
          onClick={() => navigate('rewards')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 hover:shadow-md cursor-pointer transition flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
                <Gift className="w-5 h-5 text-slate-900" />
              </div>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                {rewards.length} Rewards Received
              </span>
            </div>
            <h3 className="font-bold text-base text-slate-900">🎁 My Rewards</h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Teacher encouragement resources, educational files, links, and guidance awarded for milestones.
            </p>
          </div>
          <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900">
            <span>View & Download Rewards</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* 6. 💬 Messages */}
        <div
          onClick={() => navigate('messages')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 hover:shadow-md cursor-pointer transition flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-slate-900" />
              </div>
              {unreadMessages > 0 ? (
                <span className="text-xs font-bold text-white bg-amber-600 px-2.5 py-0.5 rounded-full">
                  {unreadMessages} Unread
                </span>
              ) : (
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  Up to date
                </span>
              )}
            </div>
            <h3 className="font-bold text-base text-slate-900">💬 Teacher Messages</h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Private 1-on-1 dialogue with your teacher. Ask questions, receive encouragement, and discuss development goals.
            </p>
          </div>
          <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900">
            <span>Open Private Chat</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
