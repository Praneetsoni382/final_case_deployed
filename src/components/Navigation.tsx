import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import {
  Menu,
  X,
  Sparkles,
  Target,
  TrendingUp,
  Flame,
  BookOpen,
  Gift,
  FolderArchive,
  MessageSquare,
  User as UserIcon,
  Bell,
  LogOut,
  Users,
  Compass,
  Award,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface NavigationProps {
  onOpenNotifications: () => void;
  onOpenAuth: (initialMode?: 'login' | 'register', role?: 'student' | 'teacher') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onOpenNotifications, onOpenAuth }) => {
  const { user, currentView, navigate, logout, unreadMessages, unreadNotifications } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 bg-white/85">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Logo & Core Mantra */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                if (user) {
                  navigate(user.role === 'student' ? 'student_dashboard' : 'teacher_dashboard');
                } else {
                  navigate('landing');
                }
              }}
              className="flex items-center space-x-2.5 text-left group transition"
            >
              <div className="w-10 h-10 rounded-xl bg-[#0c2340] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900 block leading-tight">
                  MANAV
                </span>
                <span className="text-[11px] font-medium text-slate-600 tracking-wide block uppercase">
                  Awakening Human Potential
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {!user ? (
              <>
                <button
                  onClick={() => navigate('landing')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    currentView === 'landing' ? 'text-[#0c2340] bg-slate-100 font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Home
                </button>
                <a
                  href="#how-it-works"
                  onClick={() => { if (currentView !== 'landing') navigate('landing'); }}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 transition"
                >
                  How It Works
                </a>
                <a
                  href="#growth-dimensions"
                  onClick={() => { if (currentView !== 'landing') navigate('landing'); }}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 transition"
                >
                  Five Dimensions
                </a>
                <div className="h-4 w-px bg-slate-200 mx-2" />
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth('register', 'student')}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#0c2340] hover:bg-[#14325a] shadow-sm transition hover:shadow"
                >
                  Get Started
                </button>
              </>
            ) : user.role === 'student' ? (
              <>
                <button
                  onClick={() => navigate('student_dashboard')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    currentView === 'student_dashboard' ? 'text-[#0c2340] bg-slate-100 font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('student_test')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${
                    currentView === 'student_test' ? 'text-[#0c2340] bg-slate-100 font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Target className="w-4 h-4 text-slate-700" />
                  <span>Daily Test</span>
                </button>
                <button
                  onClick={() => navigate('growth')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${
                    currentView === 'growth' ? 'text-[#0c2340] bg-slate-100 font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 text-slate-700" />
                  <span>My Growth</span>
                </button>
                <button
                  onClick={() => navigate('reflection_journal')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${
                    currentView === 'reflection_journal' ? 'text-[#0c2340] bg-slate-100 font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span>Journal</span>
                </button>
                <button
                  onClick={() => navigate('rewards')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${
                    currentView === 'rewards' ? 'text-[#0c2340] bg-slate-100 font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Gift className="w-4 h-4 text-amber-600" />
                  <span>Rewards</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('teacher_dashboard')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    currentView === 'teacher_dashboard' ? 'text-[#0c2340] bg-slate-100 font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Student Cohort
                </button>
                <button
                  onClick={() => navigate('storage')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${
                    currentView === 'storage' ? 'text-[#0c2340] bg-slate-100 font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FolderArchive className="w-4 h-4 text-amber-600" />
                  <span>Resources</span>
                </button>
              </>
            )}
          </div>

          {/* Right Action Icons & Hamburger */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {user && (
              <>
                {/* Messages Icon */}
                <button
                  onClick={() => navigate('messages')}
                  className="relative p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                  title="Messages"
                >
                  <MessageSquare className="w-5 h-5" />
                  {unreadMessages > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-amber-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                      {unreadMessages}
                    </span>
                  )}
                </button>

                {/* Notifications Icon */}
                <button
                  onClick={onOpenNotifications}
                  className="relative p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
              </>
            )}

            {/* Hamburger Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 transition"
              aria-label="Toggle navigation drawer"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Smooth Glassmorphism Side Panel Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={closeMenu}
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-sm sm:max-w-md bg-white/95 backdrop-blur-2xl border-l border-slate-200 h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto animate-in slide-in-from-right duration-200">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0c2340] flex items-center justify-center text-white shadow-sm">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900 leading-tight">MANAV</h3>
                    <p className="text-xs text-slate-600 font-medium">Awakening Human Potential</p>
                  </div>
                </div>
                <button
                  onClick={closeMenu}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Profile Card if Logged In */}
              {user ? (
                <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900">{user.fullName}</span>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-200 text-slate-800 capitalize">
                          {user.role}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
                    </div>
                  </div>
                  {user.role === 'student' && user.pairingCode && (
                    <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Student Pairing Code:</span>
                      <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300">
                        {user.pairingCode}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-5 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-900">MANAV Principle</p>
                  <p className="text-sm font-medium text-slate-800 mt-1 italic">
                    “Marks show what a student knows. MANAV helps a student see who they are becoming.”
                  </p>
                </div>
              )}

              {/* Navigation Items */}
              <div className="mt-6 space-y-1.5">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Navigation</p>
                
                {!user ? (
                  <>
                    <button
                      onClick={() => { navigate('landing'); closeMenu(); }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition text-left"
                    >
                      <span className="flex items-center space-x-3">
                        <Compass className="w-4 h-4 text-slate-700" />
                        <span>Home & Mission</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                    <button
                      onClick={() => { onOpenAuth('login', 'student'); closeMenu(); }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition text-left"
                    >
                      <span className="flex items-center space-x-3">
                        <Users className="w-4 h-4 text-slate-700" />
                        <span>Student Portal</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                    <button
                      onClick={() => { onOpenAuth('login', 'teacher'); closeMenu(); }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition text-left"
                    >
                      <span className="flex items-center space-x-3">
                        <Award className="w-4 h-4 text-amber-600" />
                        <span>Teacher Portal</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  </>
                ) : user.role === 'student' ? (
                  <>
                    <button
                      onClick={() => { navigate('student_dashboard'); closeMenu(); }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition text-left ${
                        currentView === 'student_dashboard' ? 'bg-[#0c2340] text-white font-semibold' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="flex items-center space-x-3">
                        <Compass className="w-4 h-4" />
                        <span>Student Dashboard</span>
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { navigate('student_test'); closeMenu(); }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition text-left ${
                        currentView === 'student_test' ? 'bg-[#0c2340] text-white font-semibold' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="flex items-center space-x-3">
                        <Target className="w-4 h-4" />
                        <span>🎯 Today's Development Test</span>
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { navigate('growth'); closeMenu(); }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition text-left ${
                        currentView === 'growth' ? 'bg-[#0c2340] text-white font-semibold' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="flex items-center space-x-3">
                        <TrendingUp className="w-4 h-4" />
                        <span>📈 My Growth (5 Parameters)</span>
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { navigate('reflection_journal'); closeMenu(); }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition text-left ${
                        currentView === 'reflection_journal' ? 'bg-[#0c2340] text-white font-semibold' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="flex items-center space-x-3">
                        <BookOpen className="w-4 h-4 text-amber-300" />
                        <span>🪞 Reflection Journal</span>
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { navigate('rewards'); closeMenu(); }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition text-left ${
                        currentView === 'rewards' ? 'bg-[#0c2340] text-white font-semibold' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="flex items-center space-x-3">
                        <Gift className="w-4 h-4 text-amber-300" />
                        <span>🎁 My Rewards</span>
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { navigate('storage'); closeMenu(); }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition text-left ${
                        currentView === 'storage' ? 'bg-[#0c2340] text-white font-semibold' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="flex items-center space-x-3">
                        <FolderArchive className="w-4 h-4 text-amber-300" />
                        <span>📁 My Storage</span>
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { navigate('messages'); closeMenu(); }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition text-left ${
                        currentView === 'messages' ? 'bg-[#0c2340] text-white font-semibold' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="flex items-center space-x-3">
                        <MessageSquare className="w-4 h-4 text-amber-300" />
                        <span>💬 Teacher Messages</span>
                      </span>
                      {unreadMessages > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white">
                          {unreadMessages}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => { navigate('profile'); closeMenu(); }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition text-left ${
                        currentView === 'profile' ? 'bg-[#0c2340] text-white font-semibold' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="flex items-center space-x-3">
                        <UserIcon className="w-4 h-4" />
                        <span>⚙️ Development Goals & Profile</span>
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { navigate('teacher_dashboard'); closeMenu(); }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition text-left ${
                        currentView === 'teacher_dashboard' ? 'bg-[#0c2340] text-white font-semibold' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="flex items-center space-x-3">
                        <Users className="w-4 h-4" />
                        <span>Student Cohort List</span>
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { navigate('storage'); closeMenu(); }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition text-left ${
                        currentView === 'storage' ? 'bg-[#0c2340] text-white font-semibold' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="flex items-center space-x-3">
                        <FolderArchive className="w-4 h-4" />
                        <span>Educational Storage</span>
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { navigate('messages'); closeMenu(); }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition text-left ${
                        currentView === 'messages' ? 'bg-[#0c2340] text-white font-semibold' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="flex items-center space-x-3">
                        <MessageSquare className="w-4 h-4" />
                        <span>Student Messages</span>
                      </span>
                      {unreadMessages > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white">
                          {unreadMessages}
                        </span>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-200 space-y-3">
              {user ? (
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition border border-rose-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      onOpenAuth('login');
                      closeMenu();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => {
                      onOpenAuth('register', 'student');
                      closeMenu();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-[#0c2340] hover:bg-[#14325a] shadow-sm transition"
                  >
                    Register as Student
                  </button>
                  <button
                    onClick={() => {
                      onOpenAuth('register', 'teacher');
                      closeMenu();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 transition"
                  >
                    Register as Teacher
                  </button>
                </div>
              )}

              <div className="pt-2 text-center text-[11px] text-slate-400">
                MANAV Platform • Built for Genuine Human Potential
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
