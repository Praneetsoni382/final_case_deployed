import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.ts';
import { api } from '../lib/api.ts';

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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(true);
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
    try {
      const res = await api.getMe();
      setUser(res.user);
      setOnboardingCompleted(res.onboardingCompleted);

      // Auto route to appropriate view if on landing or auth
      if (currentView === 'landing' || currentView === 'auth') {
        if (res.user.role === 'student') {
          if (!res.onboardingCompleted) {
            setCurrentView('student_onboarding');
          } else {
            setCurrentView('student_dashboard');
          }
        } else {
          setCurrentView('teacher_dashboard');
        }
      }

      await refreshCounts();
    } catch {
      api.clearToken();
      setUser(null);
    } finally {
      setLoading(false);
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
