import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { Sparkles, CheckCircle2, AlertCircle, RefreshCw, Mail, ArrowRight } from 'lucide-react';

export const VerifyEmailView: React.FC = () => {
  const { user, onboardingCompleted, verifyEmail, resendVerification, navigate } = useAuth();

  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Resend state
  const [resendEmail, setResendEmail] = useState('');
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);

  const verificationInitiated = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    if (urlToken) {
      setToken(urlToken);
    }
  }, []);

  useEffect(() => {
    if (token && !verificationInitiated.current) {
      verificationInitiated.current = true;
      handleVerify();
    }
  }, [token]);

  const handleVerify = async () => {
    if (!token) return;
    try {
      setVerifying(true);
      setError(null);
      const res = await verifyEmail(token);
      setSuccess(res.message || 'Email verified successfully. You can now continue to your dashboard.');
      
      // Automatically redirect after 2.5 seconds
      setTimeout(() => {
        if (res.user.role === 'student') {
          navigate(res.onboardingCompleted ? 'student_dashboard' : 'student_onboarding');
        } else {
          navigate('teacher_dashboard');
        }
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'This verification link is invalid or has expired. Please request a new verification email.');
    } finally {
      setVerifying(false);
    }
  };

  const handleResendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail.trim()) return;

    try {
      setResendLoading(true);
      setResendMessage(null);
      const res = await resendVerification(resendEmail.trim());
      setResendMessage(res.message || 'A new verification link has been sent to your email address.');
      if (res.verificationLinkPreview) {
        console.log('[VERIFICATION LINK PREVIEW]:', res.verificationLinkPreview);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/80 flex items-center justify-center p-4 font-sans">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#0c2340] text-amber-300 flex items-center justify-center mx-auto shadow-md">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold font-serif text-slate-900">MANAV Account Verification</h1>
          <p className="text-xs text-amber-800 font-bold uppercase tracking-wider">
            Awakening Human Potential
          </p>
        </div>

        {/* Success State */}
        {success ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">Email Verified Successfully!</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hello! Welcome to MANAV. Your email address has been verified successfully. You can now access your portal.
            </p>
            <button
              onClick={() => {
                if (user?.role === 'student') {
                  navigate(onboardingCompleted ? 'student_dashboard' : 'student_onboarding');
                } else {
                  navigate('teacher_dashboard');
                }
              }}
              className="w-full py-3 rounded-xl bg-[#0c2340] hover:bg-[#14325a] text-white font-bold text-sm shadow-md transition flex items-center justify-center space-x-2"
            >
              <span>Continue to Portal Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            {/* Token Prompt State */}
            {token ? (
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-4">
                <Mail className="w-10 h-10 text-[#0c2340] mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">Ready to Verify</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Hello! Welcome to MANAV. Please click on the <strong>Verify Email</strong> option below to complete your registration.
                  </p>
                </div>

                {error && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs text-left flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  onClick={handleVerify}
                  disabled={verifying}
                  className="w-full py-3.5 rounded-xl bg-[#0c2340] hover:bg-[#14325a] text-white font-bold text-sm shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {verifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying Token...</span>
                    </>
                  ) : (
                    <span>Verify Email Address</span>
                  )}
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
                <span>No verification token provided in the link address.</span>
              </div>
            )}

            {/* Resend Verification Form */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-900">Need a new verification link?</h4>
              <p className="text-[11px] text-slate-500">
                Enter your account email below to receive a fresh verification link via Brevo transactional email.
              </p>

              {resendMessage && (
                <div className="p-3 rounded-xl bg-slate-100 border border-slate-300 text-slate-900 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{resendMessage}</span>
                </div>
              )}

              <form onSubmit={handleResendSubmit} className="space-y-2">
                <input
                  type="email"
                  required
                  value={resendEmail}
                  onChange={e => setResendEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                />
                <button
                  type="submit"
                  disabled={resendLoading}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {resendLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <span>Resend Verification Email</span>}
                </button>
              </form>
            </div>
          </>
        )}

        {/* Back Link */}
        <div className="text-center pt-2">
          <button
            onClick={() => navigate('landing')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
          >
            ← Return to Public Homepage
          </button>
        </div>
      </div>
    </div>
  );
};
