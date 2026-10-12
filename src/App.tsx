/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { PortalLayout } from './components/PortalLayout.tsx';
import { NotificationsModal } from './components/NotificationsModal.tsx';
import { AuthModal } from './views/AuthModal.tsx';
import { LandingPage } from './views/LandingPage.tsx';
import { VerifyEmailView } from './views/VerifyEmailView.tsx';
import { ResetPasswordView } from './views/ResetPasswordView.tsx';
import { StudentOnboarding } from './views/StudentOnboarding.tsx';
import { StudentDashboard } from './views/StudentDashboard.tsx';
import { DailyTestView } from './views/DailyTestView.tsx';
import { ReflectionView } from './views/ReflectionView.tsx';
import { ReflectionJournalView } from './views/ReflectionJournalView.tsx';
import { MyGrowthView } from './views/MyGrowthView.tsx';
import { MyRewardsView } from './views/MyRewardsView.tsx';
import { MyStorageView } from './views/MyStorageView.tsx';
import { MessagesView } from './views/MessagesView.tsx';
import { StudentProfileView } from './views/StudentProfileView.tsx';
import { TeacherDashboard } from './views/TeacherDashboard.tsx';
import { TeacherStudentDetailView } from './views/TeacherStudentDetailView.tsx';

function MainApp() {
  const { user, currentView, selectedStudentId, onboardingCompleted, loading } = useAuth();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('register');
  const [authInitialRole, setAuthInitialRole] = useState<'student' | 'teacher'>('student');
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);

  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openAuth = (mode: 'login' | 'register' = 'register', role: 'student' | 'teacher' = 'student') => {
    setAuthInitialMode(mode);
    setAuthInitialRole(role);
    setAuthModalOpen(true);
  };

  // Handle URL Email Verification route
  if (pathname === '/verify-email' || window.location.search.includes('token=')) {
    if (window.location.search.includes('reset') || pathname === '/reset-password') {
      return <ResetPasswordView />;
    }
    return <VerifyEmailView />;
  }

  // Handle URL Reset Password route
  if (pathname === '/reset-password') {
    return <ResetPasswordView />;
  }

  const renderActiveView = () => {
    // If user is unauthenticated or on landing
    if (!user || currentView === 'landing') {
      return <LandingPage onOpenAuth={openAuth} />;
    }

    // Student Views
    if (user.role === 'student') {
      if (!onboardingCompleted || currentView === 'student_onboarding') {
        return <StudentOnboarding />;
      }

      return (
        <PortalLayout onOpenNotifications={() => setNotificationsModalOpen(true)}>
          {currentView === 'student_test' && <DailyTestView />}
          {currentView === 'reflection' && <ReflectionView />}
          {currentView === 'reflection_journal' && <ReflectionJournalView />}
          {currentView === 'growth' && <MyGrowthView />}
          {currentView === 'rewards' && <MyRewardsView />}
          {currentView === 'storage' && <MyStorageView />}
          {currentView === 'messages' && <MessagesView />}
          {currentView === 'profile' && <StudentProfileView />}
          {(currentView === 'student_dashboard' ||
            ![
              'student_test',
              'reflection',
              'reflection_journal',
              'growth',
              'rewards',
              'storage',
              'messages',
              'profile',
            ].includes(currentView)) && <StudentDashboard />}
        </PortalLayout>
      );
    }

    // Teacher Views
    if (user.role === 'teacher') {
      return (
        <PortalLayout onOpenNotifications={() => setNotificationsModalOpen(true)}>
          {currentView === 'teacher_student_detail' &&
            (selectedStudentId ? (
              <TeacherStudentDetailView studentId={selectedStudentId} />
            ) : (
              <TeacherDashboard />
            ))}
          {currentView === 'storage' && <MyStorageView />}
          {currentView === 'messages' && <MessagesView />}
          {(currentView === 'teacher_dashboard' ||
            !['teacher_student_detail', 'storage', 'messages'].includes(currentView)) && (
            <TeacherDashboard />
          )}
        </PortalLayout>
      );
    }

    return <LandingPage onOpenAuth={openAuth} />;
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col font-sans">
      <main className="flex-1">{renderActiveView()}</main>

      {/* Global Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authInitialMode}
        initialRole={authInitialRole}
      />

      <NotificationsModal
        isOpen={notificationsModalOpen}
        onClose={() => setNotificationsModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
