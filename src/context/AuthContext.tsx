import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.ts';
import { api, localClientDb } from '../lib/api.ts';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  onboardingCompleted: boolean;
  currentView: string;
  selectedStudentId: string | null;
  unreadMessages: number;
  unreadNotifications: number;
  login: (payload: { email: string; password: string }) => Promise<any>;
  register: (payload: {
    role: 'student' | 'teacher';
    fullName: string;
    email: string;
    password: string;
    confirmPassword?: string;
    age?: number;
  }) => Promise<any>;
  verifyEmail: (token: string) => Promise<any>;
  resendVerification: (email: string) => Promise<any>;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (payload: { token: string; newPassword: string; confirmPassword?: string }) => Promise<any>;
  logout: () => Promise<void>;
  setOnboardingCompleted: (val: boolean) => void;
  navigate: (view: string, studentId?: string | null) => void;
  refreshSession: () => Promise<void>;
  refreshCounts: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Pre-load from local storage database cache so there is 0ms delay and zero buffering circle
  const cached = localClientDb.get<{ user: User; onboardingCompleted: boolean }>('session', 15 * 60 * 1000);

  const [user, setUser] = useState<User | null>(cached?.user || null);
  const [loading, setLoading] = useState<boolean>(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(
    cached ? cached.onboardingCompleted : true
  );
  const [currentView, setCurrentView] = useState<string>('landing');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [unreadMessages, setUnreadMessages] = useState<number>(0);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);

  const refreshCounts = async () => {
    if (!user) return;
    try {
      const [msgRes, notifRes] = await Promise.allSettled([
        api.getUnreadMessageCount(),
        api.getNotifications(),
      ]);

      if (msgRes.status === 'fulfilled') {
        setUnreadMessages(msgRes.value.unreadCount);
      }
      if (notifRes.status === 'fulfilled') {
        const unread = notifRes.value.notifications.filter(n => !n.read).length;
        setUnreadNotifications(unread);
      }
    } catch {
      // background polling
    }
  };

  const refreshSession = async () => {
    // If no token exists, stay unauthenticated
    if (!api.getToken()) {
      setUser(null);
      return;
    }

    try {
      const res = await api.getMe();
      setUser(res.user);
      setOnboardingCompleted(res.onboardingCompleted);
      localClientDb.set('session', { user: res.user, onboardingCompleted: res.onboardingCompleted });

      // Note: We deliberately DO NOT auto-redirect away from landing page!
      // When users visit the link, they remain on the landing page as required.
      await refreshCounts();
    } catch {
      api.clearToken();
      localClientDb.clearAll();
      setUser(null);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const login = async (payload: { email: string; password: string }) => {
    const data = await api.login(payload);
    setUser(data.user);
    setOnboardingCompleted(data.onboardingCompleted);

    if (data.user.role === 'student') {
      if (!data.onboardingCompleted) {
        setCurrentView('student_onboarding');
      } else {
        setCurrentView('student_dashboard');
      }
    } else {
      setCurrentView('teacher_dashboard');
    }

    await refreshCounts();
    return data;
  };

  const register = async (payload: {
    role: 'student' | 'teacher';
    fullName: string;
    email: string;
    password: string;
    confirmPassword?: string;
    age?: number;
  }) => {
    return api.register(payload);
  };

  const verifyEmail = async (token: string) => {
    const data = await api.verifyEmail(token);
    setUser(data.user);
    setOnboardingCompleted(data.onboardingCompleted);

    if (data.user.role === 'student') {
      if (!data.onboardingCompleted) {
        setCurrentView('student_onboarding');
      } else {
        setCurrentView('student_dashboard');
      }
    } else {
      setCurrentView('teacher_dashboard');
    }

    await refreshCounts();
    return data;
  };

  const resendVerification = async (email: string) => {
    return api.resendVerification(email);
  };

  const forgotPassword = async (email: string) => {
    return api.forgotPassword(email);
  };

  const resetPassword = async (payload: { token: string; newPassword: string; confirmPassword?: string }) => {
    return api.resetPassword(payload);
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    setCurrentView('landing');
    setSelectedStudentId(null);
    setUnreadMessages(0);
    setUnreadNotifications(0);
  };

  const navigate = (view: string, studentId: string | null = null) => {
    setCurrentView(view);
    if (studentId !== undefined) {
      setSelectedStudentId(studentId);
    }
    
    // Dynamically clear address bar query and trigger popstate to unmount verify/reset views
    if (window.location.pathname !== '/' || window.location.search) {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        onboardingCompleted,
        currentView,
        selectedStudentId,
        unreadMessages,
        unreadNotifications,
        login,
        register,
        verifyEmail,
        resendVerification,
        forgotPassword,
        resetPassword,
        logout,
        setOnboardingCompleted,
        navigate,
        refreshSession,
        refreshCounts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
