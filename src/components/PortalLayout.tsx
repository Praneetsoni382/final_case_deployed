import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import dtuLogo from '../assets/images/dtu_official_logo_match_1791324125893.jpg';
import swamiVivekanandaImg from '../assets/images/swami_vivekananda_1791312815482.jpg';
import {
  LayoutDashboard,
  Target,
  TrendingUp,
  BookOpen,
  Gift,
  FolderArchive,
  MessageSquare,
  User as UserIcon,
  Bell,
  LogOut,
  Users,
  Copy,
  Check,
  ChevronRight,
  Flame,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { api } from '../lib/api.ts';

interface PortalLayoutProps {
  children: React.ReactNode;
  onOpenNotifications: () => void;
}

export const PortalLayout: React.FC<PortalLayoutProps> = ({
  children,
  onOpenNotifications,
}) => {
  const { user, currentView, navigate, logout, unreadMessages, unreadNotifications } = useAuth();
  const [copiedCode, setCopiedCode] = useState(false);
  const [streakDays, setStreakDays] = useState<number>(0);
  const [todayTestDone, setTodayTestDone] = useState<boolean>(false);

  useEffect(() => {
    if (user?.role === 'student') {
      api.getStreak().then(res => {
        setStreakDays(res.streak?.currentStreak || 0);
      }).catch(() => {});

      api.getTodayTest().then(res => {
        setTodayTestDone(res.test?.status === 'completed');
      }).catch(() => {});
    }
  }, [user, currentView]);

  const copyCode = () => {
    if (user?.pairingCode) {
      navigator.clipboard.writeText(user.pairingCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const studentNavItems = [
    {
      id: 'student_dashboard',
      label: 'My Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'student_test',
      label: 'Daily Task',
      icon: Target,
      badge: todayTestDone ? 'Done' : 'Pending',
      badgeColor: todayTestDone ? 'bg-slate-200 text-slate-800' : 'bg-amber-100 text-amber-900 border border-amber-300',
    },
    {
      id: 'growth',
      label: 'My Growth',
      icon: TrendingUp,
      badge: null,
    },
    {
      id: 'reflection_journal',
      label: 'Growth Journal',
      icon: BookOpen,
      badge: null,
    },
    {
      id: 'rewards',
      label: 'My Rewards',
      icon: Gift,
      badge: null,
    },
    {
      id: 'storage',
      label: 'Resource Storage',
      icon: FolderArchive,
      badge: null,
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      badge: unreadMessages > 0 ? `${unreadMessages}` : null,
      badgeColor: 'bg-amber-500 text-white font-bold',
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: UserIcon,
      badge: null,
    },
  ];

  const teacherNavItems = [
    {
      id: 'teacher_dashboard',
      label: 'Teacher Dashboard',
      icon: Users,
      badge: null,
    },
    {
      id: 'storage',
      label: 'Storage Area',
      icon: FolderArchive,
      badge: null,
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      badge: unreadMessages > 0 ? `${unreadMessages}` : null,
      badgeColor: 'bg-amber-500 text-white font-bold',
    },
  ];

  const navItems = user?.role === 'teacher' ? teacherNavItems : studentNavItems;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* 1. TOP INSTITUTIONAL ACCESSIBILITY & IDENTITY BAR (Matches Landing Page Theme) */}
      <div className="bg-[#0c2340] text-slate-200 text-[11px] sm:text-xs py-2 px-4 sm:px-8 border-b border-[#16355d] shrink-0">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: DTU Identity */}
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-amber-300/60 bg-white shadow-2xs">
              <img
                src={dtuLogo}
                alt="Delhi Technological University (DTU) Official Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-semibold tracking-wide text-white">
              Delhi Technological University
            </span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-slate-300 hidden sm:inline">
              MANAV Human Potential Portal
            </span>
          </div>

          {/* Right: Core Philosophy Motto */}
          <div className="flex items-center space-x-3 text-slate-300">
            <span className="italic font-serif text-[11px] sm:text-xs text-amber-200/90 hidden md:inline">
              «Marks show what a student knows. MANAV helps a student see who they are becoming.»
            </span>
            <button
              onClick={() => navigate('landing')}
              className="text-slate-300 hover:text-white transition underline underline-offset-2 text-[11px]"
            >
              Public Home
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN INSTITUTIONAL BANNER (DTU Logo + Brand + Vivekananda Quote + User Status) */}
      <header className="bg-white py-3.5 px-4 sm:px-8 border-b border-slate-200/90 shadow-xs shrink-0">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: DTU Official Seal & Title */}
          <div
            onClick={() => navigate(user?.role === 'student' ? 'student_dashboard' : 'teacher_dashboard')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full border-2 border-[#800000] bg-white shadow-xs flex items-center justify-center p-0.5 shrink-0 overflow-hidden ring-2 ring-red-100">
              <img
                src={dtuLogo}
                alt="Delhi Technological University Official Seal"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <div className="text-[11px] font-bold text-red-950 uppercase leading-none tracking-tight">
                DELTECH • ESTD. 1941
              </div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                DELHI TECHNOLOGICAL UNIVERSITY
              </h1>
              <p className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">
                MANAV — Education That Awakens Human Potential
              </p>
            </div>
          </div>

          {/* Right: Swami Vivekananda Quote + Notification Bell + User Profile Badge + Logout */}
          <div className="flex items-center flex-wrap justify-end gap-3 sm:gap-4">
            {/* Vivekananda Quote Box */}
            <div className="hidden lg:flex items-center space-x-2.5 bg-gradient-to-r from-amber-50 to-orange-50/60 py-1.5 px-3 rounded-xl border border-amber-200/70 shadow-xs max-w-xs">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-600/80 shrink-0 bg-amber-100">
                <img
                  src={swamiVivekanandaImg}
                  alt="Swami Vivekananda"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="text-[11px] leading-tight text-slate-800">
                <p className="font-serif italic line-clamp-1">
                  “Arise, awake, and stop not...”
                </p>
                <p className="font-bold text-amber-950 text-[10px]">
                  — Swami Vivekananda
                </p>
              </div>
            </div>

            {/* Notifications Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition shadow-xs"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {/* User Profile Pill */}
            <div className="flex items-center space-x-2.5 pl-2 sm:pl-3 border-l border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-[#0c2340] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                {user?.fullName.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {user?.fullName || 'User'}
                </div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  {user?.role === 'teacher' ? 'Faculty Mentor' : 'Student'}
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="p-2 rounded-xl text-slate-500 hover:text-rose-700 hover:bg-rose-50 transition border border-transparent hover:border-rose-200"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 3. 20% by 80% RATIO LAYOUT CONTAINER */}
      <div className="max-w-[1600px] w-full mx-auto px-3 sm:px-6 py-6 flex-1 flex flex-col md:flex-row gap-6 items-start">
        {/* ============================================================== */}
        {/* LEFT COLUMN: EXACT 20% RATIO (Navigation Column of Dashboards) */}
        {/* ============================================================== */}
        <aside className="w-full md:w-[20%] shrink-0 flex flex-col gap-4 sticky top-4">
          {/* Main Navigation Column Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-3 space-y-1">
            <div className="px-3 py-2 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
              <span>Navigation Menu</span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">20% Area</span>
            </div>

            <div className="flex flex-col space-y-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id as any)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition text-left ${
                      isActive
                        ? 'bg-[#0c2340] text-white shadow-sm ring-1 ring-[#0c2340]'
                        : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/90'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                          item.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600')
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Student Status & Pairing Code Card in 20% Column */}
          {user?.role === 'student' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3.5">
              {/* Streak Counter */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/70 border border-amber-200/80">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block leading-none">
                      Day Streak
                    </span>
                    <span className="text-base font-extrabold text-amber-950 font-mono">
                      {streakDays} Days
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-full">
                  Active
                </span>
              </div>

              {/* Pairing Code */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Teacher Pairing Code
                </span>
                <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="font-mono text-sm font-extrabold text-slate-900 tracking-wider">
                    {user?.pairingCode || 'MM-0000'}
                  </span>
                  <button
                    onClick={copyCode}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
                    title="Copy Pairing Code"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-amber-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                  Give this code to your teacher to link with their classroom cohort.
                </p>
              </div>

              {/* Institutional Quote */}
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 italic font-serif leading-snug">
                «Marks show what a student knows. MANAV helps a student see who they are becoming.»
              </div>
            </div>
          )}

          {/* Teacher Status Card in 20% Column */}
          {user?.role === 'teacher' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Faculty Account
                </span>
                <span className="text-sm font-bold text-slate-900 block mt-0.5">
                  {user.fullName}
                </span>
                <span className="text-xs text-slate-500 block truncate">
                  {user.email}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-950 leading-relaxed font-medium">
                Supervise student developmental daily tests, evaluate reflections, and upload learning resources permanently.
              </div>
            </div>
          )}
        </aside>

        {/* =============================================================== */}
        {/* RIGHT COLUMN: EXACT 80% RATIO (Majority of Dashboard In View)  */}
        {/* =============================================================== */}
        <main className="w-full md:w-[80%] min-w-0 flex-1">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-7 md:p-8 min-h-[680px]">
            {children}
          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500 shrink-0">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © Delhi Technological University • MANAV Human Development System
          </span>
          <span className="font-serif italic text-slate-600">
            “Education is the manifestation of the perfection already in man.” — Swami Vivekananda
          </span>
        </div>
      </footer>
    </div>
  );
};
