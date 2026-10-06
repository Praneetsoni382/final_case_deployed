import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import {
  X,
  Sparkles,
  Users,
  GraduationCap,
  Mail,
  Lock,
  User as UserIcon,
  Calendar,
  KeyRound,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Eye,
  EyeOff,
  Send,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  initialRole?: 'student' | 'teacher';
}

type AuthStep = 'select_role' | 'register_form' | 'login_form' | 'forgot_password' | 'registration_success';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'register',
  initialRole = 'student',
}) => {
  const { login, register, resendVerification, forgotPassword } = useAuth();

  const [step, setStep] = useState<AuthStep>('select_role');
  const [role, setRole] = useState<'student' | 'teacher'>(initialRole);

  // Form states
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<string>('16');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Link preview for sandbox environments
  const [verificationPreview, setVerificationPreview] = useState<string | null>(null);
  const [forgotPreview, setForgotPreview] = useState<string | null>(null);

  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccessMessage(null);
      setUnverifiedEmail(null);
      setVerificationPreview(null);
      setForgotPreview(null);
      if (initialMode === 'login') {
        setStep('login_form');
        setRole(initialRole);
      } else {
        setStep('select_role');
        setRole(initialRole);
      }
    }
  }, [isOpen, initialMode, initialRole]);

  if (!isOpen) return null;

  const handleSelectRole = (selectedRole: 'student' | 'teacher') => {
    setRole(selectedRole);
    setStep('register_form');
    setError(null);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!fullName.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Password and confirm password do not match.');
      return;
    }
    if (role === 'student' && (!age || Number(age) < 5 || Number(age) > 100)) {
      setError('Please enter a valid student age.');
      return;
    }

    try {
      setLoading(true);
      const res = await register({
        role,
        fullName: fullName.trim(),
        email: email.trim(),
        password, // Case-sensitive exact string preserved
        confirmPassword,
        age: role === 'student' ? Number(age) : undefined,
      });

      setSuccessMessage(
        res.message ||
          'Account created. We’ve sent a verification link to your email address. Please verify your email before logging in.'
      );
      if (res.verificationLinkPreview) {
        setVerificationPreview(res.verificationLinkPreview);
      }
      setStep('registration_success');
    } catch (err: any) {
      setError(err.message || 'Registration failed. An account with this email may already exist.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setUnverifiedEmail(null);

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login({
        email: email.trim(),
        password, // Case-sensitive exact string passed directly to backend
      });
      onClose();
    } catch (err: any) {
      if (err.data?.requiresVerification) {
        setUnverifiedEmail(err.data.email || email.trim());
        setError('Please verify your email address before logging in. Check your inbox for the verification link.');
      } else {
        setError('Incorrect email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerificationLink = async () => {
    const targetEmail = unverifiedEmail || email.trim();
    if (!targetEmail) return;

    try {
      setLoading(true);
      setError(null);
      const res = await resendVerification(targetEmail);
      setSuccessMessage(res.message || 'A new verification link has been dispatched to your email address.');
      if (res.verificationLinkPreview) {
        setVerificationPreview(res.verificationLinkPreview);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await forgotPassword(email.trim());
      setSuccessMessage(res.message || 'If an account with this email exists, a password reset link has been sent to your inbox.');
      if (res.resetLinkPreview) {
        setForgotPreview(res.resetLinkPreview);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process password reset request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Modal Top Bar */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0c2340] text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 leading-tight">MANAV</h3>
              <p className="text-[11px] text-slate-600 font-semibold uppercase tracking-wider">
                {step === 'select_role'
                  ? 'Authentication Portal'
                  : role === 'student'
                  ? 'Student Portal'
                  : 'Teacher Portal'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-800 text-xs sm:text-sm space-y-2">
            <div className="flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
            {unverifiedEmail && (
              <button
                type="button"
                onClick={handleResendVerificationLink}
                disabled={loading}
                className="ml-6 px-3 py-1 rounded-lg bg-rose-800 text-white font-bold text-xs hover:bg-rose-900 transition flex items-center space-x-1"
              >
                {loading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <span>Resend Verification Email</span>}
              </button>
            )}
          </div>
        )}

        {successMessage && (
          <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-slate-100 border border-slate-300 text-slate-900 text-xs sm:text-sm flex items-start space-x-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="p-6 overflow-y-auto max-h-[75vh]">
          {/* STEP 1: SELECT ROLE */}
          {step === 'select_role' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold font-serif text-slate-900">Who are you?</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Select your role to access your dedicated development environment.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Student Card */}
                <button
                  type="button"
                  onClick={() => handleSelectRole('student')}
                  className="p-6 rounded-3xl border-2 border-slate-200 hover:border-[#0c2340] bg-white hover:bg-slate-50 text-left transition group shadow-xs hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center mb-4 group-hover:scale-105 transition">
                      <GraduationCap className="w-6 h-6 text-[#0c2340]" />
                    </div>
                    <h4 className="font-bold text-lg text-slate-900">Student</h4>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      Understand yourself, choose target qualities, answer daily tests, reflect, and track authentic growth.
                    </p>
                  </div>
                  <div className="mt-5 flex items-center space-x-1.5 text-xs font-bold text-slate-900">
                    <span>Continue as Student</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </button>

                {/* Teacher Card */}
                <button
                  type="button"
                  onClick={() => handleSelectRole('teacher')}
                  className="p-6 rounded-3xl border-2 border-slate-200 hover:border-amber-600 bg-white hover:bg-amber-50/30 text-left transition group shadow-xs hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center mb-4 group-hover:scale-105 transition">
                      <Users className="w-6 h-6 text-amber-700" />
                    </div>
                    <h4 className="font-bold text-lg text-slate-900">Teacher</h4>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      Observe student progress, read reflections, encourage streaks, send real rewards, and guide human potential.
                    </p>
                  </div>
                  <div className="mt-5 flex items-center space-x-1.5 text-xs font-bold text-amber-800">
                    <span>Continue as Teacher</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </button>
              </div>

              <div className="pt-4 text-center border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Already registered?{' '}
                  <button
                    onClick={() => setStep('login_form')}
                    className="font-bold text-[#0c2340] hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: REGISTRATION FORM */}
          {step === 'register_form' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="flex items-center justify-between pb-2">
                <div>
                  <h3 className="text-xl font-bold font-serif text-slate-900">
                    {role === 'student' ? 'Student Registration' : 'Teacher Registration'}
                  </h3>
                  <p className="text-xs text-slate-500">Brevo email verification required before login</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('select_role')}
                  className="text-xs text-slate-500 hover:text-slate-800 underline"
                >
                  Switch Role
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Maya Sharma"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-800 bg-slate-50/50"
                  />
                </div>
              </div>

              {role === 'student' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="number"
                      required
                      min={5}
                      max={100}
                      value={age}
                      onChange={e => setAge(e.target.value)}
                      placeholder="e.g. 17"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-800 bg-slate-50/50"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-800 bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={password}
                      onChange={e => setPassword(e.target.value)} // Raw password string preserved
                      placeholder="Case-sensitive"
                      className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-800 bg-slate-50/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-800 bg-slate-50/50"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl bg-[#0c2340] hover:bg-[#14325a] text-white font-bold text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Create Account & Send Verification</span>}
              </button>

              <div className="pt-2 text-center">
                <p className="text-xs text-slate-500">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setStep('login_form')}
                    className="font-bold text-[#0c2340] hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* STEP 3: REGISTRATION SUCCESS / VERIFICATION SENT */}
          {step === 'registration_success' && (
            <div className="text-center space-y-5 py-2">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center mx-auto">
                <Mail className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-serif text-slate-900">Check Your Email Inbox</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed max-w-md mx-auto">
                  Account created. We’ve sent a verification link to <strong className="text-slate-900">{email}</strong>. Please click on the verification link in your inbox to verify your account before logging in.
                </p>
              </div>

              {verificationPreview && (
                <div className="p-4 rounded-2xl bg-slate-100 border border-slate-300 text-left space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>⚡ Verification Link:</span>
                    <a
                      href={verificationPreview}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0c2340] hover:underline flex items-center space-x-1"
                    >
                      <span>Open Link</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <p className="text-[11px] font-mono text-slate-600 break-all bg-white p-2 rounded-lg border border-slate-200">
                    {verificationPreview}
                  </p>
                </div>
              )}

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep('login_form')}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0c2340] text-white font-bold text-xs hover:bg-[#14325a] transition"
                >
                  Proceed to Sign In
                </button>
                <button
                  type="button"
                  onClick={handleResendVerificationLink}
                  disabled={loading}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition"
                >
                  Resend Verification Email
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: LOGIN FORM */}
          {step === 'login_form' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="text-center pb-2">
                <h3 className="text-xl font-bold font-serif text-slate-900">Sign In to MANAV</h3>
                <p className="text-xs text-slate-500 mt-0.5">Resume your continuous human development journey</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-800 bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setSuccessMessage(null);
                      setStep('forgot_password');
                    }}
                    className="text-xs text-[#0c2340] font-semibold hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)} // Raw case-sensitive string preserved
                    placeholder="Enter exact password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-800 bg-slate-50/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl bg-[#0c2340] hover:bg-[#14325a] text-white font-bold text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Sign In</span>}
              </button>

              <div className="pt-2 text-center">
                <p className="text-xs text-slate-500">
                  Don’t have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => setStep('select_role')}
                    className="font-bold text-[#0c2340] hover:underline"
                  >
                    Register Now
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* STEP 5: FORGOT PASSWORD FORM */}
          {step === 'forgot_password' && (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div className="text-center pb-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center mx-auto mb-2">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-serif text-slate-900">Forgot Password</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your email address and we will send a password reset link via Brevo.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                  />
                </div>
              </div>

              {forgotPreview && (
                <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-300 text-xs text-left space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>⚡ Password Reset Link:</span>
                    <a
                      href={forgotPreview}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0c2340] underline"
                    >
                      Reset Now
                    </a>
                  </div>
                  <p className="font-mono text-[11px] text-slate-600 break-all bg-white p-2 rounded border border-slate-200">
                    {forgotPreview}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#0c2340] hover:bg-[#14325a] text-white font-bold text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Send Password Reset Email</span>}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setStep('login_form')}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-900 underline"
                >
                  ← Return to Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
