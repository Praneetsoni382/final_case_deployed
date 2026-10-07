import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Target,
  Flame,
  TrendingUp,
  Heart,
  Users,
  Compass,
  BookOpen,
  Award,
  Sun,
  Moon,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  X,
  GraduationCap,
  Star,
  ExternalLink,
  Info,
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'register', role?: 'student' | 'teacher') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth }) => {
  // Accessibility & UI Controls
  const [fontSizeScale, setFontSizeScale] = useState<number>(1); // 0.9, 1, 1.1
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  // Modals for Header Links
  const [activeModal, setActiveModal] = useState<'how_it_works' | 'success_stories' | 'about_dtu' | null>(null);

  const scrollToDimensions = () => {
    const el = document.getElementById('five-dimensions-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={`min-h-screen text-slate-900 transition-colors duration-200 ${
        isHighContrast ? 'bg-slate-100 contrast-125' : 'bg-white'
      }`}
      style={{ fontSize: `${fontSizeScale * 100}%` }}
    >
      {/* 1. TOP NAVY ACCESSIBILITY & INSTITUTIONAL BAR */}
      <div className="bg-[#0c2340] text-slate-200 text-[11px] sm:text-xs py-2 px-4 sm:px-8 border-b border-[#16355d]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: DTU Identity */}
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-amber-300/60 bg-white shadow-2xs">
              <img
                src="/src/assets/images/dtu_official_logo_match_1791324125893.jpg"
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
              Education for a Stronger Nation
            </span>
          </div>

          {/* Right: Accessibility Controls & Language Toggle */}
          <div className="flex items-center space-x-3.5">
            <button
              onClick={() => {
                const el = document.getElementById('main-hero-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-slate-300 hover:text-white transition hidden md:inline"
            >
              Skip to Main Content
            </button>

            {/* Font Size Adjusters */}
            <div className="flex items-center space-x-1 border border-slate-600 rounded px-1.5 py-0.5 bg-[#122e50]">
              <button
                onClick={() => setFontSizeScale(1.1)}
                className={`px-1 font-bold ${fontSizeScale === 1.1 ? 'text-amber-300' : 'text-slate-300 hover:text-white'}`}
                title="Increase Font Size"
              >
                A+
              </button>
              <button
                onClick={() => setFontSizeScale(1)}
                className={`px-1 font-bold ${fontSizeScale === 1 ? 'text-amber-300' : 'text-slate-300 hover:text-white'}`}
                title="Normal Font Size"
              >
                A
              </button>
              <button
                onClick={() => setFontSizeScale(0.9)}
                className={`px-1 font-bold ${fontSizeScale === 0.9 ? 'text-amber-300' : 'text-slate-300 hover:text-white'}`}
                title="Decrease Font Size"
              >
                A-
              </button>
            </div>

            {/* High Contrast / Sun Toggle */}
            <button
              onClick={() => setIsHighContrast(!isHighContrast)}
              className="p-1 rounded text-slate-300 hover:text-amber-300 transition"
              title="Toggle High Contrast"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>

            {/* Language Switch */}
            <div className="flex items-center space-x-1 text-slate-300 font-medium">
              <button
                onClick={() => setLanguage('hi')}
                className={`hover:text-white transition ${language === 'hi' ? 'text-amber-300 font-bold' : ''}`}
              >
                Hindi
              </button>
              <span className="text-slate-500">|</span>
              <button
                onClick={() => setLanguage('en')}
                className={`hover:text-white transition ${language === 'en' ? 'text-amber-300 font-bold' : ''}`}
              >
                English
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN INSTITUTIONAL BANNER (DTU Official Seal + MANAV Application Brand) */}
      <header className="bg-white py-4 px-4 sm:px-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left: DTU Official Seal & Title */}
          <div className="flex items-center space-x-3.5">
            {/* DTU Circular Crest */}
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full border-2 border-[#800000] bg-white shadow-md flex items-center justify-center p-0.5 shrink-0 overflow-hidden ring-2 ring-red-100">
              <img
                src="/src/assets/images/dtu_official_logo_match_1791324125893.jpg"
                alt="Delhi Technological University (DTU) Official Seal"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain rounded-full"
              />
            </div>

            <div>
              <h2 className="text-sm sm:text-base font-bold text-red-950 leading-tight">
                दिल्ली प्रौद्योगिकी विश्वविद्यालय
              </h2>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-tight">
                DELHI TECHNOLOGICAL UNIVERSITY
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                (Formerly Delhi College of Engineering)
              </p>
            </div>
          </div>

          {/* Right: MANAV Application Brand (No middle obstruction!) */}
          <div className="flex items-center space-x-3 text-center sm:text-right">
            <div>
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-[#0c2340] font-serif leading-none">
                MANAV
              </div>
              <div className="text-[11px] sm:text-xs font-bold tracking-[0.2em] text-amber-800 uppercase mt-1">
                AWAKENING HUMAN POTENTIAL
              </div>
            </div>
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#0c2340] flex items-center justify-center shadow-md shadow-slate-900/10 text-white shrink-0">
              <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none">
                <path d="M16 6 C16 6 12 4 6 4 C6 18 10 24 16 26 C22 24 26 18 26 4 C20 4 16 6 16 6 Z" fill="rgba(255,255,255,0.15)" stroke="#ffffff" strokeWidth="1.5" />
                <path d="M16 11 L16 23 M10 16 L22 16" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="16" cy="11" r="2.5" fill="#f59e0b" />
                <path d="M11 21 C12 18 14 17 16 17 C18 17 20 18 21 21" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* 2.5. UNOBSTRUCTED MOVING TICKER STRIP (Left-to-Right Continuous Motion) */}
      <div className="w-full bg-gradient-to-r from-amber-50 via-orange-50/90 to-amber-50 py-2.5 border-b border-amber-200/90 overflow-hidden shadow-2xs relative z-30">
        <div className="animate-marquee-ltr flex items-center space-x-12">
          {/* Moving Box 1 */}
          <div className="inline-flex items-center space-x-3.5 bg-white/90 backdrop-blur-md px-5 py-2 rounded-2xl border border-amber-300/80 shadow-xs shrink-0">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-amber-600/80 shadow-xs shrink-0 bg-amber-100 ring-2 ring-amber-200">
              <img
                src="/src/assets/images/swami_vivekananda_1791312815482.jpg"
                alt="Swami Vivekananda"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="text-left">
              <p className="text-xs sm:text-sm font-serif italic text-slate-900 font-semibold leading-tight">
                “Arise, awake, and stop not till the goal is reached.”
              </p>
              <p className="text-[11px] font-extrabold text-amber-900 mt-0.5">
                — Swami Vivekananda
              </p>
            </div>
          </div>

          {/* Moving Box 2 */}
          <div className="inline-flex items-center space-x-3.5 bg-white/90 backdrop-blur-md px-5 py-2 rounded-2xl border border-amber-300/80 shadow-xs shrink-0">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-amber-600/80 shadow-xs shrink-0 bg-amber-100 ring-2 ring-amber-200">
              <img
                src="/src/assets/images/swami_vivekananda_1791312815482.jpg"
                alt="Swami Vivekananda"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="text-left">
              <p className="text-xs sm:text-sm font-serif italic text-slate-900 font-semibold leading-tight">
                “Education is the manifestation of the perfection already in man.”
              </p>
              <p className="text-[11px] font-extrabold text-amber-900 mt-0.5">
                — Swami Vivekananda
              </p>
            </div>
          </div>

          {/* Moving Box 3 */}
          <div className="inline-flex items-center space-x-3.5 bg-white/90 backdrop-blur-md px-5 py-2 rounded-2xl border border-amber-300/80 shadow-xs shrink-0">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-amber-600/80 shadow-xs shrink-0 bg-amber-100 ring-2 ring-amber-200">
              <img
                src="/src/assets/images/swami_vivekananda_1791312815482.jpg"
                alt="Swami Vivekananda"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="text-left">
              <p className="text-xs sm:text-sm font-serif italic text-slate-900 font-semibold leading-tight">
                “Self-belief is the biggest trait of human.”
              </p>
              <p className="text-[11px] font-extrabold text-amber-900 mt-0.5">
                — Swami Vivekananda
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. PRIMARY NAVY BLUE NAVIGATION BAR */}
      <nav className="bg-[#14325a] text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-14">
          {/* Main Navigation Links */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-6 overflow-x-auto text-xs sm:text-sm font-semibold">
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-1.5 py-1.5 px-2.5 rounded-lg text-white hover:bg-white/10 transition"
            >
              <span>🏠</span>
              <span>Home</span>
            </button>
            <button
              onClick={() => setActiveModal('how_it_works')}
              className="py-1.5 px-2.5 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition whitespace-nowrap"
            >
              How It Works
            </button>
            <button
              onClick={scrollToDimensions}
              className="py-1.5 px-2.5 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition whitespace-nowrap"
            >
              Five Dimensions
            </button>
            <button
              onClick={() => setActiveModal('success_stories')}
              className="py-1.5 px-2.5 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition whitespace-nowrap"
            >
              Success Stories
            </button>
            <button
              onClick={() => setActiveModal('about_dtu')}
              className="py-1.5 px-2.5 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition whitespace-nowrap"
            >
              About DTU
            </button>
            <button
              onClick={() => onOpenAuth('login')}
              className="py-1.5 px-2.5 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition whitespace-nowrap"
            >
              Sign In
            </button>
          </div>

          {/* Right Action: Get Started Button */}
          <button
            onClick={() => onOpenAuth('register', 'student')}
            className="px-4 sm:px-5 py-2 rounded-full bg-white text-[#14325a] hover:bg-slate-100 font-bold text-xs sm:text-sm shadow transition hover:scale-105 shrink-0 flex items-center space-x-1"
          >
            <span>Get Started</span>
            <span className="text-base leading-none">→</span>
          </button>
        </div>
      </nav>

      {/* 4. HERO SECTION */}
      <section id="main-hero-section" className="py-10 sm:py-16 px-4 sm:px-8 bg-gradient-to-b from-slate-50/50 to-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading, Subtitle & Action Buttons */}
          <div className="lg:col-span-6 space-y-6">
            {/* Small Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold">
              <GraduationCap className="w-4 h-4 text-blue-700" />
              <span>Empowering Students | Building a Better Tomorrow</span>
            </div>

            {/* Main Big Heading */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#103058] tracking-tight font-serif leading-none">
                MANAV
              </h1>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#173864] leading-tight">
                Education That Awakens Human Potential
              </h2>
            </div>

            {/* Description Paragraph */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              MANAV helps students choose the right path, build strong values, and develop the skills needed for a meaningful and successful future.
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => onOpenAuth('register', 'student')}
                className="px-7 py-3.5 rounded-xl bg-[#0d47a1] hover:bg-[#0b3c8a] text-white font-bold text-sm sm:text-base shadow-md transition hover:scale-[1.02] flex items-center justify-center space-x-2"
              >
                <span>Enter as Student</span>
                <span>→</span>
              </button>
              <button
                onClick={() => onOpenAuth('register', 'teacher')}
                className="px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-300 font-bold text-sm sm:text-base transition hover:scale-[1.02] flex items-center justify-center space-x-2 shadow-xs"
              >
                <Users className="w-4 h-4 text-slate-600" />
                <span>Enter as Teacher</span>
              </button>
            </div>
          </div>

          {/* Right Column: Joyful Children Photographic Banner */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 group">
              <img
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80"
                alt="Joyful diverse students raising hands in hope and excitement"
                className="w-full h-[320px] sm:h-[400px] object-cover object-center group-hover:scale-102 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/40 shadow-sm flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">
                  “Awakening the potential within every student.”
                </span>
                <span className="text-amber-800 font-semibold uppercase text-[10px] tracking-wider">
                  DTU Initiative
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FIVE DIMENSIONS CARDS SECTION */}
      <section id="five-dimensions-section" className="py-12 px-4 sm:px-8 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* 1. Confidence */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-slate-800" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1.5">
                1. Confidence
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Build self-belief and the courage to face new challenges.
              </p>
            </div>

            {/* 2. Consistency */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-4">
                <Flame className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1.5">
                2. Consistency
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Develop the habit of doing the right things, every day.
              </p>
            </div>

            {/* 3. Perseverance */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-slate-800" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1.5">
                3. Perseverance
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Stay focused, keep going, even when it's hard.
              </p>
            </div>

            {/* 4. Willingness */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-amber-700" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1.5">
                4. Willingness
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Be open to learning, feedback and new perspectives.
              </p>
            </div>

            {/* 5. Harmony */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-slate-800" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1.5">
                5. Harmony
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Balance your goals, relationships and well-being.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CARDS SECTION (Motto Quote + Stats & Start Your Journey) */}
      <section className="py-12 px-4 sm:px-8 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Card: Core Quote & Stats */}
          <div className="lg:col-span-7 bg-[#edf4fd] border border-blue-200/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs overflow-hidden">
            {/* Quote */}
            <div className="flex-1 flex flex-col justify-center items-center py-4 w-full">
              <div className="w-full overflow-hidden relative bg-transparent py-4 px-1">
                <div className="animate-marquee-box-ltr whitespace-nowrap inline-block text-2xl sm:text-3xl font-serif italic text-amber-600 font-extrabold drop-shadow-xs">
                  “Marks show what a student knows. MANAV helps a student see who they are becoming.”
                </div>
              </div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest mt-4">
                — DTU | MANAV —
              </p>
            </div>

            {/* Metrics Row */}
            <div className="mt-8 pt-6 border-t border-blue-200/60 grid grid-cols-3 gap-4 text-center">
              <div>
                <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono block">
                  1000+
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  Students Empowered
                </span>
              </div>
              <div>
                <BookOpen className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono block">
                  5
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  Dimensions of Growth
                </span>
              </div>
              <div>
                <Star className="w-5 h-5 text-amber-500 fill-amber-500 mx-auto mb-1" />
                <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono block">
                  100%
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  Better Tomorrow
                </span>
              </div>
            </div>
          </div>

          {/* Right Card: Start Your Journey Call to Action */}
          <div className="lg:col-span-5 bg-[#edf4fd] border border-blue-200/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                Start Your Journey
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Discover your strengths. Build your skills.
                <br />
                Create your future.
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => onOpenAuth('register', 'student')}
                className="flex-1 py-3 px-5 rounded-xl bg-[#0d47a1] hover:bg-[#0b3c8a] text-white font-bold text-xs sm:text-sm shadow transition flex items-center justify-center space-x-1.5"
              >
                <span>Enter as Student</span>
                <span>→</span>
              </button>
              <button
                onClick={() => onOpenAuth('register', 'teacher')}
                className="flex-1 py-3 px-5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs sm:text-sm shadow-xs transition flex items-center justify-center space-x-1.5"
              >
                <Users className="w-3.5 h-3.5 text-slate-600" />
                <span>Enter as Teacher</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. INSTITUTIONAL FOOTER */}
      <footer className="bg-[#0c2340] text-slate-300 py-6 px-4 sm:px-8 border-t border-[#16355d]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-center md:text-left">
          {/* Left: DTU */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-bold text-amber-300 shrink-0 text-xs">
              DTU
            </div>
            <div>
              <p className="font-bold text-white">Delhi Technological University</p>
              <p className="text-[11px] text-slate-400">(Formerly Delhi College of Engineering)</p>
            </div>
          </div>

          {/* Middle: National Emblem of India */}
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 flex items-center justify-center shrink-0">
              {/* Ashoka Lion emblem icon */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-amber-300">
                <path d="M12 2 L14 7 L19 7 L15 11 L17 16 L12 13 L7 16 L9 11 L5 7 L10 7 Z" />
                <circle cx="12" cy="18" r="3" fill="#ffffff" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-white">Ministry of Education</p>
              <p className="text-[11px] text-slate-400">Government of India</p>
            </div>
          </div>

          {/* Right: National Mission Mottos */}
          <div className="text-[11px] sm:text-xs font-semibold tracking-wider text-slate-300">
            Viksit Bharat &nbsp;|&nbsp; Shikshit Bharat &nbsp;|&nbsp; Saksham Yuva
          </div>
        </div>
      </footer>

      {/* MODAL 1: HOW IT WORKS */}
      {activeModal === 'how_it_works' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  ★
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">How MANAV Works</h3>
                  <p className="text-xs text-slate-500">The 4-Step Cycle of Human Development</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block mb-1">1. Set Growth Targets & Honest Struggles</strong>
                Students define qualities they wish to build (Self-Reliance, Communication, Patience) and areas of difficulty (Consistency, Procrastination).
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block mb-1">2. Daily 10-Question Development Test</strong>
                Non-academic questions exploring real-life ethical, relational, and self-direction dilemmas tailored to the student's profile.
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block mb-1">3. Mandatory Inward Reflection</strong>
                Each day concludes with recording realizations in the personal journal: observing resistance, lessons, and intentions for tomorrow.
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block mb-1">4. Verifiable Stature & Milestones</strong>
                Growth parameters track real evidence. Reaching 7-day streaks triggers milestone recognitions and teacher encouragement rewards.
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: SUCCESS STORIES */}
      {activeModal === 'success_stories' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                  ★
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Student Transformation Journeys</h3>
                  <p className="text-xs text-slate-500">Real Striving and Inward Evidence</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                <p className="italic font-serif text-slate-800 mb-2">
                  “I used to think being smart was only about scoring top marks in engineering math. MANAV forced me to see that my actual struggle was lack of consistency and fear of speaking in groups. Daily tests gave me the courage to change.”
                </p>
                <span className="text-[11px] font-bold text-amber-900">— 3rd Year Student, Computer Science</span>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                <p className="italic font-serif text-slate-800 mb-2">
                  “The reflection journal is the best part of my morning. Seeing my 7-day consistency streak and receiving a personal encouragement book from my professor gave me immense self-belief.”
                </p>
                <span className="text-[11px] font-bold text-blue-800">— 1st Year Student, Mechanical Engineering</span>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ABOUT DTU */}
      {activeModal === 'about_dtu' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-[#800000] p-0.5 bg-white shrink-0 shadow-xs ring-1 ring-red-100">
                  <img
                    src="/src/assets/images/dtu_official_logo_match_1791324125893.jpg"
                    alt="Delhi Technological University Official Seal"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Delhi Technological University</h3>
                  <p className="text-xs text-slate-500">Established 1941 • Formerly Delhi College of Engineering</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                Delhi Technological University (DTU), formerly known as Delhi College of Engineering (DCE), is one of India's premier technical institutions, with an illustrious history of more than eight decades of academic excellence.
              </p>
              <p>
                <strong>The MANAV Vision:</strong> Guided by Swami Vivekananda's philosophy that true education is "the manifestation of the perfection already in man," DTU developed MANAV to pioneer education that moves beyond marks to cultivate character, emotional resilience, willingness, and harmonious human beings.
              </p>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center space-x-3.5 text-xs text-amber-950">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-600/80 shrink-0 bg-amber-100 shadow-xs">
                  <img
                    src="/src/assets/images/swami_vivekananda_1791312815482.jpg"
                    alt="Swami Vivekananda"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <blockquote className="italic font-serif leading-snug">
                    «We want that education by which character is formed, strength of mind is increased, the intellect is expanded, and by which one can stand on one's own feet.»
                  </blockquote>
                  <p className="font-bold text-amber-900 text-[11px] mt-1.5">— Swami Vivekananda</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
